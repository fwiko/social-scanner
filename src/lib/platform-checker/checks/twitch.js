import { ClientCredentialsAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';

const authProvider = new ClientCredentialsAuthProvider(
    process.env.TWITCH_CLIENT_ID,
    process.env.TWITCH_CLIENT_SECRET
);

export const twitchCheck = async (username) => {
    return new Promise(async (resolve, reject) => {
        let response;
        try {
            const client = new ApiClient({ authProvider });
            response = await client.users.getUserByName(username);
        } catch (err) {

            const errorBody = JSON.parse(err.body);
            if (errorBody.status === 400) {
                resolve({
                    url: `https://twitch.tv/${username}`,
                    available: false
                });
            } else {
                console.error(err.stack);
                reject(err);
            }
            return;
        }

        resolve({
            url: `https://twitch.tv/${username}`,
            available: !response
        });
    });
}