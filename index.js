const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static('public'));

io.on('connection', (socket) => {
    socket.on('join', (data) => {
        let role = 'زائر';
        // نظام حماية الرتب
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
http.listen(PORT, () => { console.log('Server is running on port ' + PORT); });
