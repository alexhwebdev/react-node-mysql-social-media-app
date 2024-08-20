import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = (req, res) => {
  // console.log('req ', req)
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  // If token exists, validate it
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `
      SELECT p.*, u.id AS userId, name, profilePic
      FROM posts AS p
      JOIN users AS u
      ON (u.id = p.userId)
      LEFT JOIN relationships AS r
      ON (p.userId = r.followedUserId)
      WHERE r.followerUserId = ? OR p.userId = ?
      ORDER BY p.createdAt DESC
    `;

    db.query(q, [userInfo.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json(data)
    })
  })
}

export const addPost = (req, res) => {
  // console.log('req ', req)
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  // If token exists, validate it
  jwt.verify(token, "secretkey", (err, userInfo) => {
    // console.log('addPost userInfo ', userInfo)
    if (err) return res.status(403).json("Token is not valid!");

    // const q = `
    //   INSERT INTO posts ("desc", "img", "createdAt", "userId")
    //   VALUES ?
    // `;

    const q = "INSERT INTO posts (`desc`, `img`, `createdAt`, `userId`) VALUES (?)";

    const values = [
      req.body.desc,
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json("Post created.")
    });
  })
}

/*
Posts table columns :
  id  [Foreign key : userId]
  desc
  img
  userid
  createdAt

Users table columns :
  id
  username
  email
  password
  name
  coverPic
  profilePic
  city
  website
*/