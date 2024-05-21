import * as d3 from 'd3';

// set the dimensions and margins of the graph
var margin = { top: 10, right: 100, bottom: 30, left: 30 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Læs data fra CSV-filen
d3.csv("share-plastic-waste-recycled.csv").then(function(data) {
  // Antag at kolonnerne hedder 'year' og 'share_waste_recycled'
  data.forEach(function(d) {
    d.year = +d.year;
    d.share_waste_recycled = +d.share_waste_recycled;
  });

  // add the options to the button (in this case, we only have one group)
  var allGroup = ["share_waste_recycled"];

  d3.select("#selectButton")
    .selectAll('myOptions')
    .data(allGroup)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button

  // A color scale: one color for each group
  var myColor = d3.scaleOrdinal()
    .domain(allGroup)
    .range(d3.schemeSet2);

  // Add X axis --> it is a date format
  var x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.year; }))
    .range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickFormat(d3.format("d")));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return d.share_waste_recycled; })])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Initialize line with the first group
  var line = svg
    .append('g')
    .append("path")
    .datum(data)
    .attr("d", d3.line()
      .x(function(d) { return x(d.year) })
      .y(function(d) { return y(d.share_waste_recycled) })
    )
    .attr("stroke", function (d) { return myColor("share_waste_recycled") })
    .style("stroke-width", 4)
    .style("fill", "none");

  // A function that updates the chart
  function update(selectedGroup) {
    // Create new data with the selection
    var dataFilter = data.map(function(d) { return { year: d.year, value: d[selectedGroup] }; });

    // Give these new data to update line
    line
      .datum(dataFilter)
      .transition()
      .duration(1000)
      .attr("d", d3.line()
        .x(function(d) { return x(d.year) })
        .y(function(d) { return y(d.value) })
      )
      .attr("stroke", function (d) { return myColor(selectedGroup) });
  }

  // When the button is changed, run the updateChart function
  d3.select("#selectButton").on("change", function(d) {
    // recover the option that has been chosen
    var selectedOption = d3.select(this).property("value");
    // run the updateChart function with this selected option
    update(selectedOption);
  });
});
