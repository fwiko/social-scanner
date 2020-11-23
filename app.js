const express = require('express');
var path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' })

const app = express();

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set('view engine', 'hbs');

app.use('/', require('./routes/routing'));

app.listen(3027, () => {
    console.log('Server started on port 3027...');
});

