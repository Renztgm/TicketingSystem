import React, { createContext, useCallback, useContext, useState } from 'react';
import '../css/styles.css';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    const closeNotification = useCallback((id) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, exiting: true } : n))
        );
        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 200);
    }, []);

    const showNotification = useCallback(({ type = 'success', title, message, duration = 4000 }) => {
        const id = `${Date.now()}-${Math.random()}`;
        setNotifications((prev) => [...prev, { id, type, title, message }]);

        if (duration) {
            setTimeout(() => closeNotification(id), duration);
        }

        return id;
    }, [closeNotification]);

    return (
        <NotificationContext.Provider value={{ showNotification, closeNotification }}>
            {children}
            <div className="notification-container">
                {notifications.map((n) => (
                    <div key={n.id} className={`notification ${n.type} ${n.exiting ? 'exiting' : ''}`}>
                        <div className="notification-content">
                            {n.title && <p className="notification-title">{n.title}</p>}
                            <p className="notification-message">{n.message}</p>
                        </div>
                        <button className="notification-close" onClick={() => closeNotification(n.id)}>×</button>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const ctx = useContext(NotificationContext);
    if (!ctx) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return ctx;
}