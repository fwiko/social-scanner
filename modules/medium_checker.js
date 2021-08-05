
const got = require('got');
const xmlGot = got.extend(require("got-xml")())
var Twitter = require('twitter');

var twitterClient = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    bearer_token: process.env.BEARER_TOKEN
});

module.exports = class socialChecker {
    constructor(username) {
        this.username = username;
    }

    #Obj(options) {
        return ({
            availability: options.availability,
            icon: options.icon,
            service_name: options.service_name,
            link: options.link
        });
    }
    
    githubCheck() {
        var that = this;
        return new Promise(async function(resolve, reject) {
            var availability, code;
            try {
                const response = await got(`https://github.com/${that.username}/`);
                code = response.statusCode;
            } catch (error) {
                code = error.response.statusCode;
            }
            if (code == 200) {
                availability = false;
            } else {
                availability = true;
            }
            resolve(that.#Obj({
                availability: availability,
                icon: "fab fa-github",
                service_name: "Github",
                link: `https://github.com/${that.username}/`
            }));
        })
    }
    
    behanceCheck() {
        var that = this;
        return new Promise(async function(resolve, reject) {
            var availability, code;
            try {
                const response = await got(`https://behance.net/${that.username}/`);
                code = response.statusCode;
            } catch (error) {
                code = error.response.statusCode;
            }
            if (code == 200) {
                availability = false;
            } else {
                availability = true;
            }
            resolve(that.#Obj({
                availability: availability,
                icon: "fab fa-behance",
                service_name: "Behance",
                link: `https://behance.net/${that.username}/`
            }));
        });
    }
    
    steamCheck() {
        var that = this;
        return new Promise(async function(resolve, reject) {
            var profile, availability;
            try {
                const { body } = await xmlGot(`http://steamcommunity.com/id/${that.username}/?xml=1`);
                profile = body.profile;
            } catch (error) {
                profile = undefined;
            }
            if (profile == undefined) {
                availability = true;
            } else {
                availability = false;
            }
            resolve(that.#Obj({
                availability: availability,
                icon: "fab fa-steam",
                service_name: "Steam",
                link: `http://steamcommunity.com/id/${that.username}/`
            }));
        });
    }
    
    twitterCheck() {
        var that = this;
        return new Promise(function(resolve, reject) {
            var availability;
            twitterClient.get('users/lookup', {screen_name: that.username}, function(error, response) {
                if (!error) {
                    availability = false;
                } else {
                    availability = true;
                }
                resolve(that.#Obj({
                    availability: availability,
                    icon: "fab fa-twitter",
                    service_name: "Twitter",
                    link: `https://twitter.com/${that.username}`
                }));
            });
        });
    }

    youtubeCheck() {
        var that = this;
        return new Promise(async function(resolve, reject) {
            var availability, code;
            try {
                const response = await got(`https://youtube.com/c/${that.username}/`);
                var code = response.statusCode;
            } catch (error) {
                var code = error.response.statusCode;
            }
            if (code == 200) {
                availability = false;
            } else {
                availability = true;
            }
            resolve(that.#Obj({
                availability: availability,
                icon: "fab fa-youtube",
                service_name: "YouTube",
                link: `https://youtube.com/c/${that.username}`
            }));
        });
    }

    redditCheck() {
        var that = this;
        return new Promise(async function(resolve, reject) {
            var availability, code;
            try {
                const response = await got(`https://www.reddit.com/user/${that.username}.json`)
                var code = response.statusCode;
            } catch (error) {
                var code = error.response.statusCode;
            }
            if (code == 200) {
                availability = false;
            } else {
                availability = true;
            }
            resolve(that.#Obj({
                availability: availability,
                icon: "fab fa-reddit",
                service_name: "Reddit",
                link: `https://www.reddit.com/user/${that.username}/`
            }));
        });
    }

    minecraftCheck() {
        var that = this;
        return new Promise(async function(resolve, reject) {
            var availability, code;
            try {
                const response = await got(`https://api.mojang.com/users/profiles/minecraft/${that.username}`);
                var code = response.statusCode;
            } catch (error) {
                var code = error.response.statusCode;
            }
            if (code == 200) {
                availability = false;
            } else {
                availability = true;
            }
            resolve(that.#Obj({
                availability: availability,
                icon: "fas fa-cube",
                service_name: "Minecraft",
                link: `https://namemc.com/profile/${that.username}/`
            }));
        });
    }

    robloxCheck() {
        var that = this;
        return new Promise(async function(resolve, reject) {
            var availability, responseBody, link;
            try {
                const response = await got(`https://api.roblox.com/users/get-by-username?username=${that.username}`);
                responseBody = JSON.parse(response.body);
                if (responseBody.hasOwnProperty('errorMessage')) {
                    availability = true;
                } else {
                    availability = false;
                }
            } catch (error) {
                availability = true;
            }
            if (!availability) {
                link = `https://www.roblox.com/users/${responseBody.Id}/profile/`
            } else {
                link = "https://www.roblox.com/"
            }
            resolve(that.#Obj({
                availability: availability,
                icon: "fas fa-gamepad",
                service_name: "Roblox",
                link: link
            }));
        });
    }

    twitchCheck() {
        var that = this;
        return new Promise(async function(resolve, reject) {
            var availability, responseBody
            try{
                const response = await got(`https://api.twitch.tv/helix/users/?login=${that.username}`, {
                    hooks: {
                        beforeRequest: [
                            options => {
                                options.headers['client-id'] = process.env.TWITCH_CLIENT_ID;
                                options.headers['Authorization'] = process.env.TWITCH_BEARER_TOKEN;
                            }
                        ]
                    }
                }).then((response) => {
                    responseBody = JSON.parse(response.body);
                    if (responseBody.data.length > 0) {
                        availability = false;
                    } else {
                        availability = true;
                    }
                })
            } catch (error) {
                availability = true;
            }
            resolve(that.#Obj({
                availability: availability,
                icon: "fab fa-twitch",
                service_name: "Twitch",
                link: `https://twitch.tv/${that.username}`
            }));
        });
    }

    facebookCheck() {
        var that = this;
        return new Promise(async function(resolve, reject) {
            var availability, code;
            try {
                const response = await got(`https://www.facebook.com/${that.username}/`);
                var code = response.statusCode;
            } catch (error) {
                var code = error.response.statusCode;
            }
            if (code == 200) {
                availability = false;
            } else {
                availability = true;
            }
            resolve(that.#Obj({
                availability: availability,
                icon: "fab fa-facebook",
                service_name: "Facebook",
                link: `https:///www.facebook.com/${that.username}`
            }));
        });
    }

    vimeoCheck() {
        var that = this;
        return new Promise(async function(resolve, reject) {
            var availability, code;
            try {
                const response = await got(`https://vimeo.com/${that.username}/`);
                var code = response.statusCode;
            } catch (error) {
                var code = error.response.statusCode;
            }
            if (code == 200) {
                availability = false;
            } else {
                availability = true;
            }
            resolve(that.#Obj({
                availability: availability,
                icon: "fab fa-vimeo",
                service_name: "Vimeo",
                link: `https:///vimeo.com/${that.username}`
            }));
        });
    }
 
    dribbbleCheck() {
        var that = this;
        return new Promise(async function(resolve, reject) {
            var availability, code;
            try {
                const response = await got(`https://dribbble.com/${that.username}/`);
                var code = response.statusCode;
            } catch (error) {
                var code = error.response.statusCode;
            }
            if (code == 200) {
                availability = false;
            } else {
                availability = true;
            }
            resolve(that.#Obj({
                availability: availability,
                icon: "fab fa-dribbble",
                service_name: "Dribbble",
                link: `https:///dribbble.com/${that.username}`
            }));
        });
    }
 
    checkAll(callback) {
        Promise.all([
            this.twitterCheck(),
            this.githubCheck(),
            this.behanceCheck(),
            this.steamCheck(),
            this.youtubeCheck(),
            this.redditCheck(),
            this.minecraftCheck(),
            this.robloxCheck(),
            this.twitchCheck(),
            this.facebookCheck(),
            this.vimeoCheck(),
            this.dribbbleCheck()
        ]).then((values)=>{
            callback(values);
        })
    }

}

