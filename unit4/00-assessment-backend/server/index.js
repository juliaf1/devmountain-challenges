const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

const { getCompliment, getFortune, getDrinkBotAnswer, createToDoItem, listToDoItems, updateToDoItem } = require('./controller');

app.get("/api/compliment", getCompliment);

app.get("/api/fortune", getFortune);

app.get("/api/drink_allowed", getDrinkBotAnswer);

app.post("/api/todo", createToDoItem)

app.get("/api/todo", listToDoItems);

app.put("/api/todo/:id", updateToDoItem);

app.listen(4000, () => console.log("Server running on 4000"));
