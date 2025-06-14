const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const itemsRouter = require('./items');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/items', itemsRouter);

app.get('/', (req, res) => {
  res.send('Hello from your backend!');
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});