const express = require('express');
var path = require('path');
const dotenv = require('dotenv');

dotenv.config({
    path: './.env'
})

const app = express();

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

app.use((req, res, next) => {
    var ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.ip;
    console.log(`> ${ip} | ${req.path} | ${req.method}`);
    next();
});

app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());

app.set('view engine', 'hbs');

app.use('/', require('./routes/routing'));

app.use((req, res, next) => {
    res.redirect('../../../')
});


const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`server started on port ${port}...`);
});