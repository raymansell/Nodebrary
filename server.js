require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');

const dbURI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3000;

const app = express();
const indexRouter = require('./routes/index');

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/layout');
app.use(express.static('public'));

app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);

// Database connection
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => console.log(error));
db.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
