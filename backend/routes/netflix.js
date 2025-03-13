import express from "express";
import { NetflixTitles } from "../controllers/netflixController.js";

const netflixRoutes = express.Router();

netflixRoutes.get("/", NetflixTitles); // Endpoint: /netflix

export default netflixRoutes;
