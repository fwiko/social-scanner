import axios from 'axios';

export const minecraftCheck = (username) => {
    return new Promise(async (resolve, reject) => {
        let response;
        try {
            response = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${username}`);
        } catch (err) {
            reject(err);
            return;
        }

        const available = !response.data.hasOwnProperty('id')
        resolve({
            url: `https://api.mojang.com/users/profiles/minecraft/${username}`,
            available
        }); // false if user exists
    })
}