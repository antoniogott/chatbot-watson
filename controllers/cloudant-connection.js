const Cloudant = require('@cloudant/cloudant');
const fs = require('fs');

function dbCloudantConnect() {
    return new Promise((resolve, reject) => {
        const vcap = JSON.parse(fs.readFileSync('./vcap-local.json'));
        console.log('vcap', vcap);
        Cloudant({
            url: vcap.services.cloudantNoSQLDB[0].credentials.url
        }, ((err, cloudant) => {
            if (err) {
                reject(err);
            } else {
                let db = cloudant.use('tickets');
                resolve(db);
            }
        }));
    });
}

exports.dbCloudantConnect = dbCloudantConnect;