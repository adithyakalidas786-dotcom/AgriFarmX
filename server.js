const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(__dirname));

// API Routes
app.post('/api/contact', (req, res) => {
    const { name, email, phone, service, message } = req.body;
    
    console.log('Received Inquiry:', { name, email, phone, service, message });

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
app.get('/institutional-profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'institutional-profile.html'));
});

app.get('/vision-mission', (req, res) => {
    res.sendFile(path.join(__dirname, 'vision-mission.html'));
});

app.get('/leadership', (req, res) => {
    res.sendFile(path.join(__dirname, 'leadership.html'));
});

app.get('/organogram', (req, res) => {
    res.sendFile(path.join(__dirname, 'organogram.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

// Fallback to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
