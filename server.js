const express = require('express');
const mongoose = require('mongoose');

let app = express();

let port = process.env.port || 3001;

const mong_user = process.env.TEAMDATA_MONGODB_USERNAME
const mongo_password = process.env.TEAMDATA_MONGODB_PASSWORD
const mongo_url= process.env.TEAMDATA_MONGODB_URL

mongoose.connect("mongodb+srv://"+mong_user+":"+mongo_password+"@"+mongo_url+"/?retryWrites=true&w=majority").then(
    () => console.log("Connected to mongodb"),
    (err) => console.log("Failed to connect. Reason",err)
);

app.listen(port)
console.log("Running in ", port);