const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];
//middleware
function checksExistsUserAccount(request, response, next) {
  const {username} = request.headers;
  
  const user = users.find((user)=> user.username === username)

  if (!user){
    return response.status(400).json({error:"Username not registred" })
  }
  request.username = user 

  return next()
}
app.post("/users",(request, response) => {
  const { name, username } = request.body;

  const UserAlredyExists = users.some((user) => 
  user.username === username)

  if (UserAlredyExists){
    return response.status(400).json({error: "User already exists! "})
  }


  const id = uuidv4;

  users.push({
    id: uuidv4(),
    name,
    username,
    todos: [],
  });
  ;

  return response.status(201).json(users);
});

app.get("/todos", checksExistsUserAccount,(request, response) => {
  const { username } = request.headers;
   const user = users.find((user)=> user.username === username)
  return response.json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { username } = request

  const createnewtodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline,
    creat_at: new Date(),
  };
  username.todos.push(createnewtodo);
  return response.json(username.todos);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
   const {username} = request
   const {title, deadline} = request.body 
   const {id} = request.params

 const checkId = username.todos.find((checkId)=> username.todos.id === id)
 if (!checkId){
   return response.status(400).json({error: "id not found"})}

   username.deadline = deadline

 username.title = title
return response.status(201).send()

});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
