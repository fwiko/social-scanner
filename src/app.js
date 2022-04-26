const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config({
    path: '.env'
})

const app = express();

app.use(express.static(path.join(__dirname, '../public')));
app.use(morgan('short'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', require(path.join(__dirname, 'routing', 'get')));
app.use('/', require(path.join(__dirname, 'routing', 'post')));

app.set('view engine', 'hbs');
app.set("trust proxy", true);

app.listen(process.env.PORT || 80, () => {
    console.log(`Server started on port ${process.env.PORT || 80}`);
});