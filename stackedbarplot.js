(function() {
// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 20, left: 50},
      width = 650 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
let svg = d3.select("#barplot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("share-plastic-fate.csv", function(data) {

  // List of subgroups = header of the csv files = soil condition here
  let subgroups = data.columns.slice(2);
  console.log(subgroups)

  // List of groups = different ways of managing plastic waste
  let groups = data.map(d => d.Entity);
  console.log(groups)

  // Add X axis
  let x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0));

  // Add Y axis
  let y = d3.scaleLinear()
    .domain([0, 120])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // color palette = one color per subgroup
  let color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(d3.schemeSet2);

  // Stack the data per subgroup
  let stackedData = d3.stack()
    .keys(subgroups)
    (data)




    
    // Create color legend
let legend = d3.select("#barLegend")
.append("svg")
.attr("class", "legend")
.attr("transform", "translate(" + (width - 150) + "," + (margin.top + 10) + ")");

// Generate legend entries
let legendEntries = legend.selectAll(".legend-entry")
.data(subgroups)
.enter().append("g")
.attr("class", "legend-entry")
.attr("transform", function(d, i) { return "translate(0," + (i * 20) + ")"; });

// Add colored boxes to legend
legendEntries.append("rect")
.attr("x", 0)
.attr("y", 0)
.attr("width", 10)
.attr("height", 10)
.attr("fill", function(d) { return color(d); });

// Add subgroup labels to legend
legendEntries.append("text")
.attr("x", 15)
.attr("y", 8)
.style("font-size", "12px")
.text(function(d) { return d; });



// Hover function for each subgroup!


// What happens when user hovers over a bar
let mouseover = function(d) {
    // Extract the subgroup name
    let subgroupName = d3.select(this.parentNode).datum().key;
    
    // Reduce opacity of all bars except the ones in the same subgroup
    d3.selectAll(".myRect")
        .filter(function(e) { return e.key !== subgroupName; })
        .style("opacity", 0.2);
    
    // Highlight the bars of the same subgroup with full opacity
    d3.selectAll("." + subgroupName)
        .style("opacity", 1);
    
    // Show tooltip with relevant information
    /*
    tooltip.transition()
        .duration(200)
        .style("opacity", .9);
    tooltip.html("Entity: " + d.data.Entity + "<br/>" + "Value: " + d.data[subgroupName])
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
        */
}

// When user stops hovering over a bar
let mouseleave = function(d) {
    // Reset opacity of all bars
    d3.selectAll(".myRect").style("opacity", 0.8);
    
    // Hide tooltip
    /*
    tooltip.transition()
        .duration(500)
        .style("opacity", 0);
        */
}

// Show the bars

svg.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter().append("g")
    .attr("fill", function(d) { return color(d.key); })
    .attr("class", function(d){ return "myRect " + d.key }) // Add a class to each subgroup: their name
    .selectAll("rect")
    // enter a second time = loop subgroup per subgroup to add all rectangles
    .data(function(d) { return d; })
    .enter().append("rect")
    .attr("x", function(d) { return x(d.data.Entity); })
    .attr("y", function(d) { return y(d[1]); })
    .attr("height", function(d) { return y(d[0]) - y(d[1]); })
    .attr("width",x.bandwidth())
    .attr("stroke", "grey")
    .on("mouseover", mouseover)
    .on("mouseleave", mouseleave);

})
})();

