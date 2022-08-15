import checker from '@lib/platform-checker';

export const SocialCheckerConfig = {
    default: {
        checkFunction: checker.defaultCheck,
        platforms: [
            {
                name: 'GitHub',
                checkUrl: 'https://github.com/{username}'
            },
            {
                name: 'Behance',
                checkUrl: 'https://www.behance.net/{username}'
            },
            {
                name: 'Dribbble',
                checkUrl: 'https://dribbble.com/{username}'
            },
            {
                name: 'Reddit',
                checkUrl: 'https://www.reddit.com/user/{username}.json',
                redirectUrl: 'https://www.reddit.com/user/{username}'
            },
            {
                name: 'Vimeo',
                checkUrl: 'https://vimeo.com/{username}/'
            },
            {
                name: 'SoundCloud',
                checkUrl: 'https://soundcloud.com/{username}',
            }
        ]
    },
    defaultMany: {
        checkFunction: checker.defaultCheckMany,
        platforms: [
            {
                name: 'YouTube',
                checkUrls: [
                    "https://www.youtube.com/c/{username}/",
                    "https://www.youtube.com/user/{username}/"
                ]
            }
        ]
    },
    other: {
        platforms: [
            {
                name: 'Twitter',
                checkFunction: checker.twitterCheck
            },
            {
                name: 'Steam',
                checkFunction: checker.steamCheck
            },
            {
                name: 'Minecraft',
                checkFunction: checker.minecraftCheck,
                redirectUrl: "https://namemc.com/profile/{username}"
            },
            {
                name: 'Roblox',
                checkFunction: checker.robloxCheck
            },
            {
                name: 'Twitch',
                checkFunction: checker.twitchCheck
            }
        ]
    }
}