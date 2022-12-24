# **Social Scanner**

Check the availability of your favourite username on a variety of online platforms. _Originally built using ExpressJS and Handlebars, I used the opportunity to refactor this project to update the front-end design and further my experience using Next.JS_.

# **Deployment**

This application has been designed to run within a **[Docker](https://www.docker.com/) container**, using environment variables to store API keys necessary for full functionality. The **[Google ReCAPTCHA v3](https://developers.google.com/recaptcha/docs/v3) site key** must be set using `--build-arg` when building the image.

### Build Docker Image

```bash
docker build -t social-scanner \
    --build-arg=NEXT_PUBLIC_RECAPTCHA_SITE_KEY='<public-recaptcha-site-key>' .
```

### Starting the Docker Container

```bash
docker run -d -p <hostPort>:3000 \
    -e TWITTER_API_TOKEN='<twitter-api-token>' \
    -e RECAPTCHA_SECRET_KEY='<recaptcha-secret-key>' \
    -e TWITCH_CLIENT_ID='<twitch-client-id>' \
    -e TWITCH_CLIENT_SECRET='<twitch-client-secret>' \
    --name social-scanner social-scanner:latest
```
