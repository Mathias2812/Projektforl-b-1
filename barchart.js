// create the datasets
let mwiOutliers = [];
let wasteOutliers = [];


// Specify the API endpoint for Data
const apiUrls = [
    'http://localhost:4000/data/mwiOutliers', 'http://localhost:4000/data/wasteOutliers'];




Promise.all(apiUrls.map(url => fetch(url).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })))
    .then(dataArray => {
        // Store the fetched data in respective variables
        mwiOutliers = dataArray[0];
        wasteOutliers = dataArray[1];

        // Log the fetched data to the console
        console.log('mwiOutliers:', mwiOutliers);
        console.log('wasteOutliers:', wasteOutliers)
    })
    .catch(error => {
        console.error('Error:', error);
    });




// set the dimensions and margins of the graph
let margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 560 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
let svg = d3.select("#top5")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// X axis
let x = d3.scaleBand()
  .range([ 0, width ])
  .padding(0.2);

// Add Y axis
let y = d3.scaleLinear()
  .range([ height, 0]);

// A function that create / update the plot for a given variable:
function update(data) {
  // Update the domain of the x scale
  x.domain(data.map(function(d) { return d.country_name; }));

  // Update the domain of the y scale based on the maximum value in the dataset
  y.domain([0, d3.max(data, function(d) { return d.mwi_value; })]);

  // Draw the X axis
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
    attr("fill", "white");

  // Draw the Y axis
  svg.append("g")
    .attr("class", "myYaxis")
    .call(d3.axisLeft(y));
    attr("fill", "white");

  // Select all bars and bind data
  let bars = svg.selectAll("rect")
    .data(data);

  // Enter new bars
  bars.enter()
    .append("rect")
    .attr("x", function(d) { return x(d.country_name); })
    .attr("width", x.bandwidth())
    .merge(bars)
    .transition()
    .duration(1000)
      .attr("y", function(d) { return y(d.mwi_value); })
      .attr("height", function(d) { return height - y(d.mwi_value); })
      .attr("fill", "#33AFFF");
}


// Function to update the bar chart
function update(data) {
  // Update the domain of the x scale
  x.domain(data.map(function(d) { return d.country_name; }));

  // Update the domain of the y scale based on the maximum value in the dataset
  y.domain([0, d3.max(data, function(d) { return d.total_waste || d.mwi_value; })]);

 // Redraw the X axis
svg.select(".myXaxis")
.call(d3.axisBottom(x))
.selectAll("text")
.attr("transform", "translate(-10,0)rotate(-45)")
.attr("fill", "white")
.style("text-anchor", "end");

// Redraw the Y axis
svg.select(".myYaxis")
.call(d3.axisLeft(y))
.selectAll("text")
.attr("fill", "white");

  // Remove the existing bars and labels
  svg.selectAll("rect").remove();
  svg.selectAll(".bar-label").remove();

  // Draw the bars
  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function(d) { return x(d.country_name); })
    .attr("width", x.bandwidth())
    .attr("y", function(d) { return y(d.total_waste || d.mwi_value); })
    .attr("height", function(d) { return height - y(d.total_waste || d.mwi_value); })
    .attr("fill", "#33AFFF");

  // Add labels with data value
  svg.selectAll("rect")
    .each(function(d) {
      svg.append("text")
        .attr("class", "bar-label")
        .attr("x", x(d.country_name) + x.bandwidth() / 2)
        .attr("y", y(d.total_waste || d.mwi_value) - 5) // Adjust the y position for better positioning
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .text(d.total_waste || d.mwi_value);
    });
}

// Initialize the X axis
svg.append("g")
  .attr("class", "myXaxis")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
  .attr("transform", "translate(-10,0)rotate(-45)")
  .attr("fill", "white")
  .style("text-anchor", "end");

// Initialize the Y axis
svg.append("g")
  .attr("class", "myYaxis")
  .call(d3.axisLeft(y));

// Event listener for the button click
document.getElementById("updateButton").addEventListener("click", function() {
  // Call the update function with the wasteOutliers data
  update(wasteOutliers);
});