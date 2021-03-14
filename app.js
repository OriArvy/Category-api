const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const categoryRoute = require('./routes/categories');

app.use('/categories', categoryRoute);


mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true,
      useUnifiedTopology: true 
    },
     () => console.log('connected to DB!')
);

module.exports = app.listen(3000);
