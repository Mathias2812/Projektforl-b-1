
// Ændr størrelsen på SVG-elementet
let svgWidth = 1400; // Ny bredde
let svgHeight = 600; // Ny højde
let svg = d3.select("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Opdater størrelsen på kortets projection
let projection = d3.geoMercator()
  .scale(120) // Juster skalaen efter behov
  .center([0, 20])
  .translate([svgWidth / 2, svgHeight / 2]);

// Data and color scale
let data = d3.map();
let colorScale = d3.scaleThreshold()
  .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
  .range(d3.schemeBlues[7]);

  // Define the function to remove Antarctica
function removeAntarctica(topo) {
    topo.features = topo.features.filter(feature => feature.properties.name !== "Antarctica");
    return topo;
  }

// Load external data and boot
d3.queue()
  .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
  .defer(d3.csv, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv", function(d) { data.set(d.code, +d.pop); })
  .await(ready);

function ready(error, topo) {

  let mouseOver = function(d) {
    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", .5)
      .style("stroke", "black")
    d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 1)

  }

  let mouseLeave = function(d) {
    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", .8)
    d3.select(this)
      .transition()
      .duration(200)
  
  }

  // Draw the map
  svg.append("g")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
      // draw each country
      .attr("d", d3.geoPath()
        .projection(projection)
      )
      // set the color of each country
      .attr("fill", function (d) {
        d.total = data.get(d.id) || 0;
        return colorScale(d.total);
      })
      .style("stroke", "black")
      .attr("class", function(d){ return "Country" } )
      .style("opacity", .8)
      .on("mouseover", mouseOver )
      .on("mouseleave", mouseLeave )
    }
