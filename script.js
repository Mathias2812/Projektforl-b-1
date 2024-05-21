// set the dimensions and margins of the graph
var margin = {top: 30, right: 100, bottom: 60, left: 60},
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

    // Add dots
    line.selectAll("dot")
      .data(function(d) {
        return data.filter(function(datum) {
          return datum.entity === d;
        });
      })
      .enter()
      .append("circle")
      .attr("fill", function(d) { return myColor(d.entity); })
      .attr("cx", function(d) { return x(d.year) + x.bandwidth() / 2; })
      .attr("cy", function(d) { return y(d['share of waste recycled']); })
      .attr("r", 5)
      .on("mouseover", function(event, d) {
        d3.select(this)
          .transition()
          .duration(100)
          .attr("r", 8);
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html("Entity: " + d.entity + "<br/>Year: " + d.year + "<br/>Share of Waste Recycled: " + d['share of waste recycled'] + "%")
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
        d3.select(this)
          .transition()
          .duration(100)
          .attr("r", 5);
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });

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

    // Add tooltip
    var tooltip = d3.select("body")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px");

});
