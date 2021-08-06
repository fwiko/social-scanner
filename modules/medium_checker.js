
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



    // Specialised Check Functions 
    #steamCheck() {
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
            resolve({
                availability: availability,
                icon: "fab fa-steam",
                service_name: "Steam",
                link: `http://steamcommunity.com/id/${that.username}/`
            });
        });
    }
    
    #twitterCheck() {
        var that = this;
        return new Promise(function(resolve, reject) {
            var availability;
            twitterClient.get('users/lookup', {screen_name: that.username}, function(error, response) {
                if (!error) {
                    availability = false;
                } else {
                    availability = true;
                }
                resolve({
                    availability: availability,
                    icon: "fab fa-twitter",
                    service_name: "Twitter",
                    link: `https://twitter.com/${that.username}`
                });
            });
        });
    }

    #robloxCheck() {
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
            resolve({
                availability: availability,
                icon: "fas fa-gamepad",
                service_name: "Roblox",
                link: link
            });
        });
    }

    #twitchCheck() {
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
                availability = false;
            }
            resolve({
                availability: availability,
                icon: "fab fa-twitch",
                service_name: "Twitch",
                link: `https://twitch.tv/${that.username}`
            });
        });
    }


    // Check used for services that can be queried in the easiest way based on the 200 or 404 response code
    #traditionalCheck(options) {
        var that = this;
        return new Promise(async function(resolve, reject) {
            var availability, code;
            try {
                const response = await got(options.url);
                var code = response.statusCode;
            } catch (error) {
                var code = error.response.statusCode || 404;
            }
            if (code == 200) {
                availability = false;
            } else {
                availability = true;
            }

            let response_data = {
                availability: availability,
                icon: options.icon,
                service_name: options.service_name,
                link: options.url
            }

            if (options.link) {
                response_data.link = options.link
            }

            resolve(response_data);
        });
    }

    // Checkall function that can be used by external scripts
    checkAll(callback) {
        Promise.all([
            // Specialised Checks
            this.#twitterCheck(),
            this.#steamCheck(),
            this.#robloxCheck(),
            this.#twitchCheck(),

            // Traditional Checks
            this.#traditionalCheck( // GitHub check
                {
                    url: `https://github.com/${this.username}/`,
                    icon: "fab fa-github",
                    service_name: "GitHub"
                }
            ),
            this.#traditionalCheck( // Behance check
                {
                    url: `https://behance.net/${this.username}/`,
                    icon: "fab fa-behance",
                    service_name: "Behance"
                }
            ),
            this.#traditionalCheck( // Youtube check
                {
                    url: `https://youtube.com/c/${this.username}/`,
                    icon: "fab fa-youtube",
                    service_name: "YouTube"
                }
            ),
            this.#traditionalCheck( // Reddit check
                {
                    url: `https://www.reddit.com/user/${this.username}.json`,
                    icon: "fab fa-reddit",
                    service_name: "Reddit",
                    link: `https://www.reddit.com/user/${this.username}`
                }
            ),
            this.#traditionalCheck( // Minecraft check
                {
                    url: `https://api.mojang.com/users/profiles/minecraft/${this.username}`,
                    icon: "fas fa-cube",
                    service_name: "Minecraft",
                    link: `https://namemc.com/profile/${this.username}/`
                }
            ),
            this.#traditionalCheck( // Facebook check
                {
                    url: `https://www.facebook.com/${this.username}/`,
                    icon: "fab fa-facebook",
                    service_name: "Facebook"
                }
            ),
            this.#traditionalCheck( // Vimeo check
                {
                    url: `https://vimeo.com/${this.username}/`,
                    icon: "fab fa-vimeo",
                    service_name: "Vimeo"
                }
            ),
            this.#traditionalCheck( // Dribbble check
                {
                    url: `https://dribbble.com/${this.username}/`,
                    icon: "fab fa-dribbble",
                    service_name: "Dribbble"
                }
            )
        ]).then((values)=>{
            callback(values);
        })
    }

}

