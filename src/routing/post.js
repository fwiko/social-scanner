const { createPromises, validateUsername } = require('../checker');
const router = require('express').Router();

router.post('/', async (req, res) => {
    const { username } = req.body;
    if (!validateUsername(username)) {
        return res.render('main', { error: "Invalid Username" });
    }
    Promise.allSettled(createPromises(username)).then((responses) => {
        return res.render('main', {
            username: username,
            mediums: responses.filter(x => x.status === "fulfilled").map(x => x.value)
        })
    });
});

module.exports = router;