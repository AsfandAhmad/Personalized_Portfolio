import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaTimes, FaPaperPlane, FaCheckCircle, FaWhatsapp } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

export default function ChatbotEnhanced() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'bot',
      text: "Welcome! I'm Asfand Ahmed's Professional AI Assistant 🤖\n\nHow can I help you today?\n• Learn about Asfand's expertise & projects\n• Start a project discussion\n• Schedule a meeting\n• Connect on WhatsApp: wa.me/923123513049\n\nFeel free to ask anything!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => uuidv4());
  const [conversationMode, setConversationMode] = useState('general'); // general, project_inquiry
  const [projectData, setProjectData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    requirements: '',
    budget: '',
    timeline: '',
    meetingPreference: '',
  });
  const [collectionStep, setCollectionStep] = useState(0); // 0: mode selection, 1: name, 2: email, 3: whatsapp, 4: requirements, 5: budget, 6: timeline, 7: meeting, 8: complete
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const addBotMessage = (text) => {
    setMessages((prev) => [...prev, { id: uuidv4(), role: 'bot', text }]);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateWhatsApp = (number) => {
    // Remove spaces, dashes, and plus signs
    const cleaned = number.replace(/[\s\-+]/g, '');
    // Check if it's a valid phone number (8-15 digits)
    return /^\d{8,15}$/.test(cleaned);
  };

  const handleProjectInquiryFlow = async (userInput) => {
    const steps = [
      { key: 'name', question: "Great! Let's get started. What's your name?", validator: (val) => val.length > 1 },
      { key: 'email', question: "Nice to meet you! What's your email address?", validator: validateEmail },
      { key: 'whatsapp', question: "Perfect! What's your WhatsApp number? (Include country code)", validator: validateWhatsApp },
      { key: 'requirements', question: "Tell me about your project. What are you looking to build?", validator: (val) => val.length > 10 },
      { key: 'budget', question: "What's your estimated budget range? (e.g., $5000-$10000, or 'Open to discuss')", validator: (val) => val.length > 2 },
      { key: 'timeline', question: "When would you like the project completed? (e.g., '2 months', 'ASAP', 'Flexible')", validator: (val) => val.length > 2 },
      { key: 'meetingPreference', question: "Would you like to schedule a meeting? (Yes/No)", validator: (val) => val.length > 0 },
    ];

    if (collectionStep === 0) {
      // Starting project inquiry
      setCollectionStep(1);
      addBotMessage(steps[0].question);
      return;
    }

    if (collectionStep > 0 && collectionStep <= steps.length) {
      const currentStep = steps[collectionStep - 1];
      
      // Validate input
      if (!currentStep.validator(userInput)) {
        addBotMessage(`Hmm, that doesn't look right. ${currentStep.question}`);
        return;
      }

      // Store the data
      setProjectData((prev) => ({ ...prev, [currentStep.key]: userInput }));

      // Move to next step or complete
      if (collectionStep < steps.length) {
        setCollectionStep(collectionStep + 1);
        addBotMessage(steps[collectionStep].question);
      } else {
        // Complete the inquiry
        setCollectionStep(8);
        await completeProjectInquiry({ ...projectData, [currentStep.key]: userInput });
      }
    }
  };

  const completeProjectInquiry = async (data) => {
    try {
      // Log to database and send email
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `PROJECT INQUIRY: ${JSON.stringify(data)}`,
          sessionId,
          type: 'project_inquiry',
          projectData: data,
        }),
      });

      const meetingText = data.meetingPreference.toLowerCase().includes('yes')
        ? "\n\n📅 Asfand will reach out on WhatsApp to schedule a meeting within 24 hours."
        : "\n\nAsfand will review your requirements and get back to you via email within 24 hours.";

      addBotMessage(
        `✅ Perfect! I've got all the details:\n\n` +
        `📧 Email: ${data.email}\n` +
        `📱 WhatsApp: ${data.whatsapp}\n` +
        `💼 Project: ${data.requirements.substring(0, 100)}...\n` +
        `💰 Budget: ${data.budget}\n` +
        `⏱️ Timeline: ${data.timeline}${meetingText}\n\n` +
        `💬 You can also reach Asfand directly on WhatsApp:\nhttps://wa.me/923123513049\n\n` +
        `Thank you for reaching out! 🚀`
      );

      // Reset conversation
      setConversationMode('general');
      setCollectionStep(0);
      setProjectData({
        name: '',
        email: '',
        whatsapp: '',
        requirements: '',
        budget: '',
        timeline: '',
        meetingPreference: '',
      });
    } catch (error) {
      console.error('Error completing inquiry:', error);
      addBotMessage("Oops! Something went wrong. Please try again or email directly at: mrasfandahmed@gmail.com");
    }
  };

  const handleGeneralQuery = async (userInput) => {
    // Check if user wants to start a project
    const projectKeywords = ['project', 'hire', 'work', 'build', 'develop', 'create', 'quote', 'price'];
    const lowerInput = userInput.toLowerCase();
    
    if (projectKeywords.some(keyword => lowerInput.includes(keyword)) && conversationMode === 'general') {
      setConversationMode('project_inquiry');
      addBotMessage(
        "Excellent! I'd love to help you start a project with Asfand. 🚀\n\n" +
        "I'll collect some information to ensure we understand your needs perfectly."
      );
      setTimeout(() => {
        handleProjectInquiryFlow(userInput);
      }, 1500);
      return;
    }

    // Otherwise, use the regular chatbot API
    setIsTyping(true);
    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput, sessionId }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { id: uuidv4(), role: 'bot', text: data.reply || "I'm not sure how to respond to that. Can I help you with something else?" },
      ]);
    } catch (error) {
      console.error('Chatbot error:', error);
      addBotMessage("Sorry, I'm having trouble connecting. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { id: uuidv4(), role: 'user', text: userMessage }]);

    // Route to appropriate handler
    if (conversationMode === 'project_inquiry' && collectionStep > 0) {
      await handleProjectInquiryFlow(userMessage);
    } else {
      await handleGeneralQuery(userMessage);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating chat button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-neon-red to-red-600 
                   shadow-[0_0_20px_rgba(255,7,58,0.5)] hover:shadow-[0_0_30px_rgba(255,7,58,0.8)]
                   flex items-center justify-center group transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FaTimes className="text-white" size={20} />
            </motion.div>
          ) : (
            <motion.div
              key="robot"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FaRobot className="text-white animate-pulse" size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-md h-[600px] max-h-[70vh]
                       glass-card rounded-2xl shadow-2xl flex flex-col overflow-hidden
                       border-2 border-neon-red/30"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-neon-red/20 to-red-600/20 backdrop-blur-xl p-4 border-b border-neon-red/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neon-red/20 flex items-center justify-center">
                  <FaRobot className="text-neon-red" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold">Asfand&apos;s AI Assistant</h3>
                  <p className="text-xs text-gray-400">Always here to help 24/7</p>
                </div>
                {conversationMode === 'project_inquiry' && collectionStep > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neon-red/20 text-neon-red text-xs">
                    <FaCheckCircle size={12} />
                    <span>Project Inquiry</span>
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-neon-red/30 scrollbar-track-transparent">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-neon-red text-white rounded-br-sm'
                        : 'bg-white/5 text-gray-300 rounded-bl-sm border border-white/10'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-bl-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-neon-red animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-neon-red animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-neon-red animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-xl">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white 
                           placeholder-gray-500 focus:outline-none focus:border-neon-red/50 transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-12 h-12 rounded-xl bg-neon-red hover:bg-neon-red/80 disabled:opacity-30 
                           disabled:cursor-not-allowed flex items-center justify-center transition-all
                           shadow-[0_0_15px_rgba(255,7,58,0.3)] hover:shadow-[0_0_25px_rgba(255,7,58,0.5)]"
                >
                  <FaPaperPlane className="text-white" size={16} />
                </button>
              </div>

              {conversationMode === 'project_inquiry' && collectionStep > 0 && (
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                  <FaWhatsapp className="text-green-500" />
                  <span>Your details will be sent to Asfand&apos;s WhatsApp</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
