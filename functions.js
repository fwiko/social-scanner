const got = require('got');
const xmlGot = got.extend(require("got-xml")())
var Twitter = require('twitter');

var mediums = {}

var twitterClient = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    bearer_token: process.env.BEARER_TOKEN
})

async function githubCheck(username, callback) {

    async function validGithub(response) {
        if (response == 404) {
            mediums.github = { availability: true, icon: "fab fa-github", service_name: "Github", link: `https://github.com/${username}/` }
        } else {
            mediums.github = { availability: false, icon: "fab fa-github", service_name: "Github", link: `https://github.com/${username}/` }
        }
    }

    try {
        const response = await got(`https://github.com/${username}/`);
        var code = response.statusCode;
        await validGithub(code)
        .then(()=>{
            callback();
        });
    } catch (error) {
        var code = error.response.statusCode;
        await validGithub(code)
        .then(()=>{
            callback();
        });
    }
}
async function behanceCheck(username, callback) {
    async function validBehance(response) {
        if (response == 404) {
            mediums.behance = { availability: true, icon: "fab fa-behance", service_name: "Behance", link: `https://behance.net/${username}/` }
        } else {
            mediums.behance = { availability: false, icon: "fab fa-behance", service_name: "Behance", link: `https://behance.net/${username}/` }
        }
    }
    try {
        const response = await got(`https://behance.net/${username}/`);
        var code = response.statusCode;
        await validBehance(code)
        .then(()=>{
            callback();
        });
    } catch (error) {
        var code = error.response.statusCode;
        await validBehance(code)
        .then(()=>{
            callback();
        });
    }}

async function steamCheck(username, callback) {
    async function validSteam(response) {
        if (response == undefined) {
            mediums.steam = { availability: true, icon: "fab fa-steam", service_name: "Steam" , link: `http://steamcommunity.com/id/${username}/` }
        } else {
            mediums.steam = { availability: false, icon: "fab fa-steam", service_name: "Steam", link: `http://steamcommunity.com/id/${username}/` }
        }
    }
    try {
        const {body} = await xmlGot(`http://steamcommunity.com/id/${username}/?xml=1`);
        await validSteam(body.profile)
        .then(()=>{
            callback();
        })
    } catch (error) {
        await validSteam(undefined)
        .then(()=>{
            callback();
        })
    }
}

async function twitterCheck(username, callback) {
    async function validTwitter(result) {
        if (result.hasOwnProperty('errors')) {
            mediums.twitter = { availability: true, icon: "fab fa-twitter", service_name: "Twitter", link: `https://twitter.com/${username}` }
        } else {
            mediums.twitter = { availability: false, icon: "fab fa-twitter", service_name: "Twitter", link: `https://twitter.com/${username}` }
        }
    }
    try {
        twitterClient.get('users/lookup', {screen_name: username}, async function(error , response ) {
            await validTwitter(response)
            .then(()  => {
                callback();
            })
        });
    } catch (error) {
        await validTwitter(error)
        .then(()  => {
            callback();
        })
    }
}

async function youtubeCheck(username, callback) {
    async function validYoutube(response) {
        if (response == 404) {
            mediums.youtube = { availability: true, icon: "fab fa-youtube", service_name: "YouTube", link: `https://youtube.com/c/${username}` }
        } else {
            mediums.youtube = { availability: false, icon: "fab fa-youtube", service_name: "YouTube", link: `https://youtube.com/c/${username}` }
        }
    }
    try {
        const response = await got(`https://youtube.com/c/${username}/`);
        var code = response.statusCode;
        await validYoutube(code)
        .then(()=>{
            callback();
        });
    } catch (error) {
        var code = error.response.statusCode;
        await validYoutube(code)
        .then(()=>{
            callback();
        });
    }
}

async function redditCheck(username, callback) {
    async function validReddit(response) {
        if (response > 400) {
            mediums.reddit = { availability: true, icon: "fab fa-reddit", service_name: "Reddit", link: `https://www.reddit.com/user/${username}/` }
        } else {
            mediums.reddit = { availability: false, icon: "fab fa-reddit", service_name: "Reddit", link: `https://www.reddit.com/user/${username}/` }
        }
    }
    try {
        const response = await got(`https://www.reddit.com/user/${username}/`)
        var code = response.statusCode;
        await validReddit(code)
        .then(()=>{
            callback();
        });
    } catch (error) {
        var code = error.response.statusCode;
        await validReddit(code)
        .then(()=>{
            callback();
        });
    }
}

async function instagramCheck(username, callback) {
    try {
        const response = await got(`https://www.instagram.com/${username}/`);
        callback(response.statusCode);
    } catch (error) {
        callback(error.response.statusCode);
    } 
}

module.exports = { 
        githubCheck,
        behanceCheck,
        steamCheck,
        twitterCheck,
        youtubeCheck,
        redditCheck,
        
        mediums
    };