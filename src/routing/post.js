const router = require('express').Router();
const axios = require('axios');
const { createPromises, validateUsername } = require('../checker');

async function validateCaptcha(remoteIP, recaptchaResponse) {
    return await axios.get(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaResponse}&remoteip=${remoteIP}`)
        .then(response => response.data.success);
}

router.post('/', async (req, res) => {
    const username = req.body['username'];
    const g_recaptcha_response = req.body['g-recaptcha-response'];

    if (!await validateCaptcha(req.headers['x-forwarded-for'] || req.ip, g_recaptcha_response)) {
        return res.render('main', { error: "Failed Captcha", siteKey: process.env.RECAPTCHA_SITE_KEY });
    }

    if (!validateUsername(username)) {
        return res.render('main', { error: "Invalid Username", siteKey: process.env.RECAPTCHA_SITE_KEY });
    }

    Promise.allSettled(createPromises(username)).then((responses) => {
        return res.render('main', {
            username: username,
            mediums: responses.filter(x => x.status === "fulfilled").map(x => x.value),
            siteKey: process.env.RECAPTCHA_SITE_KEY
        });
    });
});

module.exports = router;