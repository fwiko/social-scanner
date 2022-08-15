import axios from 'axios';

export const isValidUsername = (username) => {
    return /^[a-zA-Z0-9_.-]{1,30}$/.test(username);
}

export const isValidCaptcha = async (captchaResponse) => {
    let response;
    try {
        response = await axios.get(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaResponse}`);
    } catch (err) {
        return false;
    }
    return response.data.success;
}