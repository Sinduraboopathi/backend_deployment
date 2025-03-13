import fs from "fs";
import csv from "fast-csv";
import { Sequelize, DataTypes } from "sequelize";
import NetflixTitleModel from "./models/NetflixTitle.js"; 
const sequelize = new Sequelize("netflix", "main_db", "main", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

const NetflixTitle = NetflixTitleModel(sequelize); 

async function importCSV() {
  try {
    await sequelize.sync(); 

    const records = [];

    fs.createReadStream("netflix_titles.csv")
      .pipe(csv.parse({ headers: true }))
      .on("data", (row) => {
        records.push({
          title: row.title,
          type: row.type,
          year: row.year ? parseInt(row.year, 10) : null,
          rating: row.rating,
          genre: row.genre
        });
      })
      .on("end", async () => {
        try {
          if (records.length === 0) {
            console.log("No records to insert!");
            return;
          }

          await NetflixTitle.bulkCreate(records, { ignoreDuplicates: true });
          console.log(`Successfully inserted ${records.length} records!`);
        } catch (err) {
          console.error("Error inserting rows:", err);
        } finally {
          await sequelize.close();
        }
      });

  } catch (err) {
    console.error("❌ Database connection error:", err);
  }
}

importCSV();
