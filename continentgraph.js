(function() {
  // Set the dimensions and margins of the graph
  const margin = { top: 20, right: 250, bottom: 100, left: 50 },
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  
  // Append the svg object to the body of the page
  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  
  // Parse the Year / time
  const parseTime = d3.timeParse("%Y");
  
  // Load the CSV file
  Papa.parse("share-plastic-waste-recycled.csv", {
    download: true,
    header: true,
    complete: function (results) {
      const data = results.data;
      data.forEach((d) => {
        d.Year = parseTime(d.Year);
        d.Value = +d.Value;
      });
  
      // Extract unique countries for the color scale
      const countries = Array.from(new Set(data.map((d) => d.Country)));
  
      // Set the ranges
      const x = d3.scaleTime().range([0, width]);
      const y = d3.scaleLinear().range([height, 0]);
  
      // Scale the range of the data
      x.domain(d3.extent(data, (d) => d.Year));
      y.domain([0, d3.max(data, (d) => d.Value)]);
  
      // Define the line
      const line = d3
        .line()
        .x((d) => x(d.Year))
        .y((d) => y(d.Value))
        .curve(d3.curveMonotoneX); // Add smooth curve
  
      // Set up color scale with a better palette
      const color = d3.scaleOrdinal(d3.schemeCategory10).domain(countries);
  
      // Group data by country
      const dataByCountry = d3
        .nest()
        .key((d) => d.Country)
        .entries(data);
  
      // Add the lines for each country with initial opacity 0
      const lines = svg.selectAll(".line")
        .data(dataByCountry)
        .enter()
        .append("path")
        .attr("class", "line")
        .style("fill", "none")
        .style("stroke", (d) => color(d.key))
        .style("stroke-width", "5.5px")
        .style("opacity", 0) // Initial opacity to 0
        .attr("d", (d) => line(d.values));
  
      // Add scroll-based animation
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // If element is in view, trigger the animation
            lines.transition()
              .duration(1500) // Duration of the transition
              .delay((d, i) => i * 500) // Delay for each line
              .style("opacity", 0.7) // Final opacity after transition
              .on("end", () => { // Add hover interactions after animation ends
                lines
                  .on("mouseover", function(event, d) {
                    d3.selectAll(".line").style("opacity", 0.1);
                    d3.select(this).style("opacity", 1).style("stroke-width", "7.5px");
                  })
                  .on("mouseout", function(event, d) {
                    d3.selectAll(".line").style("opacity", 0.7).style("stroke-width", "5.5px");
                  });
              });
          }
        });
      });
  
      // Observe the chart element
      observer.observe(document.querySelector("#chart"));
  
      // Add X Axis
      svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(10).tickFormat(d3.timeFormat("%Y")))
        .selectAll("text")
        .style("fill", "white"); // Set text color to white
  
      // Add Y Axis
      svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y).ticks(10).tickFormat((d) => `${d}%`))
        .selectAll("text")
        .style("fill", "white"); // Set text color to white
  
      // Add X Axis label
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + 35)
        .style("fill", "white")
        .attr("text-anchor", "middle")
        .attr("font-size", "17px")
        .attr("font-weight", "bold")
        .text("Year");
  
      // Add Y Axis label
      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -35)
        .attr("x", -height / 2)
        .style("fill", "white")
        .attr("text-anchor", "middle")
        .attr("font-size", "17px")
        .attr("font-weight", "bold")
        .text("Percentage of plastic recycled");
  
      // Add legend
      const legend = svg
        .selectAll(".legend")
        .data(countries)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(${width + 20},${i * 20})`);
  
      legend
        .append("rect")
        .attr("x", 0)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);
  
      legend
        .append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("font-size", "17px")
        .attr("class", "legend-text") // Add a class here
        .text((d) => d);
  
      svg.selectAll(".legend-text").style("fill", "white");
    },
  });
})();
