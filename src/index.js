const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");
const { validate } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];
//middleware verify for exists account
function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(400).json({ error: "Username not registred" });
  }
  request.userAuthenticated = user;

  return next();
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  const UserAlredyExists = users.some((user) => user.username === username);

  if (UserAlredyExists) {
    return response.status(400).json({ error: "User already exists! " });
  }

  const id = uuidv4;

  users.push({
    id: uuidv4(),
    name,
    username,
    todos: [],
  });
  return response.status(201).json(users);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const user = users.find((user) => user.username === username);
  return response.json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { userAuthenticated } = request;

  const createnewtodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline,
    creat_at: new Date(),
  };
  userAuthenticated.todos.push(createnewtodo);
  return response.json(createnewtodo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { userAuthenticated } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const checkIdTodo = userAuthenticated.todos.find((todo) => todo.id === id);
  if (!checkIdTodo) {
    return response.status(400).json({ error: "id not found" });
  }

  var ISO_8601_FULL =
    /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;

  if (!ISO_8601_FULL.test(deadline)) {
    return response.status(400).json({ error: "Format to date not suported" });
  }

  const todoData = userAuthenticated.todos.find((todo) => todo.id === id);

  todoData.deadline = new Date(deadline);

  todoData.title = title;

  return response.status(201).json({ message: "Todo are update sucessful" });
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { userAuthenticated } = request;
  const { id } = request.params;

  const checkIdTodo = userAuthenticated.todos.find((todo) => todo.id === id);
  if (!checkIdTodo) {
    return response.status(400).json({ error: "id not found" });
  }

  let todoData = userAuthenticated.todos.find((todo) => todo.id === id);

  todoData.done = true;

  return response
    .status(201)
    .json({ message: "Congratulations for complete your todo" });
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { userAuthenticated } = request;
  const { id } = request.params;

  const checkIdTodo = userAuthenticated.todos.find((todo) => todo.id === id);
  if (!checkIdTodo) {
    return response.status(400).json({ error: "id not found" });
  }
  let index = userAuthenticated.todos.findIndex((todo) => todo.id === id);

  userAuthenticated.todos.splice(index, 1);

  return response.status(204).send();
});

module.exports = app;
