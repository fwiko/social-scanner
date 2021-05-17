const router = require('express').Router();
const socialChecker = require('../medium_checker');
const mediumChecker = require('../medium_checker')

async function checkUsernames(username, callback) {
    const socialChecker = new mediumChecker(username);
    socialChecker.checkAll((mediums) => {
        callback(mediums);
    });
}

router.post('/', async (req, res) => {
    const { username } = req.body;
    if (username != undefined && username != "" && username.length <= 30) {
        var ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.ip;
        await checkUsernames(username, (mediums) => {
            console.log(`> ${ip} checked ${username}`)
            res.render('index', {
                mediums: mediums,
                username
            });
        });     
    } else {
        res.render('index', {
            message: "Invalid username input"
        });
    }
});

router.get('/', (req, res) => {
    res.render('index');
});

module.exports = router;