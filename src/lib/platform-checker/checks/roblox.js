import axios from 'axios';

export const robloxCheck = (username) => {
    return new Promise(async (resolve, reject) => {
        let response;
        try {
            response = await axios.get(`https://api.roblox.com/users/get-by-username?username=${username}`)
        } catch (err) {
            reject(err);
            return;
        }

        const available = !response.data.hasOwnProperty('Id');
        resolve({
            url: available ? 'https://roblox.com/' : `https://roblox.com/users/${response.data.Id}`,
            available
        }); // false if user exists
    })
}