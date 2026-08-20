import React, { useState, useRef, useEffect } from 'react';
import { aiApi } from '../services/aiApi';

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const toggleWidget = () => setIsOpen(!isOpen);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    
    // Enforce max 15 messages (slice the last 15 to keep history short)
    const constrainedMessages = newMessages.slice(-15);
    
    setMessages(constrainedMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await aiApi.chat(constrainedMessages);
      if (response.data && response.data.success) {
        setMessages((prev) => [...prev, { role: 'assistant', content: response.data.data.message }]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      // Attempt to extract friendly message
      const errMessage = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Failed to send message. Please try again.';
      setError(errMessage);
      
      // Optionally remove the user's message if it failed, or leave it so they can read it.
      // We will leave it, but they need to re-type to try again since the prompt is cleared.
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
      {isOpen ? (
        <div 
          className="card shadow-lg" 
          style={{ width: '350px', height: '500px', display: 'flex', flexDirection: 'column', backgroundColor: '#fff', overflow: 'hidden' }}
        >
          <div style={{ padding: '1rem', backgroundColor: '#2563eb', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>AI Assistant</h3>
            <button 
              onClick={toggleWidget} 
              style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1 }}
            >
              &times;
            </button>
          </div>
          
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', backgroundColor: '#f8fafc' }}>
            {messages.length === 0 && (
              <p className="text-secondary" style={{ textAlign: 'center', marginTop: '2rem' }}>
                Ask me anything about your study abroad journey!
              </p>
            )}
            
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                style={{ 
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.role === 'user' ? '#2563eb' : '#e2e8f0',
                  color: msg.role === 'user' ? '#fff' : '#1e293b',
                  padding: '0.75rem 1rem',
                  borderRadius: '1rem',
                  maxWidth: '85%',
                  wordBreak: 'break-word',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                {msg.content}
              </div>
            ))}
            
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', padding: '0.5rem 1rem', backgroundColor: '#e2e8f0', borderRadius: '1rem', color: '#64748b', fontStyle: 'italic' }}>
                Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {error && (
            <div style={{ padding: '0.5rem', backgroundColor: '#fee2e2', color: '#b91c1c', fontSize: '0.85rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div style={{ padding: '1rem', borderTop: '1px solid #e2e8f0' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                disabled={isLoading}
                style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
              <button 
                type="submit" 
                className="btn-primary"
                disabled={isLoading || !input.trim()}
                style={{ padding: '0.5rem 1rem' }}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button 
          onClick={toggleWidget}
          className="btn-primary shadow-lg"
          style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '1.5rem',
            padding: 0
          }}
        >
          💬
        </button>
      )}
    </div>
  );
};

export default AIChatWidget;
