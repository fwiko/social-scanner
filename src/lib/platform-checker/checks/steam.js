import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser();

export const steamCheck = (username) => {
    return new Promise(async (resolve, reject) => {
        let response;
        try {
            response = await axios.get(`https://steamcommunity.com/id/${username}/?xml=1`, { headers: { "X-Requested-With": "XMLHttpRequest" } });
        } catch (err) {
            reject(err);
            return;
        }

        const parsed = parser.parse(response.data);

        const available = !parsed.hasOwnProperty('profile')
        resolve({
            url: `https://steamcommunity.com/id/${username}`,
            available
        }); // false if user exists
    });
}