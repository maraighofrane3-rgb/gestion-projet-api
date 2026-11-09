const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// نقرّيو المتغيرات اللي في ملف .env
dotenv.config();

const app = express();

// Middleware باش نقراو الـ JSON اللي جاي في الـ Request
app.use(express.json()); 
app.use(cors());

// ن-connectiw قاعدة البيانات متاع MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// هنا غاديين نزيدوا الـ Routes (الـ API endpoints)
// app.use('/api/auth', require('./routes/authRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));