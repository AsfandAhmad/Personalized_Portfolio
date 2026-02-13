import { useState } from 'react';
import { motion } from 'framer-motion';
import NeonButton from './NeonButton';
import { FaPaperPlane, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Failed to send');

      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1.5">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="John Doe"
            className="neon-input"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1.5">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="john@example.com"
            className="neon-input"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-1.5">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          required
          placeholder="Project Collaboration"
          className="neon-input"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-1.5">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          placeholder="Tell me about your project..."
          className="neon-input resize-none"
        />
      </div>

      <NeonButton
        type="submit"
        variant="solid"
        size="lg"
        disabled={status === 'sending'}
        className="w-full"
      >
        {status === 'sending' && (
          <svg className="animate-spin mr-2 h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {status === 'success' && <FaCheck className="mr-2" />}
        {status === 'error' && <FaExclamationTriangle className="mr-2" />}
        {status === 'idle' && <FaPaperPlane className="mr-2" />}
        {status === 'sending' ? 'Sending...' :
         status === 'success' ? 'Message Sent!' :
         status === 'error' ? 'Failed - Try Again' : 'Send Message'}
      </NeonButton>

      {status === 'success' && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-green-400 text-sm text-center"
        >
          Thank you! I&apos;ll get back to you soon.
        </motion.p>
      )}
    </form>
  );
}
