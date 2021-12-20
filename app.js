//app aim: writing data to the cache, 10 seconds are handled in cache


const express = require("express");
const app = express();
//For opening endpoints our Node.js projects, express handles endpoint opening


const redis = require("redis");

//redis run port

//redis client creation
//normalde localhost ile bağlanılan redis docker ile "host: redis" aracılığı ile bağlanabiliyorum app isimleri ile bilirler
const client = redis.createClient({
    host: "redis", port: 6379
});

//redis error handler
client.on("error", (err) => {
    console.log(err);
})

//redis client connection handler
client.on('connect', function() {
    console.log('Connected to Redis!');
});

app.get("/user",(req, res) => {
    var name = req.query.name; 
    console.log(name)   
    try {
        client.get(name, async (err, user) => {
            if (err) throw err;
            if (user) {
                res.status(200).send({
                    user: JSON.parse(user),
                    message: "data retrieved from the cache"
                });
            }
            else {
                data = {name: name}
                client.setex(name, 10, JSON.stringify(data)); //client.setex writes key value to cache
                res.status(200).send({
                    user: data,
                    message: "cache miss"
                });
            }
        });
    } catch(err) {
        res.status(500).send({message: err.message}); //exception handler for 
    } 
});

app.listen(process.env.PORT || 8080, () => {
    console.log("Node server started");
});
//opening endpoint for project
