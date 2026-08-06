import React, { useEffect, useState } from 'react';
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

    const loadMessages = async (chatId) => {
        if (!chatId) {
            setMessages([]);
            return;
        }

        try {
            setIsLoadingMessages(true);
            const token = localStorage.getItem(TOKEN_KEY);

            const response = await fetch(`${API_BASE_URL}/api/chats/messages/${chatId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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

        try {
            setIsSendingMessage(true);
            setErrorMessage('');

            const token = localStorage.getItem(TOKEN_KEY);

            const response = await fetch(`${API_BASE_URL}/api/chats/messages/${selectedChat.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ content: messageText }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send message.');
            }

            setMessageText('');
            await loadMessages(selectedChat.id);
        } catch (error) {
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