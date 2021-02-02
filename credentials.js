module.exports = {
    cookieSecret: '8gSYnnyS',
    mongo: {
        development: { //The one we use. Connects to a MongoDB on mlab.com
            connectionString: 'mongodb://lecture:corona@3909-shard-00-00-e9ga9.mongodb.net:27017,3909-shard-00-01-e9ga9.mongodb.net:27017,3909-shard-00-02-e9ga9.mongodb.net:27017/test?ssl=true&replicaSet=3909-shard-0&authSource=admin&retryWrites=true&w=majority'
        },
        production: { // We won't use this. Below shows credentials for connecting to a MongoDB on objectrocket.com
            username : 'lecture',
            password : 'corona',
            hosts : 'iad2-c0-0.mongo.objectrocket.com:52153,iad2-c0-1.mongo.objectrocket.com:52153,iad2-c0-2.mongo.objectrocket.com:52153',
            database : '3909Lectures',
            options : '?replicaSet=fc522f688b9b405cbd48e1a04daf47d2',
        },
    },
}