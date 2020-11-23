const router = require('express').Router();
const checker = require('../functions')

router.post('/', async (req, res) => {
    
    const {username} = req.body;

    if (username != "" && username.length <= 30) {
        await checker.githubCheck(username, async () => {
            await checker.behanceCheck(username, async () => {
                await checker.steamCheck(username, async () => {
                    await checker.twitterCheck(username, async () => {
                        await checker.youtubeCheck(username, async () => {
                            await checker.redditCheck(username, async () => {
    
                                res.render('index', {
                                    mediums: checker.mediums,
                                    username
                                });

                            });
                        });
                    });
                });
            });
        });
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