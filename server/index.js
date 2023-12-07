///require express
const express = require("express");

const cors = require('cors');


//create express app

const app = express();
//middleware: intermediate functions that we want
//to run in between the request and the response.
//middleware: parsing JSON request body
app.use(cors());
//middleware: logging the request
app.use((req, res, next) => {
  //Examples: req.method: get, post, put, delete, req.url: /api/users
  console.log(`${req.method} ${req.url}`);
  //next() is a function that we call to move on to the next middleware
  next();
});
//middleware: parsing JSON request body
app.use(express.json());

let blogPosts = [
  {
    id: 1,
    title: "First Post",
    content: "This is my first post",
    comments: [],
  },
  {
    id: 2,
    title: "Second Post",
    content: "This is my second post",
    comments: [],
  },
  {
    id: 3,
    title: "Third Post",
    content: "This is my third post",
    comments: [],
  },
];
app.get("/", (req, res) => {
  res.send("Welcome to my blog!");
});

app.get("/posts", (req, res) => {
  res.json(blogPosts);
});
app.post("/posts", (req, res) => {
  const newPost = {...req.body};
  blogPosts.push(newPost);
  //send
  res.status(201).json(newPost);
});
//update: PUT request route handler to update a blog post
//use : in route to indicate a variable(route paramater) eg: /posts/27
app.put("/posts/:id", (req, res) => {
  //extract id from request params object using destructuring
  const { id } = req.params;
  let index = blogPosts.findIndex((post) => post.id == id);
  if (index !== -1) {
    // update the blog post at that index with the new information
    //the blog post at the index should be updated to be a new
    //objectthat has all of thesame data as the original blog post,
    //but with whatever data was sent in the request overwriting old data
    blogPosts[index] = { ...blogPosts[index], ...req.body };
    //send back the new, updated blog post
    res.json(blogPosts[index]);
  } else {
    //if blog post with matching id not found
    //send 404 status
    res.status(404).send("Post not found");
  }
});
//delete: DELETE request route handler to delete a blog post
app.delete("/posts/:id", (req, res) => {
  const { id } = req.params;
  // use filter method, if the blog post id does not match id params, it stays
  // if it does, it gets removed(filtered out) of the array
  blogPosts.filter((post) => post.id !== Number(id));
  res.status(204).send();
});

//start the server
const PORT = 3001;//react running on 3000
app.listen(PORT, () => {
  console.log(`Server is running on port localhost:${PORT}.`);
});