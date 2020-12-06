require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');

const appliancesRouter = require('./routes/appliances');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  autoIndex: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to DB.');
});

const app = express();

app.use(morgan('combined'));
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(
  cors({
    exposedHeaders: ['X-Total-Count'],
  })
);

app.use(express.json());

app.use('/api', appliancesRouter);

const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}.`);
});
