import fs from "fs";
import csv from "fast-csv";
import { Sequelize, DataTypes } from "sequelize";
import NetflixTitle from "./models/NetflixTitle.js"; 

const sequelize = new Sequelize("netflix", "main_db", "main", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

const netflixTitle = NetflixTitle(sequelize, DataTypes);

async function importCSV() {
  try {
    await sequelize.sync(); 

    const records = [];

    fs.createReadStream("netflix_titles.csv")
      .pipe(csv.parse({ headers: true }))
      .on("data", (row) => {
        records.push(row); 
      })
      .on("end", async () => {
        try {
          await netflixTitle.bulkCreate(records, { ignoreDuplicates: true }); 
          console.log("✅ CSV file successfully imported!");
        } catch (err) {
          console.error("❌ Error inserting rows:", err);
        } finally {
          await sequelize.close();
        }
      });

  } catch (err) {
    console.error("❌ Database connection error:", err);
  }
}

importCSV();
