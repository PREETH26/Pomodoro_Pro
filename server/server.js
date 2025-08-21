const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const authRoutes = require('./routes/authroutes');
const taskRoutes = require("./routes/taskroutes")
const teamTaskRoutes = require("./routes/teamTaskRoutes");
const cookieParser = require('cookie-parser')
const connectDB = require('./db/db');
connectDB();

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL, 
  credentials: true                
}));app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/team-tasks', teamTaskRoutes);
app.get('/', (req, res) => {
    res.send('Pomodoro Pro Server is running!');
});


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});