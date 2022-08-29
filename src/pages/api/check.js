import { getPromises } from "@utils/checker";

import { isValidCaptcha, isValidUsername } from "@utils/validation";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.status(405).send("Method not allowed");
        return;
    }

    const { submittedUsername, gReCaptchaToken } = req.body;

    if (!submittedUsername || !isValidUsername(submittedUsername)) {
        res.status(400).send('Invalid username input. Please try again.');
        return;
    }

    if (!gReCaptchaToken || !await isValidCaptcha(gReCaptchaToken)) {
        res.status(400).send('ReCAPTCHA verification failed. Please try again.');
        return;
    }

    const promises = getPromises(submittedUsername);

    res.status(200).json(
        (await Promise.allSettled(promises)).map(result => {
            return { status: result.value.status, url: result.value.url, name: result.value.name };
        })
    );
}
