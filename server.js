const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.post('/api/contact', (req, res) => {
    const { name, email, phone, service, message } = req.body;
    
    console.log('Received Inquiry:', { name, email, phone, service, message });

    // In a real app, you might save this to a database or send an email
    // For now, let's save it to a JSON file
    const inquiry = {
        id: Date.now(),
        name,
        email,
        phone,
        service,
        message,
        timestamp: new Date().toISOString()
    };

    const dataPath = path.join(__dirname, 'data', 'inquiries.json');
    
    // Ensure data directory exists
    if (!fs.existsSync(path.join(__dirname, 'data'))) {
        fs.mkdirSync(path.join(__dirname, 'data'));
    }

    let inquiries = [];
    if (fs.existsSync(dataPath)) {
        const fileContent = fs.readFileSync(dataPath, 'utf8');
        try {
            inquiries = JSON.parse(fileContent);
        } catch (e) {
            console.error('Error parsing inquiries.json', e);
        }
    }

    inquiries.push(inquiry);
    fs.writeFileSync(dataPath, JSON.stringify(inquiries, null, 2));

    res.status(200).json({ message: 'Inquiry received successfully!' });
});

// Serve the separate pages
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'services.html'));
});

app.get('/experts', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'experts.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// Fallback to index.html for unknown routes (optional)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
