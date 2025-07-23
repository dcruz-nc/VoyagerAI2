const axios = require('axios');
const e = require('connect-flash');
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;


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

exports.chat = async (req, res) => {
  const { message } = req.body;

  const carSummaries = [
    "Tesla Model 3: Electric • 2023 • Autopilot — high-tech and eco-friendly for a smooth modern ride.",
    "Toyota RAV4: Hybrid — practical and fuel-efficient with versatile utility.",
    "Ford Mustang: Sport • Iconic performance and bold style — made for fun driving.",
    "Honda Civic Sport: 2021 • Bluetooth • Rear Cam — compact, tech-equipped, and reliable.",
    "Jeep Wrangler: 2022 • Off-Road Ready — rugged and built for adventure."
  ];

  const systemMessage = {
    role: 'system',
    content: `
You are a helpful car rental assistant. You know the following 5 cars available for rent:

${carSummaries.join('\n')}

Ask the user questions about their needs and recommend a car accordingly.
If they ask for availability, say: "Please contact our team to confirm availability."
Do not make up cars not listed above.
    `.trim()
  };

    try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          systemMessage,
          { role: 'user', content: message }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });

  } catch (err) {
    console.error('OpenAI error:', err?.response?.data || err.message);
    res.status(500).json({ error: 'Failed to get response from OpenAI' });
  }
};
