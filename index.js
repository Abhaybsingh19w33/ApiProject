require("dotenv").config();
// framework
const express = require("express");
 
const shapeAI = express();
const mongoose = require('mongoose');

// microservices routes
const Books = require("./API/Book");
const Authors = require("./API/Author");
const Publications = require("./API/Publication");
shapeAI.use(express.json());

// establishing the mdb connection
mongoose.connect(
    process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }
).then(() => console.log("connection established"));

// initializing microservices
shapeAI.use("/book", Books);
shapeAI.use("/author", Authors);
shapeAI.use("/publication", Publications);

// starting the server
shapeAI.listen(3000, () => console.log("server is running!"));

//  mongoose helps you with validation, relationship with other data
// mongoose model -> document model of mongoDb 
// collection -> individual databases
// architecture 
// schema -> convert them to mongoose Model -> use them