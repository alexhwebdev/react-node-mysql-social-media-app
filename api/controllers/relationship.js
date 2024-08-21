import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getRelationships = (req, res) => {
  // console.log('getLikes req.query ', req.query)
  const q = "SELECT followerUserId FROM relationships WHERE followedUserId = ?";

  db.query(q, [req.query.folowedUserId], (err, data) => {
    if (err) return res.status(500).json(err)
    // console.log('db.query data ', data) // RESULT : [{userId: 2}]
    return res.status(200).json(data.map(relationship => relationship.followerUserId));
  });
}

export const addRelationship = (req, res) => {
  // console.log('addLike req ', req)
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  // If token exists, validate it
  jwt.verify(token, "secretkey", (err, userInfo) => {
    console.log('addLike userInfo ', userInfo)

    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO relationships (`followerUserId`, `followedUserId`) VALUES (?)";
    const values = [
      userInfo.id,
      req.body.userId
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json("Following.")
    });
  })
}

export const deleteRelationship = (req, res) => {
  // console.log('deleteLike req ', req)
  console.log('deleteLike req.query ', req.query)
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  // If token exists, validate it
  jwt.verify(token, "secretkey", (err, userInfo) => {
    console.log('deleteLike userInfo ', userInfo)

    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";

    db.query(q, [userInfo.id, req.query.userId], (err, data) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json("Unfollow.")
    });
  })
}

