import React from 'react';
import {useEffect, useRef} from 'react';

function ChatMessages({ messages, currentUser, chatName, isLoading, messageText, onMessageTextChange, onSendMessage, isSending }) {
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }
    const isCurrentUser = (userId) => {
        return currentUser && currentUser.id === userId;
    }
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    },[messages]);



    return (
        <div className="chat-messages">
            <div style={{ padding: '8px 6px', borderBottom: '1px solid var(--border-color)' }}>
                <h2 style={{ margin: 0 }}>{chatName || 'Select a chat'}</h2>
                <p style={{ margin: '6px 0 0 0', color: '#6b7280', fontSize: '13px' }}>
                    {isLoading ? 'Loading messages...' : `${messages.length} message${messages.length === 1 ? '' : 's'}`}
                </p>
            </div>



            {isLoading && (
                <div className='pulse'>
                    <div className='loading-box' style={{height: '50px'}}></div>
                    <div className='loading-box' style={{height: '50px'}}></div>
                    <div className='loading-box' style={{height: '50px'}}></div>
                    <div className='loading-box' style={{height: '50px'}}></div>
                    <div className='loading-box' style={{height: '50px'}}></div>
                </div>
            )}

            {!isLoading && messages.length === 0 && (
                <div style={{ padding: '16px 18px', color: '#6b7280' }}>No messages yet in this ticket conversation.</div>
            )}

            <div className='chat-message-item'>
                {messages.map((message) => (
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
                            backgroundColor: isLoading || isSending || !chatName ? '#9ca3af' : 'var(--primary-color)',
                            color: '#fff',
                            fontWeight: 600,
                            cursor: isLoading || isSending || !chatName ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {isSending ? 'Sending...' : 'Send Message'}
                    </button>
                </div>
            </form>
        </div>
    );
}
export default ChatMessages;