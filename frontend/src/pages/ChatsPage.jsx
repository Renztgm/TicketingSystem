import React, { useEffect, useState, useRef } from 'react';
import { io as ioClient } from 'socket.io-client';
import Navbar from '../components/NavBarComponent';
import ChatMessages from '../components/ChatMessages';
import ChatList from '../components/ChatList';
import { getSocket } from '../lib/socket'; 

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'ticketing_token';

function ChatsPage() {
    const [profile, setProfile] = useState(null);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoadingChats, setIsLoadingChats] = useState(false);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isSendingMessage, setIsSendingMessage] = useState(false);

    const pendingIdsRef = useRef(new Set());
    const socketRef = useRef(null);

    const loadMessages = async (chatId) => {
        if (!chatId) {
            setMessages([]);
            return;
        }

        try {
            setIsLoadingMessages(true);
            const token = localStorage.getItem(TOKEN_KEY);

            const response = await fetch(`${API_BASE_URL}/api/chats/messages/${chatId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to load messages.');
            }

            setMessages(Array.isArray(data.messages) ? data.messages : []);
        } catch (error) {
            setMessages([]);
            setErrorMessage(error.message || 'Could not load messages.');
        } finally {
            setIsLoadingMessages(false);
        }
    };

    // --- Load profile (unchanged) ---
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const token = localStorage.getItem(TOKEN_KEY);
                const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Failed to load profile.');
                setProfile(data.user);
            } catch (error) {
                setErrorMessage(error.message);
            }
        };
        loadProfile();
    }, []);

    // --- Load chats (unchanged) ---
    useEffect(() => {
        if (!profile) return;

        const loadChats = async () => {
            try {
                setIsLoadingChats(true);
                const token = localStorage.getItem(TOKEN_KEY);
                const response = await fetch(`${API_BASE_URL}/api/tickets/history`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Failed to load chats.');

                const mappedChats = (data.tickets || []).map((ticket) => ({
                    id: ticket.id,
                    name: ticket.title,
                    status: ticket.status,
                    category: ticket.category,
                    createdAt: ticket.createdAt,
                    updatedAt: ticket.updatedAt,
                }));

                setChats(mappedChats);

                if (mappedChats.length > 0) {
                    setSelectedChat(mappedChats[0]);
                    await loadMessages(mappedChats[0].id);
                } else {
                    setSelectedChat(null);
                    setMessages([]);
                }
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setIsLoadingChats(false);
            }
        };

        loadChats();
    }, [profile]);

    // --- NEW: connect the socket once, on mount ---
    useEffect(() => {
        const socket = getSocket();
        socketRef.current = socket;

        socket.on('connect', () => console.log('✅ socket connected:', socket.id));
        socket.on('connect_error', (err) => console.log('❌ socket connect error:', err.message));

        return () => {
            socket.off('connect');
            socket.off('connect_error');
        };
    }, []);

    // --- NEW: join/leave the room for the active chat, listen for new messages ---
useEffect(() => {
    const socket = socketRef.current;
    if (!selectedChat || !socket) return;

    socket.emit('joinChat', selectedChat.id);

    // Nuke any stale listeners left over from previous Fast Refresh cycles,
    // regardless of whether they're the "same" function reference or not.
    socket.off('newMessage');

    const handleNewMessage = (incoming) => {
        setMessages((prev) => {
            if (prev.some((m) => m.id === incoming.id)) {
                return prev;
            }

            const tempIdx = prev.findIndex(
                (m) =>
                    pendingIdsRef.current.has(m.id) &&
                    m.content === incoming.content &&
                    m.sender?.id === incoming.senderId
            );
            if (tempIdx !== -1) {
                const updated = [...prev];
                pendingIdsRef.current.delete(prev[tempIdx].id);
                updated[tempIdx] = incoming;
                return updated;
            }

            return [...prev, incoming];
        });
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
        socket.emit('leaveChat', selectedChat.id);
        socket.off('newMessage', handleNewMessage);
    };
}, [selectedChat]);

    const handleSelectChat = async (chat) => {
        setSelectedChat(chat);
        setMessageText('');
        setErrorMessage('');
        await loadMessages(chat.id);
    };

    const handleSendMessage = async (event) => {
        event.preventDefault();

        if (!selectedChat) {
            setErrorMessage('Select a chat first.');
            return;
        }
        if (!messageText.trim()) {
            setErrorMessage('Message content is required.');
            return;
        }

        const contentToSend = messageText;
        const tempId = `temp-${Date.now()}`;

        const tempMessage = {
            id: tempId,
            content: contentToSend,
            sender: profile,
            sentAt: new Date().toISOString(),
            pending: true,
        };

        pendingIdsRef.current.add(tempId);
        setMessages((prev) => [...prev, tempMessage]);
        setMessageText('');
        setErrorMessage('');

        try {
            setIsSendingMessage(true);
            const token = localStorage.getItem(TOKEN_KEY);

            const response = await fetch(`${API_BASE_URL}/api/chats/messages/${selectedChat.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ content: contentToSend }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send message.');
            }

            const savedMessage = data.data; // matches your backend's { message, data } shape

            pendingIdsRef.current.delete(tempId);
            setMessages((prev) => {
                if (!prev.some((m) => m.id === tempId)) return prev; // socket already replaced it
                return prev.map((m) => (m.id === tempId ? savedMessage : m));
            });
        } catch (error) {
            pendingIdsRef.current.delete(tempId);
            setMessages((prev) => prev.filter((m) => m.id !== tempId));
            setErrorMessage(error.message || 'Could not send the message.');
        } finally {
            setIsSendingMessage(false);
        }
    };

    if (errorMessage) {
        return <div className="loading-spinner"><p>{errorMessage}</p></div>;
    }
    if (!profile) {
        return <div className="loading-spinner"><p>Loading Chats...</p></div>;
    }

    return (
        <div className="dashboard-wrapper">
            <nav><Navbar /></nav>
            <div className="chats-wrapper">
                <ChatList
                    chats={chats}
                    currentUser={profile}
                    selectedChatId={selectedChat?.id}
                    onSelectChat={handleSelectChat}
                    isLoading={isLoadingChats}
                />
                <ChatMessages
                    messages={messages}
                    currentUser={profile}
                    chatName={selectedChat?.name}
                    isLoading={isLoadingMessages}
                    messageText={messageText}
                    onMessageTextChange={setMessageText}
                    onSendMessage={handleSendMessage}
                    isSending={isSendingMessage}
                />
            </div>
        </div>
    );
}

export default ChatsPage;