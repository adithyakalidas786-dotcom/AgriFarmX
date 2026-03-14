const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'AgriFarmX')));

// Data storage (simple JSON file)
const DATA_DIR = path.join(__dirname, 'data');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

if (!fs.existsSync(MESSAGES_FILE)) {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify([]));
}

// API Routes
app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Please provide name, email, and message.' });
    }

    const newMessage = {
        id: Date.now(),
        name,
        email,
        subject,
        message,
        timestamp: new Date().toISOString()
    };

    try {
        const data = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf8'));
        data.push(newMessage);
        fs.writeFileSync(MESSAGES_FILE, JSON.stringify(data, null, 2));
        
        console.log('New message received:', newMessage);
        
        res.status(200).json({ message: 'Message sent successfully! We will get back to you soon.' });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error: 'Failed to save message. Please try again later.' });
    }
});

// Serve the index.html for any unknown routes (SPA like behavior, although this is static)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'AgriFarmX', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
