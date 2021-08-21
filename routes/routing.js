const router = require('express').Router();
const socialChecker = require('../modules/medium_checker');
const mediumChecker = require('../modules/medium_checker')
const fs = require('fs');
 
function checkUsernames(username, callback) {
    const socialChecker = new mediumChecker(username);
    socialChecker.checkAll((mediums) => {
        callback(mediums);
    });
}

function getUsernameCount(callback) {
    fs.readFile('./data/information.json', (err, data) => {
        if (err) throw err;
        let information = JSON.parse(data);
        const username_count = information.usernames_checked;
        return callback(username_count);
    })
}

router.get('/', (req, res) => {
    getUsernameCount((usernames_checked)=>{
        
        if ("username" in req.query) {
            const { username, json } = req.query;
            if (username != undefined && username != "" && username.length <= 30) {
                var ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.ip;

                // Checking usernames availability
                checkUsernames(username, (mediums) => {

                    // Request logging
                    console.log(`\n┌ ${ip} checked "${username}"\n├───────────────────⎯⎯⎯⎯⎯⎯⎯─────⎯⎯⎯⎯⎯`);
                    mediums.forEach(element => {
                        console.log(`│ ${element.service_name}${" ".repeat(((Math.max.apply(Math, mediums.map((e)=>{
                            return e.service_name.length
                        })))-element.service_name.length)+14)} ${element.availability ? "  Available" : "Unavailable"}`)
                    });
                    
                    // Updating usernames checked statistics
                    fs.readFile('./data/information.json', (err, data) => {
                        if (err) throw err;
                        let information = JSON.parse(data);
                        information.usernames_checked += 1;
                        const username_count = information.usernames_checked;
                        const info = JSON.stringify(information);
                        fs.writeFileSync('./data/information.json', info);

                        // Returning results from request
                        if (json==1) {
                            return res.json({
                                username: username,
                                results: mediums
                            })
                        }
                        return res.render('index', {
                            mediums: mediums,
                            username,
                            usernamesChecked: username_count
                        });
                    });
                });

            } else {
                return res.render('index', {
                    message: "Invalid username input",
                    usernamesChecked: usernames_checked
                });
            }
        } else {

            return res.render('index', {
                usernamesChecked: usernames_checked
            });

        }
    })
});

module.exports = router;