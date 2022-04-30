const router = require('express').Router();
const { createPromises, validateUsername } = require('../checker');

router.get('/api', async (req, res) => {
    const { username } = req.query;
    if (!validateUsername(username) || !Boolean(username)) {
        return res.json({ error: "Invalid Username" });
    }
    Promise.allSettled(createPromises(username)).then((responses) => {
        return res.json({
            username: username,
            results: responses.filter(x => x.status === "fulfilled").map(x => x.value)
        });
    });
});

router.get('/', async (req, res) => {
    return res.status(200).render('main', { siteKey: process.env.RECAPTCHA_SITE_KEY });
})

module.exports = router;