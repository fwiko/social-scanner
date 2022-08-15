import { TwitterApi } from 'twitter-api-v2';

const twitterClient = new TwitterApi(process.env.TWITTER_API_TOKEN);

export const twitterCheck = (username) => {
    return new Promise(async (resolve, reject) => {
        let response;
        try {
            response = await twitterClient.v2.userByUsername(username);
        } catch (err) {
            if (err.code === 400) {
                resolve({
                    url: `https://twitter.com/${username}`,
                    available: false
                });
            } else {
                console.error(err.stack);
                reject(err);
            }
            return;
        }

        let available = !(!!response.data && !!response.data.id)

        if (response.errors) {
            available = available && !response.errors.some(error => error.title === 'Forbidden');
        }

        resolve({
            url: `https://twitter.com/${username}`,
            available
        }); // false if user exists
    })
}