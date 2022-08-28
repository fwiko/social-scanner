# **Social Scanner**

Check the availability of your favourite username on a variety of online platforms. Originally built using ExpressJS and Handlebars, I decided to refactor this project and use it as an oppourtunity to update the front-end design and further my experience using Next.JS.

# **Deployment**

This application has been designed to run within a [Docker](https://www.docker.com/) container, using environment variables to store any necessary API keys for certain platforms. The [Google ReCAPTCHA v3](https://developers.google.com/recaptcha/docs/v3) site key must be set as a build argument when building the image.

### Build Docker Image

```bash
docker build -t social-scanner \
    --build-arg=NEXT_PUBLIC_RECAPTCHA_SITE_KEY='<public-recaptcha-site-key>' .
```

### Running the Docker Image

```bash
docker run -d -p <hostPort>:3000 \
    -e TWITTER_API_TOKEN='<twitter-api-token>' \
    -e RECAPTCHA_SECRET_KEY='<recaptcha-secret-key>' \
    -e TWITCH_CLIENT_ID='<twitch-client-id>' \
    -e TWITCH_CLIENT_SECRET='<twitch-client-secret>' \
    --name social-scanner social-scanner
```
