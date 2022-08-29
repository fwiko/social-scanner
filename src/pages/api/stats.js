import { getStats } from "@utils/checker";

export default async function handler(req, res) {
    const stats = getStats();
    res.status(200).json({
        uniqueChecks: stats.checkedUsernames.length,
        totalChecks: stats.totalChecks
    });
}