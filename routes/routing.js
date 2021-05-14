const router = require('express').Router();
const e = require('express');
const got = require('got');
const checker = require('../functions')

async function checkUsername(username) {

    await checker.githubCheck(username).then(() => {
        console.log(`> checked github for ${username}`)
    });
    await checker.behanceCheck(username).then(() => {
        console.log(`> checked behance for ${username}`)
    });
    await checker.steamCheck(username).then(() => {
        console.log(`> checked steam for ${username}`)
    });
    await checker.twitterCheck(username).then(() => {
        console.log(`> checked twitter for ${username}`)
    });
    await checker.youtubeCheck(username).then(() => {
        console.log(`> checked youtube for ${username}`)
    });
    await checker.redditCheck(username).then(() => {
        console.log(`> checked reddit for ${username}`)
    });
    await checker.minecraftCheck(username).then(() => {
        console.log(`> checked minecraft for ${username}`)
    })
    await checker.robloxCheck(username).then(() => {
        console.log(`> checked roblox for ${username}`)
    })
}

function captchaFail(res) {
    res.render('index', {
        message: "Failed CAPTCHA verification"
    });
}

router.post('/', async (req, res) => {

    const {
        username,
    } = req.body;

    const recaptcha_response = req.body['g-recaptcha-response'];

    if (recaptcha_response === undefined || recaptcha_response === '' || recaptcha_response === null) {
        return captchaFail(res);
    }

    const secret_key = process.env.CAPTCHA_SECRET_KEY;

    const verification_url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${recaptcha_response}&remoteip=${req.remoteAddress}`;

    try {
        let { body } = await got(verification_url);
        body = JSON.parse(body);

        if (body.success != undefined && !body.success) {
            return captchaFail(res);
        } 
        else {

            if (username != undefined && username != "" && username.length <= 30) {
                await checkUsername(username)
                    .then(() => {
                        res.render('index', {
                            mediums: checker.mediums,
                            username
                        });
                    })
            } else {
                return res.render('index', {
                    message: "Invalid username input"
                });
            }
        }
    } catch (error) {
        console.error(error);
        return captchaFail(res);
    }
});

router.get('/', (req, res) => {
    res.render('index');
});

module.exports = router;