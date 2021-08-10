const express = require('express');
const db = require('./models/index');
const dotenv = require('dotenv');
const app = express();

dotenv.config();

db.sequelize.sync().then(() => {
        console.log("Database Connected");
    }).catch(err => {
        console.log(("Error"));
        console.log(err);
});

app.listen(3065, () => {
    console.log("3065 Port Opened")
});