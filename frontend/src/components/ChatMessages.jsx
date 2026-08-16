import React, { useEffect, useRef, useMemo } from 'react';
import SendIcon from '../assets/send.svg';

function ChatMessages({ messages, currentUser, chatName, isLoading, messageText, onMessageTextChange, onSendMessage, isSending }) {
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }
    const isCurrentUser = (userId) => {
        return currentUser && currentUser.id === userId;
    }
    const bottomRef = useRef(null);

    const uniqueMessages = useMemo(() => {
    
    const map = new Map();
        for (const m of messages) {
            map.set(m.id, m);
        }
        return Array.from(map.values());
    }, [messages]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    },[uniqueMessages]);


    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
        }
    };

    return (
        <div className="chat-messages">
            <div style={{ padding: '8px 6px', borderBottom: '1px solid var(--border-color)' }}>
                <h2 style={{ margin: 0 }}>{chatName || 'Select a chat'}</h2>
                {/* <p style={{ margin: '6px 0 0 0', color: '#6b7280', fontSize: '13px' }}>
                    {isLoading ? 'Loading messages...' : `${messages.length} message${messages.length === 1 ? '' : 's'}`}
                </p> */}
            </div>



            {isLoading && (
                <div className='boxLoad loading-container'>
                    <div className='boxLoad1'></div>
                    <div className='boxLoad2'></div>
                    <div className='boxLoad3'></div>
                </div>
            )}

            {!isLoading && messages.length === 0 && (
                <div style={{ padding: '16px 18px', color: '#6b7280' }}>No messages yet in this ticket conversation.</div>
            )}

            <div className='chat-message-item'>
                {uniqueMessages.map((message) => (
                    <div key={message.id} className={`chat-bubble ${message.sender?.id === currentUser?.id ? 'sent' : 'received'}`}>
                        <div className="message-header">
                            <div className="sender-name">{message.sender?.name || message.sender?.email || 'Unknown sender'}</div>
                            <div className="timestamp">{formatTimestamp(message.sentAt)}</div>
                        </div>
                        <div className="message-content">
                            {message.content}
                        </div>
                    </div>
                ))}
                {}
                <div ref={bottomRef} />
            </div>


            <form
                onSubmit={onSendMessage}
                style={{
                    padding: '16px 18px',
                    borderTop: '1px solid var(--border-color)',
                    display: 'flex',
                    gap: '10px',
                }}
            >
                <textarea
                    id="messageContent"
                    value={messageText}
                    onChange={(event) => onMessageTextChange(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    rows="1"
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        resize: 'none',
                        fontFamily: 'inherit',
                    }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        type="submit"
                        disabled={isLoading || isSending || !chatName}
                        style={{
                            padding: '10px 16px',
                            border: 'none',
                            borderRadius: '8px',
                            // backgroundColor: isLoading || isSending || !chatName ? '#9ca3af00' : 'var(--primary-color)',
                            // color: '#fff',
                            fontWeight: 600,
                            cursor: isLoading || isSending || !chatName ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {(() => {
                            if (isSending) {
                                return <img src={SendIcon} alt="Send" style={{ width: '16px', height: '16px', opacity: '0.5' }} />;
                            } else {
                                return <img src={SendIcon} alt="Send" style={{ width: '16px', height: '16px' }} />;
                            }
                        })()}
                    </button>
                </div>
            </form>
        </div>
    );
}
export default ChatMessages;