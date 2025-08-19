const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Pomodoro Pro Server is running!');
});


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});