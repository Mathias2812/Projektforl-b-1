// Set the dimensions and margins of the graph
const margin = {top: 20, right: 180, bottom: 30, left: 50},
width = 800 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

// Append the svg object to the body of the page
const svg = d3.select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Parse the Year / time
const parseTime = d3.timeParse("%Y");

// Load the CSV file
d3.csv("share-plastic-waste-recycled.csv").then(data => {
  data.forEach(d => {
    d.Year = parseTime(d.Year);
    d.Value = +d.Value;
  });

  // Extract unique countries for the color scale
  const countries = Array.from(new Set(data.map(d => d.Country)));

  // Set the ranges
  const x = d3.scaleTime().range([0, width]);
  const y = d3.scaleLinear().range([height, 0]);

  // Scale the range of the data
  x.domain(d3.extent(data, d => d.Year));
  y.domain([0, d3.max(data, d => d.Value)]);

  // Define the line
  const line = d3.line()
    .x(d => x(d.Year))
    .y(d => y(d.Value));

  // Set up color scale
  const color = d3.scaleOrdinal(d3.schemeCategory10)
    .domain(countries);

  // Group data by country
  const dataByCountry = d3.groups(data, d => d.Country);

  // Add the lines for each country
  svg.selectAll(".line")
    .data(dataByCountry)
    .enter()
    .append("path")
    .attr("class", "line")
    .attr("d", d => line(d[1]))
    .style("fill", "none")
    .style("stroke", d => color(d[0]))
    .style("stroke-width", "2px");

  // Add the X Axis
  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(y));

  // Add legend
  const legend = svg.selectAll(".legend")
    .data(countries)
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => `translate(${width + 20},${i * 20})`);

  legend.append("rect")
    .attr("x", 0)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

  legend.append("text")
    .attr("x", 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .text(d => d);
});
