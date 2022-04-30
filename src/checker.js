const fs = require('fs');
const axios = require('axios').default;
const xml2json = require('xml2json');
const { TwitterApi } = require('twitter-api-v2');

const twitterClient = new TwitterApi(process.env.TWITTER_TOKEN);

function validateUsername(username) {
    return /^[a-zA-Z0-9_.-]{1,30}$/.test(username);
}

function getConfig() {
    return JSON.parse(fs.readFileSync('config.json', 'utf8'));
}

function createPromises(username) {
    const config = getConfig();
    return config.mediums.map(conf => {
        conf.username = username;
        if (conf.urls != undefined) {
            conf.urls = conf.urls.map(url => {
                return url.replace("{username}", username);
            });
        }
        if (conf.link != undefined) {
            conf.link = conf.link.replace("{username}", username);
        }
        return getCheck(conf);
    });
}

function createResponse(options) {
    return {
        name: options.info.name,
        available: options.available,
        link: options.info.link || options.info.urls[0],
        icon: options.info.icon
    }
}

function getCheck(info) {
    if (info.check == undefined) {
        return defaultCheck(info);
    } else {
        switch (info.check) {
            case "steam":
                return steamCheck(info);
            case "roblox":
                return robloxCheck(info);
            case "twitter":
                return twitterCheck(info);
            case "minecraft":
                return minecraftCheck(info);
            // case "twitch":
            //     return twitchCheck(info);
            default:
                return Promise.reject("Not implemented");
        }
    }
}

function defaultCheck(info) {
    return new Promise(async (resolve, reject) => {
        Promise.allSettled(info.urls.map(url => axios.get(url))).then((responses) => {
            const available = !responses.map(x => x.status).some(x => x === "fulfilled");
            if (!available && !info.link) {
                info.link = info.urls[responses.findIndex(x => x.status === "fulfilled")];
            }
            resolve(createResponse({ available, info }));
        });
    });
}

function steamCheck(info) {
    return new Promise(async function (resolve, reject) {
        axios.get(`https://steamcommunity.com/id/${info.username}/?xml=1`, { headers: { "X-Requested-With": "XMLHttpRequest" } }).then(async (response) => {
            const jsonData = JSON.parse(xml2json.toJson(response.data));
            const available = jsonData.profile == undefined
            resolve(createResponse({ available, info }));
        }).catch(err => reject(err));
    });
}

function robloxCheck(info) {
    return new Promise(async function (resolve, reject) {
        axios.get(`https://api.roblox.com/users/get-by-username?username=${info.username}`,
            { headers: { 'Content-Type': 'application/json' } }).then(async (response) => {
                const jsonResponse = response.data;
                const available = !jsonResponse.hasOwnProperty('Id');
                info.link = available ? "https://roblox.com/" : info.link.replace("{id}", jsonResponse.Id);
                resolve(createResponse({ available, info }));
            }).catch(err => reject(err));
    });
}

function twitterCheck(info) {
    return new Promise(async function (resolve, reject) {
        twitterClient.v2.userByUsername(info.username).then(async (response) => {
            const available = !(response.data != undefined && response.data.id != undefined);
            info.link = info.link.replace("{username}", info.username)
            resolve(createResponse({ available, info }));
        }).catch(err => {
            resolve(createResponse({ available: false, info }));
        });
    });
}

function minecraftCheck(info) {
    return new Promise(async function (resolve, reject) {
        axios.get(`https://api.mojang.com/users/profiles/minecraft/${info.username}`).then(async (response) => {
            const jsonResponse = response.data;
            const available = !jsonResponse.hasOwnProperty('id');
            resolve(createResponse({ available, info }));
        }).catch(err => reject(err));
    })
}

module.exports = { getCheck, createPromises, validateUsername };