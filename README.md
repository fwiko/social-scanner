# Social Scanner
 A web app written in Node.JS using express that will check if a username is available on different websites/services.
 https://checker.raffsimms.com

## Run Locally

### Environment Variables
Create `.env` in main directory containing the following information
```
CONSUMER_KEY = TWITTER_API_CONSUMER_KEY
CONSUMER_SECRET = TWITTER_API_SECRET
BEARER_TOKEN = TWITTER_API_BEARER_TOKEN

TWITCH_BEARER_TOKEN = TWITCH_APP_BEARER_TOKEN
TWITCH_CLIENT_ID = TWITCH_APP_CLIENT_ID

PORT = 3027
```

### Running the App
`npm install`

`npm run start`

## Run Using Docker

### Environment Variables
Create `.env` in main directory containing the following information
```
CONSUMER_KEY = TWITTER_API_CONSUMER_KEY
CONSUMER_SECRET = TWITTER_API_SECRET
BEARER_TOKEN = TWITTER_API_BEARER_TOKEN

TWITCH_BEARER_TOKEN = TWITCH_APP_BEARER_TOKEN
TWITCH_CLIENT_ID = TWITCH_APP_CLIENT_ID

PORT = 3027
```

### Prerequisite Installation
`npm install`

### Creation of Docker Image
`docker build -t social-scanner .`

### Running the Docker Image
`docker run -d -v "$PWD":/usr/src/app -p 3027:3027 --name social-scanner-app social-scanner:latest`
