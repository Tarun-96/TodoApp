require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const itemsRouter = require('./src/routes/items');
const authRouter = require('./src/routes/auth');

const app = express();

// CORS configuration using environment variable
app.use(cors({
  origin: process.env.FRONTEND_URL,
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
