const express = require("express");

const shapeAI = express();

shapeAI.use(express.json());

shapeAI.listen(3000, () => console.log("server is running!"));