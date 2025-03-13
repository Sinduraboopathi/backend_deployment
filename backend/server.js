import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import sequelize from "./config/database.js";
import authenticateToken from "./middleware/authenticateToken.js";
import * as authController from "./controllers/auth.controller.js";
import * as movieController from "./controllers/movie.controller.js";
import { Op } from "sequelize";
import Movie from "./models/movie.model.js";
import { validateMovie } from "./middleware/validateMovie.js";
import netflixRoutes from "./routes/netflix.js"; 

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://moviewatchtracker.s3-website-us-east-1.amazonaws.com",
    ],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(express.json());
app.use("/netflix", netflixRoutes);

sequelize
  .sync()
  .then(() => console.log("✅ Database synchronized"))
  .catch((err) => console.error("❌ Database sync error:", err));

app.post("/signup", authController.signup);
app.post("/login", authController.login);
app.get("/profile", authenticateToken, authController.profile);
app.post("/forgot-password", authController.forgotPassword);
app.post("/reset-password/:token", authController.resetPassword);

app.get("/movies/table", authenticateToken, async (req, res) => {
  try {
    const {
      offset = 0,
      limit = 10,
      search = "",
      sortBy = "title",
      sortOrder = "ASC",
    } = req.query;

    console.log("Query params:", { offset, limit, search, sortBy, sortOrder });

    const whereClause = { user_id: req.user.id };

    if (search.trim() !== "") {
      whereClause.title = { [Op.like]: `%${search}%` };
    }

    const validSortFields = ["title", "release_year", "rating", "genre", "status"];
    const finalSortField = validSortFields.includes(sortBy) ? sortBy : "title";
    const finalSortOrder = ["ASC", "DESC"].includes(sortOrder.toUpperCase())
      ? sortOrder.toUpperCase()
      : "ASC";

    console.log(`Sorting by: ${finalSortField} ${finalSortOrder}`);

    const { count, rows } = await Movie.findAndCountAll({
      where: whereClause,
      order: [[finalSortField, finalSortOrder]],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });

    res.json({ movies: rows, totalMovies: count });
  } catch (err) {
    console.error("Error fetching movies for table:", err);
    res.status(500).json({ message: "Error fetching movies for table." });
  }
});

app.post("/movies", authenticateToken, validateMovie, movieController.addMovie);
app.put("/movies/:id", authenticateToken, validateMovie, movieController.updateMovie);
app.delete("/movies/:id", authenticateToken, movieController.deleteMovie);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
