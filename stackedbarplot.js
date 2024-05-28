(function() {
  // set the dimensions and margins of the graph
  const margin = {top: 10, right: 30, bottom: 60, left: 50}, // Adjusted bottom margin for space for the legend
        width = 660 - margin.left - margin.right,
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
    let subgroups = data.columns.slice(1);
    console.log(subgroups);

    // List of groups = different ways of managing plastic waste
    let groups = d3.map(data, function(d){return(d.Entity)}).keys();
    console.log(groups);

    // Add X axis
    let x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.3]);

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .selectAll("text")
      .style("text-overflow", "ellipsis")
      .style("overflow", "hidden")
      .style("white-space", "nowrap")
      .style("fill","white")
      .text(function(d) {
          return d.length > 10 ? d.substring(0, 10) + "..." : d;
        });

    // Add Y axis
    let y = d3.scaleLinear()
      .domain([0, 100])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("fill","white");

    // color palette = one color per subgroup
    let color = d3.scaleOrdinal()
      .domain(subgroups)
      .range(d3.schemeSet2);

    // Stack the data per subgroup
    let stackedData = d3.stack()
      .keys(subgroups)
      (data);
    console.log(stackedData);

    // Hover function for each subgroup
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

    }

    let mouseleave = function(d) {
        // Reset opacity of all bars
        d3.selectAll(".myRect").style("opacity", 0.8);
        
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

    // Add the legend
    let legend = svg.append("g")
      .attr("transform", "translate(0," + (height + 45) + ")"); // Adjusted position to move the legend further down

    legend.selectAll("rect")
      .data(subgroups)
      .enter()
      .append("rect")
        .attr("x", function(d, i) { return i * 100; }) // Increased the spacing between legend items
        .attr("y", 0)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", function(d) { return color(d); });

    legend.selectAll("text")
      .data(subgroups)
      .enter()
      .append("text")
        .attr("x", function(d, i) { return i * 100 + 15; }) // Increased the spacing between legend items
        .attr("y", 10)
        .attr("fill", "white")
        .text(function(d) { return d; });
  });
})();

