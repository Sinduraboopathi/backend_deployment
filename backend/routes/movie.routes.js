import express from 'express';
import { getMovies } from '../controllers/movie.controller.js';
import authenticateToken from '../middleware/authenticateToken.js';

const movierouter = express.Router();

movierouter.get('/', authenticateToken, getMovies);

export default movierouter;