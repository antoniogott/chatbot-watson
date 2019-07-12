const cloudantConnection = require('./cloudant-connection');

let db;

(function getDbConnection() {
    cloudantConnection.dbCloudantConnect().then((database) => {
        db = database;
    }).catch((err) => {
        console.log('Error while initializing DB:', err.message);
        throw err;
    });
})();

function createTicket(ticket) {
    return new Promise((resolve, reject) => {
        // let listId = uuidv4();
        let data = Date.now();
        let newTicket = {
            // _id: listId,
            // id: listId,
            type: 'ticket',
            name: ticket.name,
            problem: ticket.problem,
            title: ticket.title,
            status: ticket.status,
            data: data
        };
        db.insert(newTicket, (err, result) => {
            if (err) {
                console.log('Error occurred:', err.message);
                reject(err);
            } else {
                resolve({ data: { createdId: result.id, createdRevId: result.rev }, statusCode: 201 });
            }
        });
    });
}

function findByTitle(title) {
    return new Promise((resolve, reject) => {
        db.find({
            'selector': {
                'title': `"${title}"`
            }
        }, (err, documents) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log(documents);
                console.log(documents.docs);
                resolve(documents.docs);
            }
        });
    });
}

module.exports.createTicket = createTicket;
module.exports.findByTitle = findByTitle;