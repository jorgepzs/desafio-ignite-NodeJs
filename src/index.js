const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  const id = uuidv4;

  const userData = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };
  users.push(userData);

  return response.status(201).json(userData);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;

  return response.json(username.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { username } = request.headers;

  const createnewtodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    creat_at: new Date(),
  };
  users.todos.push(createnewtodo);
  return response.json(username.todos);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
