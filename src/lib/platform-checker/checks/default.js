import axios from 'axios';

export const defaultCheck = (url, username) => {
    return new Promise(async (resolve, reject) => {
        const formattedUrl = url.replace('{username}', username);

        let response;
        try {
            response = await axios.get(formattedUrl);
        } catch (err) {
            if (err.code === 'ERR_BAD_REQUEST') {
                resolve({ url: formattedUrl, available: true });
            }
            reject(err);
            return;
        }

        resolve({
            url: formattedUrl,
            available: response.status !== 200
        }); // true if response code is not 200
    });
}

export const defaultCheckMany = (urls, username) => {
    return new Promise(async (resolve, reject) => {
        const responses = await Promise.allSettled(urls.map(url => defaultCheck(url, username)));

        if (responses.every(r => r.status === 'rejected')) {
            reject(responses.map(r => r.reason));
        }

        const available = !responses.some(r => r.value.available === false)

        resolve({
            url: available ? responses[0].value.url : responses.find(r => r.value.available === false).value.url,
            available
        }); // true if all response codes are not 200
    });
}