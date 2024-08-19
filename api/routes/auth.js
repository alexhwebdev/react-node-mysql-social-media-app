import express from "express";
import { register, login, logout } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)

export default router;


// // saltRounds : represents number of calculations needed to produce the hashed password.
// const saltRounds = 10;

// app.post('/signup', (req, res) => {
//   // res.send('Hello from our server!')
//   const username = req.body.username;
//   const password = req.body.password;
//   // console.log('req ', req)

//   bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
//     if (err) {
//       res.status(418).send(`Couldn't hash password..`)
//     } else {
//       db.query(
//         "INSERT INTO users (username, password) VALUES (?, ?)",
//         [username, hashedPassword],
//         (err, result) => {
//           if (err) {
//             // console.log(err)
//             res.status(418).send(`Couldn't register user`)
//           } else {
//             // console.log(result)
//             res.send({ username: username })

//           }
//         }
//       )
//     }
//   })
// })