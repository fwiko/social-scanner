const router = require('express').Router();
const socialChecker = require('../modules/medium_checker');
const mediumChecker = require('../modules/medium_checker')
const fs = require('fs');
 
async function checkUsernames(username, callback) {
    const socialChecker = new mediumChecker(username);
    socialChecker.checkAll((mediums) => {
        callback(mediums);
    });
}

// TODO - username alpha, number, underscore and fullstop validation

router.post('/', async (req, res) => {
    const { username } = req.body;
    if (username != undefined && username != "" && username.length <= 30) {
        var ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.ip;
        await checkUsernames(username, (mediums) => {
            console.log(`> ${ip} checked ${username}`)
            fs.readFile('./data/information.json', (err, data) => {
                if (err) throw err;
                let information = JSON.parse(data);
                information.usernames_checked += 1;
                const username_count = information.usernames_checked;
                const info = JSON.stringify(information);
                fs.writeFileSync('./data/information.json', info);
                res.render('index', {
                    mediums: mediums,
                    username,
                    usernamesChecked: username_count
                });
            });

        });     
    } else {
        res.render('index', {
            message: "Invalid username input"
        });
    }
});

router.get('/', (req, res) => {
    fs.readFile('./data/information.json', (err, data) => {
        if (err) throw err;
        let information = JSON.parse(data);
        res.render('index', {
            usernamesChecked: information.usernames_checked
        });
    });
});

module.exports = router;