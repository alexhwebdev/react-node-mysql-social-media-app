import express from "express";
import { getLike } from "../controllers/like.js";

const router = express.Router();

router.get("/find/:userId", getLike)

export default router;