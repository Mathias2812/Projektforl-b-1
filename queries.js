// Importér Chart.js-biblioteket
import Chart from 'chart.js/auto';

// Læs data fra CSV-filen
fetch('share-plastic-waste-recycled.csv')
  .then(response => response.text())
  .then(data => {
    const rows = data.split('\n').slice(1); // Ignorer header-rækken
    const labels = [];
    const values = [];

    rows.forEach(row => {
      const [label, value] = row.split(','); // Antager, at dataene er adskilt af kommaer
      labels.push(label);
      values.push(parseFloat(value)); // Konverter til numerisk værdi
    });

    // Opret kurvediagram
    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
      type: 'line', // Ændret til kurvediagram
      data: {
        labels: labels,
        datasets: [{
          label: 'Plastic Pollution',
          data: values,
          borderColor: 'blue',
          backgroundColor: 'rgba(0, 0, 255, 0.1)', // Tilføj baggrundsfarve for kurven
          borderWidth: 2, // Tykkere linje
          fill: true, // Udfyld området under kurven
          tension: 0.4 // Gør kurven glattere
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              font: {
                size: 14, // Skaler skriftstørrelsen op
                family: 'Arial', // Brug en tydelig skrifttype
                weight: 'bold', // Gør teksten fed
              },
              color: 'black' // Skriftfarve
            },
            title: {
              display: true,
              text: 'Total Waste',
              font: {
                size: 16, // Skaler skriftstørrelsen op for titlen
                family: 'Arial', // Brug en tydelig skrifttype
                weight: 'bold', // Gør titlen fed
              },
              color: 'black' // Titel farve
            }
          },
          x: {
            ticks: {
              font: {
                size: 14, // Skaler skriftstørrelsen op
                family: 'Arial', // Brug en tydelig skrifttype
                weight: 'bold', // Gør teksten fed
              },
              color: 'black' // Skriftfarve
            }
          }
        },
        plugins: {
          legend: {
            display: false // Skjul standard-legenden
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': ' + context.parsed.y; // Vis etiketten med værdien
              }
            },
            titleFont: {
              size: 14, // Skaler skriftstørrelsen op for værktøjslinjetitlen
              family: 'Arial', // Brug en tydelig skrifttype
              weight: 'bold', // Gør værktøjslinjetitlen fed
            },
            bodyFont: {
              size: 14, // Skaler skriftstørrelsen op for værktøjslinjeteksten
              family: 'Arial', // Brug en tydelig skrifttype
              weight: 'bold', // Gør værktøjslinjeteksten fed
            }
          }
        }
      }
    });
  })
  .catch(error => console.error('Error fetching data:', error));

// PostgreSQL og CSV håndtering kode
const { Pool } = require("pg");
require("dotenv").config();
const csvtojson = require("csvtojson");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Route for /Data
const getData = (request, response) => {
  pool.query(
    "SELECT * FROM Data_tmp", // Tilføj dine kolonner her
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

// Route for /insert-food
const insertData = (request, response) => {
  const { Country, Mwi, Mwi_level, Total_waste, Skip_1, Skip_2, Skip_3, Skip_4, Skip_5, Skip_6 } = request.body;
  pool.query(
    `INSERT INTO Data_tmp (Country, Mwi , Mwi_level, Total_waste, Skip_1, Skip_2, Skip_3, Skip_4, Skip_5, Skip_6 ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [Country, Mwi, Mwi_level, Total_waste, Skip_1, Skip_2, Skip_3, Skip_4, Skip_5, Skip_6],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send('Data added');
    }
  );
};

// Route for /populateFoods
const populateData = (request, response) => {
  const plastdata = "share-plastic-waste-recycled.csv"; // Opdateret CSV-filnavn
  const options = {
    delimiter: ';'
  };

  csvtojson().fromFile(plastdata, options).then(source => {
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

      let insertStatement = `INSERT INTO Data_tmp (Country, Mwi, Mwi_level, Total_waste, Skip_1, Skip_2, Skip_3, Skip_4, Skip_5, Skip_6) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`; 
      let items = [Country, Mwi, Mwi_level, Total_waste, Skip_1, Skip_2, Skip_3, Skip_4, Skip_5, Skip_6];

      pool.query(insertStatement, items, (err, results, fields) => {
        if (err) {
          console.log("Unable to insert item at row " + (i + 1));
          return console.log(err);
        }
      });
    }
    response.status(201).send('All Data added');
  });
}

module.exports = {
  getData, 
  insertData,
  populateData,
};
