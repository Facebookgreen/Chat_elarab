const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

// السطر ده مهم جداً عشان فيرسال يشوف الملفات اللي جوه فولدر public
app.use(express.static(path.join(__dirname, 'public')));

// السطر ده بيضمن إن أي حد يدخل على الرابط يفتح له صفحة الشات فوراً
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
    socket.on('join', (data) => {
        let role = 'زائر';
        if (data.name === 'حازم' && data.pass === 'hazem123') role = 'صاحب الموقع 👑';
        else if (data.name === 'صهيب') role = 'وزير الشات ⚖️';
        else if (data.name === 'نسمة') role = 'أونر 💎';

        socket.role = role;
        socket.username = data.name;
        io.emit('message', { name: 'النظام', text: `انضم ${role} ${data.name} للدردشة`, type: 'system' });
    });

    socket.on('chatMessage', (msg) => {
        io.emit('message', { name: socket.username, text: msg, role: socket.role, type: 'user' });
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => { console.log('Server running'); });
