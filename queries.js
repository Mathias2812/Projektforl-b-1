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
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Share of Plastic Waste Recycled',
          data: values,
          borderColor: 'blue',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  })
  .catch(error => console.error('Error fetching data:', error));
