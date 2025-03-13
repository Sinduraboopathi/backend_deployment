import { DataTypes } from "sequelize";
import sequelize from "../config/database.js"; // Ensure database connection is imported

const NetflixTitle = sequelize.define(
  "NetflixTitle",
  {
    show_id: { type: DataTypes.STRING, allowNull: false, unique: true },
    type: { type: DataTypes.STRING, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    director: { type: DataTypes.STRING },
    cast: { type: DataTypes.TEXT },
    country: { type: DataTypes.STRING },
    date_added: { type: DataTypes.STRING },
    release_year: { type: DataTypes.INTEGER },
    rating: { type: DataTypes.STRING },
    duration: { type: DataTypes.STRING },
    listed_in: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
  },
  {
    timestamps: false,
    tableName: "NetflixTitles",
  }
);

export default NetflixTitle;

