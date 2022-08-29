import fs from 'fs';

import stats from '../data/stats.json';
import { SocialCheckerConfig } from '../../checker.config';

export const getPromises = (username) => {

    const defaultPromises = SocialCheckerConfig.default.platforms.map(async platform => {
        let status, url;
        const { checkFunction } = SocialCheckerConfig.default;
        try {
            const response = await checkFunction(platform.checkUrl, username);
            url = response.url;
            status = response.available ? 'available' : 'unavailable';
        } catch (err) {
            status = 'errored';
        }

        return {
            status,
            url: platform.redirectUrl ? platform.redirectUrl.replace('{username}', username) : url,
            name: platform.name,
        }
    });

    const defaultManyPromises = SocialCheckerConfig.defaultMany.platforms.map(async platform => {
        let status, url;
        const { checkFunction } = SocialCheckerConfig.defaultMany;
        try {
            const response = await checkFunction(platform.checkUrls, username);
            url = response.url;
            status = response.available ? 'available' : 'unavailable';
        } catch (err) {
            status = 'errored';
        }

        return {
            status,
            url: platform.redirectUrl ? platform.redirectUrl.replace('{username}', username) : url,
            name: platform.name,
        }
    });

    const otherPromises = SocialCheckerConfig.other.platforms.map(async platform => {
        let status, url;
        try {
            const response = await platform.checkFunction(username)
            url = response.url;
            status = response.available ? 'available' : 'unavailable';
        } catch (err) {
            // catch indeterminate errors (invalid or expired API keys, unrecognised library/API errors etc...)
            status = 'errored';
        }

        return {
            status,
            url: platform.redirectUrl ? platform.redirectUrl.replace('{username}', username) : url,
            name: platform.name
            // platformLink: platform.redirectUrl.replace("{username}", username)
        }
    });

    return [...defaultPromises, ...defaultManyPromises, ...otherPromises];
}

export const getStats = () => {
    return stats;
}

export const updateStats = (username) => {
    stats.totalChecks += 1;
    if (!stats.checkedUsernames.includes(username)) {
        stats.checkedUsernames.push(username);
    }
    fs.writeFile('../../checker.config', JSON.stringify(stats), (err) => {
        if (err) throw err;
    })
}