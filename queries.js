const { Pool } = require("pg");
require("dotenv").config();
const csvtojson = require("csvtojson");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

//route for /Data
const getData = (request, response) => {
    pool.query(
      "SELECT * FROM Country",
      (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    });
  };


  //route for /insert-food
const insertData = (request, response) => {
    const { Country, Mwi, Mwi_level, Total_waste, Skip_1, Skip_2, Skip_3, Skip_4, Skip_5, Skip_6} = request.body;
    pool.query(
      `INSERT INTO Data_tmp (Country, Mwi , Mwi_level, Total_waste, Skip_1, Skip_2, Skip_3, Skip_4, Skip_5, Skip_6 ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [Country, Mwi, Mwi_level, Total_waste, Skip_1, Skip_2, Skip_3, Skip_4, Skip_5, Skip_6],
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(201).send(`Data added`);
      }
    );
  };

  //route for /populateFoods
const populateData = (request, response) => {
    const plastdata = "plastic-pollution-by-country-2024.csv"; 
    const options = {
        delimiter: ';'
      };

    csvtojson().fromFile(plastdata, options).then(source => {
        //Fetching the data from each row
        //and inserting to the table food_tmp
        for (var i = 0; i < source.length; i++) {

          var Country = source[i].Country;
          var Mwi = source[i].Mwi;
          var Mwi_level = source[i].Mwi_level;
          var Total_waste = source[i].Total_waste;
          var Skip_1 = source[i].Skip_1;
          var Skip_2 = source[i].Skip_2;
          var Skip_3 = source[i].Skip_3;
          var Skip_4 = source[i].Skip_4;
          var Skip_5 = source[i].Skip_5;
          var Skip_6 = source[i].Skip_6;
  
            //TODO: fortsæt med de andre kolonner
            //TODO: her skal laves to variabler: insertStatement og items. 
            let insertStatement = `INSERT INTO Data_tmp (Country, Mwi, Mwi_level, Total_waste, Skip_1, Skip_2, Skip_3, Skip_4, Skip_5, Skip_6) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`; 
            let items = [Country, Mwi, Mwi_level, Total_waste, Skip_1, Skip_2, Skip_3, Skip_4, Skip_5, Skip_6 ];
            //insertStatement skal bestå af sådan som du vil indsætte data i food_tmp tabellen, men med 
            //placeholders $1, $2 osv i stedet for værdier
            //items er en array med de variabler der er blevet defineret ud fra vores data lige ovenover
    
            //Inserting data of current row into database
            pool.query(insertStatement, items, (err, results, fields) => {
                if (err) {
                    console.log("Unable to insert item at row " + i+1);
                    return console.log(err);
                }
            });
        }
        response.status(201).send('All Data added');
    })
  }
  // Route for /data/mwiOutliers
  const getmwiOutliers = (request, response) => {
    pool.query(
      "SELECT Country_name, mwi_value FROM Country ORDER BY mwi_value DESC LIMIT 5;",
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(200).json(results.rows);
      }
    );
  };
  
  
    // Route for /data/wasteOutliers
    const getwasteOutliers = (request, response) => {
      pool.query(
        "SELECT Country_name, total_waste FROM Country ORDER BY total_waste DESC LIMIT 5;",
        (error, results) => {
          if (error) {
            throw error;
          }
          response.status(200).json(results.rows);
        }
      );
    };
    
  
  module.exports = {
    getData, 
    insertData,
    populateData,
    getmwiOutliers,
    getwasteOutliers,
  };



// In the context of parameterized queries using the pg library in Node.js, the placeholders are represented by $1, $2, and so on, instead of using ${name} syntax
// The reason for this difference is that the $1, $2 syntax is specific to the pg library and the PostgreSQL query protocol. It is used to bind parameters securely and efficiently in the query.
// When using parameterized queries with the pg library, you pass the actual values as an array in the second parameter of the query() function. The library internally maps these values to the corresponding placeholders in the SQL query string based on their position in the array.
// Therefore, in the given code snippet, you should continue using $1, $2, and $3 placeholders to represent the variables name, email, and id, respectively, instead of using the ${name} syntax.