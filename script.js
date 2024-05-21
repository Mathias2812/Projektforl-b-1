// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Read the data
d3.csv("share-plastic-waste-recycled.csv", function(data) {

    // List of entities
    var entities = [...new Set(data.map(function(d) { return d.entity; }))];

    // List of years
    var years = data.map(function(d) { return d.year; });

    // List of groups (here I have one group per entity)
    var allGroup = entities;

    // A color scale: one color for each entity
    var myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet2);

    // Add X axis
    var x = d3.scaleBand()
      .domain(years)
      .range([0, width])
      .padding(0.2);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d['share of waste recycled']; })])
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add lines
    var line = svg.selectAll(".line")
      .data(allGroup)
      .enter()
      .append("g")
      .attr("class", "line");

    line.append("path")
      .datum(function(d) {
        return data.filter(function(datum) {
          return datum.entity === d;
        });
      })
      .attr("fill", "none")
      .attr("stroke", function(d) { return myColor(d); })
      .attr("stroke-width", 2.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.year) + x.bandwidth() / 2; })
        .y(function(d) { return y(d['share of waste recycled']); })
      );

    // Add legend
    var legend = svg.selectAll(".legend")
      .data(entities)
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", myColor);

    legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

});
