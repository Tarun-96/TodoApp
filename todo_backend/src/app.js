
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const itemsRouter = require('./routes/items');
const authRouter = require('./routes/auth');



const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());

app.use('/items', itemsRouter);

app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.send('Hello from your backend!');
});


const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});