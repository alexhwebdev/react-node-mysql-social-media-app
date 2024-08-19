import express from 'express';
// const express = require('express')
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";

const app = express();

app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/likes", likeRoutes)


app.listen(8800, () => {
  console.log("Listening on port 8800")
})




// userRoutes.route("/users").post(async (request, response) => {
//   let db = database.getDb()

//   const takenEmail = await db.collection("users").findOne({email: request.body.email})

//   if (takenEmail) {
//     response.json({message: "The email is taken"})
//   } else {
//     const hash = await bcrypt.hash(request.body.password, SALT_ROUNDS)

//     let mongoObject = {
//       name: request.body.name,
//       email: request.body.email,
//       password: hash,
//       joinDate: new Date(),
//       posts: []
//     }

//     let data = await db.collection("users").insertOne(mongoObject)
//     response.json(data)    
//   }
// })