const got = require('got');
const xmlGot = got.extend(require("got-xml")())
var Twitter = require('twitter');

var mediums = {}

var twitterClient = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    bearer_token: process.env.BEARER_TOKEN
})

async function githubCheck(username) {

    async function validGithub(response) {
        if (response == 404) {
            mediums.github = {
                availability: true,
                icon: "fab fa-github",
                service_name: "Github",
                link: `https://github.com/${username}/`
            }
        } else {
            mediums.github = {
                availability: false,
                icon: "fab fa-github",
                service_name: "Github",
                link: `https://github.com/${username}/`
            }
        }
    }
    try {
        const response = await got(`https://github.com/${username}/`);
        var code = response.statusCode;
        await validGithub(code)
            .then(() => {
                return;
            });
    } catch (error) {
        var code = error.response.statusCode;
        await validGithub(code)
            .then(() => {
                return;
            });
    }
}
async function behanceCheck(username) {
    async function validBehance(response) {
        if (response == 404) {
            mediums.behance = {
                availability: true,
                icon: "fab fa-behance",
                service_name: "Behance",
                link: `https://behance.net/${username}/`
            }
        } else {
            mediums.behance = {
                availability: false,
                icon: "fab fa-behance",
                service_name: "Behance",
                link: `https://behance.net/${username}/`
            }
        }
    }
    try {
        const response = await got(`https://behance.net/${username}/`);
        var code = response.statusCode;
        await validBehance(code)
            .then(() => {
                return;
            });
    } catch (error) {
        var code = error.response.statusCode;
        await validBehance(code)
            .then(() => {
                return;
            });
    }
}

async function steamCheck(username) {
    async function validSteam(response) {
        if (response == undefined) {
            mediums.steam = {
                availability: true,
                icon: "fab fa-steam",
                service_name: "Steam",
                link: `http://steamcommunity.com/id/${username}/`
            }
        } else {
            mediums.steam = {
                availability: false,
                icon: "fab fa-steam",
                service_name: "Steam",
                link: `http://steamcommunity.com/id/${username}/`
            }
        }
    }
    try {
        const {
            body
        } = await xmlGot(`http://steamcommunity.com/id/${username}/?xml=1`);
        await validSteam(body.profile)
            .then(() => {
                return;
            })
    } catch (error) {
        await validSteam(undefined)
            .then(() => {
                return;
            })
    }
}

async function twitterCheck(username) {
    async function validTwitter(result) {
        if (result.hasOwnProperty('errors')) {
            mediums.twitter = {
                availability: true,
                icon: "fab fa-twitter",
                service_name: "Twitter",
                link: `https://twitter.com/${username}`
            }
        } else {
            mediums.twitter = {
                availability: false,
                icon: "fab fa-twitter",
                service_name: "Twitter",
                link: `https://twitter.com/${username}`
            }
        }
    }
    try {
        twitterClient.get('users/lookup', {
            screen_name: username
        }, async function(error, response) {
            await validTwitter(response)
                .then(() => {
                    return;
                });
        });
    } catch (error) {
        await validTwitter(error)
            .then(() => {
                return;
            });
    }
}

async function youtubeCheck(username) {
    async function validYoutube(response) {
        if (response == 404) {
            mediums.youtube = {
                availability: true,
                icon: "fab fa-youtube",
                service_name: "YouTube",
                link: `https://youtube.com/c/${username}`
            }
        } else {
            mediums.youtube = {
                availability: false,
                icon: "fab fa-youtube",
                service_name: "YouTube",
                link: `https://youtube.com/c/${username}`
            }
        }
    }
    try {
        const response = await got(`https://youtube.com/c/${username}/`);
        var code = response.statusCode;
        await validYoutube(code)
            .then(() => {
                return;
            });
    } catch (error) {
        var code = error.response.statusCode;
        await validYoutube(code)
            .then(() => {
                return;
            });
    }
}

async function redditCheck(username) {
    async function validReddit(response) {
        if (response > 400) {
            mediums.reddit = {
                availability: true,
                icon: "fab fa-reddit",
                service_name: "Reddit",
                link: `https://www.reddit.com/user/${username}/`
            }
        } else {
            mediums.reddit = {
                availability: false,
                icon: "fab fa-reddit",
                service_name: "Reddit",
                link: `https://www.reddit.com/user/${username}/`
            }
        }
    }
    try {
        const response = await got(`https://www.reddit.com/user/${username}.json`)
        var code = response.statusCode;
        await validReddit(code)
            .then(() => {
                return;
            });
    } catch (error) {
        var code = error.response.statusCode;
        await validReddit(code)
            .then(() => {
                return;
            });
    }
}

async function minecraftCheck(username) {

    async function validMinecraft(response) {
        if (response != 200) {
            mediums.minecraft = {
                availability: true,
                icon: "fas fa-cube",
                service_name: "Minecraft",
                link: `https://namemc.com/profile/${username}/`
            }
        } else {
            mediums.minecraft = {
                availability: false,
                icon: "fas fa-cube",
                service_name: "Minecraft",
                link: `https://namemc.com/profile/${username}/`
            }
        }
    }

    try {
        const response = await got(`https://api.mojang.com/users/profiles/minecraft/${username}`);
        var code = response.statusCode;
        await validMinecraft(code)
            .then(() => {
                return;
            });
    } catch (error) {
        var code = error.response.statusCode;
        await validMinecraft(code)
            .then(() => {
                return;
            });
    }
}

async function robloxCheck(username) {

    async function validRoblox(response) {
        if (response.hasOwnProperty('errorMessage')) {
            mediums.roblox = {
                availability: true,
                icon: "fas fa-gamepad",
                service_name: "Roblox",
                link: `https://www.roblox.com/`
            }
        } else {
            mediums.roblox = {
                availability: false,
                icon: "fas fa-gamepad",
                service_name: "Roblox",
                link: `https://www.roblox.com/users/${response.Id}/profile/`
            }
        }
    }

    const response = await got(`https://api.roblox.com/users/get-by-username?username=${username}`);
    let responseBody = response.body;
    responseBody = JSON.parse(responseBody);

    await validRoblox(responseBody);

}


/*async function instagramCheck(username) {
    try {
        const response = await got(`https://www.instagram.com/${username}/`);
        callback(response.statusCode);
    } catch (error) {
        callback(error.response.statusCode);
    }
}*/

module.exports = {
    githubCheck,
    behanceCheck,
    steamCheck,
    twitterCheck,
    youtubeCheck,
    redditCheck,
    minecraftCheck,
    robloxCheck,
    mediums
};