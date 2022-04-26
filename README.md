# Social Scanner
 A web app written with [node.js](https://nodejs.org/en/) allowing users to check the availability of usernames on a variety of online platforms.
 https://checker.raffsimms.com

## Run

### Environment Variables
Create `.env` in the root directory containing the following information
```
# host data
PORT = 80

# twitter data
TWITTER_TOKEN = <your-twitter-token>
```

### Install dependencies

`npm install`

### Running the App


`npm run start`

## Containerise with Docker

### Prerequisite Installation
`npm install`

### Creation of Docker Image
`docker build -t social-scanner .`

### Running the Docker Image
`docker run -d -v "$PWD":/usr/src/app -p 80:<containerPort> --name social-scanner social-scanner:latest`