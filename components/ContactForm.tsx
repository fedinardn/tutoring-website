'use client';

import { useState, useEffect } from 'react';

interface ContactFormProps {
  idPrefix?: string;
}

export default function ContactForm({ idPrefix = '' }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        setStatus('idle');
        setStatusMessage('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus('success');
        setStatusMessage("Message sent successfully! We'll get back to you soon.");
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
        setStatusMessage(result.error || 'Failed to send message. Please try again.');
      }
    } catch {
      setStatus('error');
      setStatusMessage('Something went wrong. Please try again later.');
    }
  };

  const prefix = idPrefix ? `${idPrefix}-` : '';

  return (
    <div className="contact-form-box" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor={`${prefix}name`}>Your Name</label>
          <input
            type="text"
            id={`${prefix}name`}
            name="name"
            required
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor={`${prefix}email`}>Your Email</label>
          <input
            type="email"
            id={`${prefix}email`}
            name="email"
            required
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor={`${prefix}subject`}>Subject</label>
          <input
            type="text"
            id={`${prefix}subject`}
            name="subject"
            placeholder="How can we help?"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor={`${prefix}message`}>Message</label>
          <textarea
            id={`${prefix}message`}
            name="message"
            required
            placeholder="Tell us about your tutoring needs..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
        </div>
        <button
          type="submit"
          className="form-submit-btn"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Sending...' : 'Send Message'}
        </button>
        {status !== 'idle' && status !== 'loading' && (
          <div className={`form-status ${status}`}>
            {statusMessage}
          </div>
        )}
      </form>
    </div>
  );
}
