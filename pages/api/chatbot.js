import { supabaseAdmin as supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { chatbotKnowledge } from '@/lib/fallbackData';

let sendChatbotEmail;

/**
 * Simple rule-based chatbot that matches keywords and responds accordingly.
 * Can be extended with OpenAI / other AI services.
 */
function generateBotResponse(message) {
  const msg = message.toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|howdy|greetings|sup|what'?s up)/i.test(msg)) {
    const greetings = chatbotKnowledge.greetings;
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // Skills
  if (/skill|tech|language|framework|tool|stack|proficien|know/i.test(msg)) {
    return chatbotKnowledge.skills;
  }

  // Projects
  if (/project|work|portfolio|build|built|creat/i.test(msg)) {
    return chatbotKnowledge.projects;
  }

  // Experience
  if (/experience|job|career|company|work history|resume|cv/i.test(msg)) {
    return chatbotKnowledge.experience;
  }

  // Education
  if (/education|university|college|degree|study|student|fast|nuces|academic/i.test(msg)) {
    return chatbotKnowledge.education;
  }

  // Contact
  if (/contact|reach|email|phone|call|message|connect/i.test(msg)) {
    return chatbotKnowledge.contact;
  }

  // Availability / Hire
  if (/hire|available|freelance|open|opportunity|position|project|work together|collaborate/i.test(msg)) {
    return chatbotKnowledge.availability;
  }

  // Tech stack of portfolio
  if (/this (site|portfolio|website)|how.*built|tech.*stack.*portfolio/i.test(msg)) {
    return chatbotKnowledge.tech_stack;
  }

  // Thank you
  if (/thank|thanks|thx/i.test(msg)) {
    return "You're welcome! 😊 Let me know if there's anything else I can help with.";
  }

  // Goodbye
  if (/bye|goodbye|see you|later/i.test(msg)) {
    return "Goodbye! 👋 Feel free to come back anytime. Have a great day!";
  }

  // Fallback
  const fallbacks = chatbotKnowledge.fallback;
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, sessionId, type, projectData } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // Handle project inquiry submissions
    if (type === 'project_inquiry' && projectData) {
      // Store in Supabase
      if (isSupabaseConfigured()) {
        await supabase.from('chatbot_logs').insert({
          session_id: sessionId || 'anonymous',
          user_message: `PROJECT INQUIRY: ${projectData.name} (${projectData.email})`,
          bot_response: JSON.stringify(projectData),
        });
      }

      // Send notification email
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        try {
          if (!sendChatbotEmail) {
            const mailer = await import('@/lib/mailer');
            sendChatbotEmail = mailer.sendChatbotEmail;
          }
          await sendChatbotEmail({
            sessionId: sessionId || 'anonymous',
            userMessage: `🚀 NEW PROJECT INQUIRY from ${projectData.name}\nEmail: ${projectData.email}\nWhatsApp: ${projectData.whatsapp}\nRequirements: ${projectData.requirements}\nBudget: ${projectData.budget}\nTimeline: ${projectData.timeline}\nMeeting: ${projectData.meetingPreference}`,
            botResponse: 'Project inquiry auto-collected by AI Assistant',
          });
        } catch (emailErr) {
          console.error('Project inquiry email error:', emailErr);
        }
      }

      return res.status(200).json({ reply: 'Project inquiry submitted!', success: true });
    }

    // Regular chatbot response
    const botResponse = generateBotResponse(message);

    // Store in Supabase
    if (isSupabaseConfigured()) {
      const { error: dbError } = await supabase.from('chatbot_logs').insert([
        {
          session_id: sessionId || 'anonymous',
          user_message: message,
          bot_response: botResponse,
        },
      ]);
      if (dbError) console.error('Chatbot log error:', dbError);
    }

    // Auto-email owner for non-trivial queries
    const trivialPatterns = /^(hi|hello|hey|bye|thanks|thank|ok|yes|no|sure)\b/i;
    if (!trivialPatterns.test(message.trim()) && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        if (!sendChatbotEmail) {
          const mailer = await import('@/lib/mailer');
          sendChatbotEmail = mailer.sendChatbotEmail;
        }
        await sendChatbotEmail({
          sessionId: sessionId || 'anonymous',
          userMessage: message,
          botResponse,
        });
      } catch (emailErr) {
        console.error('Chatbot email error:', emailErr);
      }
    }

    return res.status(200).json({ reply: botResponse });
  } catch (error) {
    console.error('Chatbot API error:', error);
    return res.status(500).json({ error: 'Failed to process message' });
  }
}
