import { defaultCheck, defaultCheckMany } from "./checks/default";
import { minecraftCheck } from "./checks/minecraft";
import { robloxCheck } from "./checks/roblox";
import { steamCheck } from "./checks/steam";
import { twitterCheck } from "./checks/twitter";
import { twitchCheck } from "./checks/twitch";

const checks = { defaultCheck, defaultCheckMany, minecraftCheck, robloxCheck, steamCheck, twitterCheck, twitchCheck };

export default checks;