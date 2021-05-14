const router = require('express').Router();
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

router.post('/', async (req, res) => {

    const {
        username
    } = req.body;

    if (username != undefined && username != "" && username.length <= 30) {

        await checkUsername(username)
            .then(() => {
                res.render('index', {
                    mediums: checker.mediums,
                    username
                });
            })

    } else {
        res.render('index', {
            message: "invalid username input"
        });
    }
});

router.get('/', (req, res) => {
    res.render('index');
});

module.exports = router;