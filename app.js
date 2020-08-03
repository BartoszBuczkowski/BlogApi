const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoute = require('./api/routes/auth');
const uploadsRoute = require('./api/routes/uploads');
const articlesRoute = require('./api/routes/articles');
require('dotenv/config');

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));

app.use('/api/users', authRoute);
app.use('/api/uploads', uploadsRoute);
app.use('/api/articles', articlesRoute);

app.use(express.static('./server/public'));

mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('Connected to DB')
);

app.listen(process.env.PORT || 3000);
