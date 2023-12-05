const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const MemoryStore = require("express-session/session/memory");
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const store = new MemoryStore();

const app = express();

app.use(express.json());

app.use("/customer", session({secret: "fingerprint_customer", resave: true, saveUninitialized: true, store: store}))

app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.session.authorization) {
        let token = req.session.authorization["accessToken"]

        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user
                next()
            } else {
                res.status(401).json({message: "User not authenticated"})
            }
        })

    } else {
        res.status(401).json({
            message: "Unauthorized"
        })
    }
});

const PORT = 8080;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
