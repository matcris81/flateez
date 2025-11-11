import { useState, useEffect } from 'react';
import api from '../api/client';

export default function Messages() {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data } = await api.get('/messages');
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages');
    }
  };

  return (
    <div>
      <h1>Messages</h1>
      <div>
        {messages.map(msg => (
          <div key={msg._id} style={{padding: '1rem', background: 'white', marginBottom: '1rem', borderRadius: '0.5rem'}}>
            <p><strong>From:</strong> {msg.senderId.firstName} {msg.senderId.lastName}</p>
            <p>{msg.content}</p>
            <small>{new Date(msg.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
