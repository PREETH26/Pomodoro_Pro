const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const authRoutes = require('./routes/authroutes');
const cookieParser = require('cookie-parser')
const connectDB = require('./db/db');
connectDB();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true                
}));app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.get('/', (req, res) => {
    res.send('Pomodoro Pro Server is running!');
});


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});