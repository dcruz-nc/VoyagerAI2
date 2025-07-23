const axios = require('axios');
const e = require('connect-flash');
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

exports.support = (req, res)=>{
    res.render('./docs/support', {
        currentPage: 'support',
        extraStyles: '/css/supportStyle.css',
    });
};

exports.handleContactForm = async (req, res) => {
  const { name, email, subject, message } = req.body;

  const discordPayload = {
    content: `📬 **New Contact Form Submission**\n\n**Name:** ${name}\n**Email:** ${email}\n**Subject:** ${subject}\n**Message:**\n${message}`
  };

  try {
    await axios.post(DISCORD_WEBHOOK_URL, discordPayload);
    res.status(200).json({ success: true, message: 'Message sent to Discord!' });
  } catch (error) {
    console.error('Error sending to Discord:', error);
    res.status(500).json({ success: false, error: 'Failed to send message' });
  }
};

exports.faq = (req, res) => {
  res.render('./docs/faq', {
    currentPage: 'faq',
    defaultStyles: true
  });
}


exports.policies = (req, res) => {
  res.render('./docs/policies', {
    currentPage: 'policies',
    extraStyles: '/css/policies.css',
    defaultStyles: true
  });
}


exports.mission = (req, res) => {
  res.render('./docs/mission', {
    currentPage: 'mission',
    defaultStyles: true
  });
}