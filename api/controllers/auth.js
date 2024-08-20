import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  // CHECK IF USER EXISTS
  const q = "SELECT * FROM users WHERE username = ?";
  db.query(q, [req.body.username], (err, data) => { 
    // console.log('data[0] ', data[0])
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists!");

    // CREATE NEW USER, HASH PASSWORD
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const q = "INSERT INTO users (`username`, `email`, `password`, `name`) VALUE (?)";
    const values = [req.body.username, req.body.email, hashedPassword, req.body.name];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created.");
    })
  })
}

export const login = (req, res) => {
  // IF USER DOES NOT EXIST, SEND ERROR
  const q = "SELECT * FROM users WHERE username = ?";
  db.query(q, [req.body.username],(err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found!");

    // IF USER EXIST, CHECK PASSWORD
    const checkPassword = bcrypt.compareSync(
      req.body.password, // password given on login
      data[0].password // this is encrypted password
    )

    if (!checkPassword) return res.status(400).json("Wrong password or username!");

    // SEND COOKIE TO CLIENT
    const token = jwt.sign({ id: data[0].id}, "secretkey", {expiresIn: "1h"});

    const { password, ...others } = data[0]; // password wont be sent bc ...others is destructured.

    res.cookie("accessToken", token, {
      httpOnly: true,
    }).status(200).json(others); // The cookie (hash token) includes userId in header and assists with decrypting the hashedPassword in MySQL
  })
}
// data  [
//   {
//     id: 2,
//     username: 'username2',
//     email: 'username2@gmail.com',
//     password: '$2a$10$hW0FSLkjC8eqrB4cF0ysT.oQl43jq.UnoQKwFFsRnTXN8BUUXKOTq',
//     name: 'username2name',
//     coverPic: null,
//     profilePic: null,
//     city: null,
//     website: null
//   }
// ]



export const logout = (req, res) => {
  res.clearCookie("accessToken", {
    secure: true,
    sameSite: "none" // "none" here bc our Client side is port 3000 and Backend is 8800
  }).status(200).json("User has been logged out.")
}



/* -------------------- NOTES
  ? : Use ? instead of req.body.username for security

  res.status(500) : "internal server error"
  res.status(400) : "Not Found"
*/