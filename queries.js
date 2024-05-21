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

// Extract unique countries and years for the dropdowns
const countries = Array.from(new Set(data.map(d => d.Country)));
const years = Array.from(new Set(data.map(d => d.Year.getFullYear())));

// Populate the country dropdown
const countrySelect = d3.select("#countrySelect");
countrySelect.selectAll("option")
.data(countries)
.enter()
.append("option")
.text(d => d);

// Populate the year dropdown
const yearSelect = d3.select("#yearSelect");
yearSelect.selectAll("option")
.data(years)
.enter()
.append("option")
.text(d => d);

// Function to update the chart
function updateChart(country) {
// Filter data for the selected country
const filteredData = data.filter(d => d.Country === country);

// Check if filtered data is empty
if (filteredData.length === 0) {
console.log("No data for the selected country");
return;
}

// Set the ranges
const x = d3.scaleTime().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);

// Define the area
const area = d3.area()
.x(d => x(d.Year))
.y0(height)
.y1(d => y(d.Value));

// Scale the range of the data
x.domain(d3.extent(filteredData, d => d.Year));
y.domain([0, d3.max(filteredData, d => d.Value)]);

// Remove any existing path
svg.selectAll(".area").remove();

// Add the area path
svg.append("path")
.data([filteredData])
.attr("class", "area")
.attr("d", area)
.style("fill", "steelblue");

// Add the X Axis
svg.selectAll(".x-axis").remove();
svg.append("g")
.attr("class", "x-axis")
.attr("transform", `translate(0,${height})`)
.call(d3.axisBottom(x));

// Add the Y Axis
svg.selectAll(".y-axis").remove();
svg.append("g")
.attr("class", "y-axis")
.call(d3.axisLeft(y));
}

// Event listener for country dropdown
countrySelect.on("change", () => {
const selectedCountry = countrySelect.node().value;
updateChart(selectedCountry);
});

// Initial chart update
updateChart(countries[0]);
});
