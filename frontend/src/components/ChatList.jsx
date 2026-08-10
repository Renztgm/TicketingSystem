function ChatList({ chats, currentUser, onSelectChat, selectedChatId, isLoading }) {
    const handleChatClick = (chat) => {
        onSelectChat(chat);
    };

    return (
        <div className="chat-list">
            <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border-color)' }}>
                <h2 style={{ margin: 0 }}>Chats</h2>
            </div>

            {isLoading && (
                <div className="chat-item">
                    Loading chats...
                </div>
            )}

            {!isLoading && chats.length === 0 && (
                <div className="chat-item">
                    No tickets with chat threads yet.
                </div>
            )}

            {chats.map((chat) => (
                <div
                    key={chat.id}
                    onClick={() => handleChatClick(chat)}
                    className="chat-item"
                    style={{
                        cursor: 'pointer',
                        backgroundColor: chat.id === selectedChatId ? '#EAF3DE' : 'transparent',
                        borderLeft: chat.id === selectedChatId ? '3px solid var(--primary-color)' : '3px solid transparent',
                    }}
                >
                    <p style={{ margin: '0', fontSize: '10px' }}>{chat.id}</p>
                    <div className="chat-item-details">
                        <h5 style={{ margin: '0 0 2px 0', fontSize: '14px' }}>{chat.name}</h5>
                        <p style={{ margin: 0, color: '#6b7280', fontSize: '12px' }}>
                            {chat.status} · {chat.category}
                        </p>
                    </div>
                    
                </div>
            ))}
        </div>
    );
}
export default ChatList;