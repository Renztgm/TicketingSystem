import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/NavBarComponent';
import ChatMessages from '../components/ChatMessages';
import ChatList from '../components/ChatList';

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

    const loadMessages = async (chatId, { silent = false } = {}) => {
        if (!chatId) {
            setMessages([]);
            return;
        }

        try {
            if (!silent) setIsLoadingMessages(true);
            const token = localStorage.getItem(TOKEN_KEY);

            const response = await fetch(`${API_BASE_URL}/api/chats/messages/${chatId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to load messages.');
            }

            const serverMessages = Array.isArray(data.messages) ? data.messages : [];
            setMessages((prev) => {
                const stillPending = prev.filter((m) => pendingIdsRef.current.has(m.id));
                return [...serverMessages, ...stillPending];
            });
        } catch (error) {
            if (!silent) {
                setMessages([]);
                setErrorMessage(error.message || 'Could not load messages.');
            }
        } finally {
            if (!silent) setIsLoadingMessages(false);
        }
    };

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const token = localStorage.getItem(TOKEN_KEY);

                const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to load profile.');
                }

                setProfile(data.user);
            } catch (error) {
                setErrorMessage(error.message);
            }
        };

        loadProfile();
    }, []);

    useEffect(() => {
        if (!profile) {
            return;
        }

        const loadChats = async () => {
            try {
                setIsLoadingChats(true);
                const token = localStorage.getItem(TOKEN_KEY);

                const response = await fetch(`${API_BASE_URL}/api/tickets/history`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to load chats.');
                }

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

        // Show it instantly + mark as pending so polling won't erase it
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

            const savedMessage = data.data;
            
            pendingIdsRef.current.delete(tempId);
            if (savedMessage) {
                setMessages((prev) =>
                    prev.map((m) => (m.id === tempId ? data.data : m))
                );
            } 
            else {
                setMessages((prev) => prev.filter((m) => m.id !== tempId)
            );
            }

        } catch (error) {
            pendingIdsRef.current.delete(tempId);
            setMessages((prev) => prev.filter((m) => m.id !== tempId));
            setErrorMessage(error.message || 'Could not send the message.');
        } finally {
            setIsSendingMessage(false);
        }
    };

    useEffect(() => {
        if (!selectedChat) {
            return;
        }

        const interval = setInterval(() => {
            loadMessages(selectedChat.id, { silent: true });
        }, 4000);
        return () => clearInterval(interval);
    }, [selectedChat]);

    if (errorMessage) {
        return <div className="loading-spinner"><p>{errorMessage}</p></div>;
    }

    if (!profile) {
        return <div className="loading-spinner"><p>Loading Chats...</p></div>;
    }

    return (
        <div className="dashboard-wrapper">
            <nav>
                <Navbar />
            </nav>
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