import React from 'react';

function ChatMessages({ messages, currentUser, chatName, isLoading, messageText, onMessageTextChange, onSendMessage, isSending }) {
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }
    const isCurrentUser = (userId) => {
        return currentUser && currentUser.id === userId;
    }

    return (
        <div className="chat-messages">
            <div style={{ padding: '8px 6px', borderBottom: '1px solid var(--border-color)' }}>
                <h2 style={{ margin: 0 }}>{chatName || 'Select a chat'}</h2>
                <p style={{ margin: '6px 0 0 0', color: '#6b7280', fontSize: '13px' }}>
                    {isLoading ? 'Loading messages...' : `${messages.length} message${messages.length === 1 ? '' : 's'}`}
                </p>
            </div>

            {isLoading && (
                <div style={{ padding: '16px 18px', color: '#6b7280' }}>Fetching conversation...</div>
            )}

            {!isLoading && messages.length === 0 && (
                <div style={{ padding: '16px 18px', color: '#6b7280' }}>No messages yet in this ticket conversation.</div>
            )}

            {messages.map((message) => (
                <div key={message.id} className="chat-container">
                    <div className="message-header">
                        <div className="sender-name">{message.sender?.name || message.sender?.email || 'Unknown sender'}</div>
                        <div className="timestamp">{formatTimestamp(message.sentAt)}</div>
                    </div>
                    <div className="message-content">
                        {message.content}
                    </div>
                </div>
            ))}

            <form
                onSubmit={onSendMessage}
                style={{
                    marginTop: '16px',
                    padding: '16px 18px',
                    borderTop: '1px solid var(--border-color)',
                    display: 'grid',
                    gap: '10px',
                }}
            >
                <label htmlFor="messageContent" style={{ fontWeight: 600 }}>New Message</label>
                <textarea
                    id="messageContent"
                    value={messageText}
                    onChange={(event) => onMessageTextChange(event.target.value)}
                    placeholder="Type your message..."
                    rows="4"
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        resize: 'vertical',
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