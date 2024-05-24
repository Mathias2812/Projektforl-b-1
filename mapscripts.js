console.log("Script loaded");

const apiUrl = 'http://localhost:4000/Data';
let worldData = [];

// Fetch data from the API
fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        worldData = data;
        console.log('World Data:', worldData);

        // Load external GeoJSON data and draw the map
        loadGeoJsonAndDrawMap();
    })
    .catch(error => {
        console.error('Error:', error);
    });

// We load in our data and our world map here
function loadGeoJsonAndDrawMap() {
    d3.queue()
        .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
        .await(function(error, geoJsonData) {
            if (error) throw error;
            drawMap(geoJsonData, worldData);
        });
}

function drawMap(geoJsonData, worldData) {
    let svgWidth = 1200;
    let svgHeight = 600;
    let svg = d3.select("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    let projection = d3.geoMercator()
        .scale(120)
        .center([0, 20])
        .translate([svgWidth / 2, svgHeight / 2]);

    let colorScale = d3.scaleLinear()
        .domain(d3.extent(worldData, d => d.mwi_value))
        .range(["#ffcccc", "#ff0000"]);

    let dataMap = new Map(worldData.map(d => [d.country_code, d]));

    // Select tooltip element
    let tooltip = d3.select(".tooltip");

    svg.append("g")
        .selectAll("path")
        .data(geoJsonData.features)
        .enter()
        .append("path")
        .attr("d", d3.geoPath().projection(projection))
        .attr("fill", d => {
            let countryData = dataMap.get(d.id);
            return countryData ? colorScale(countryData.mwi_value) : "#ccc";
        })
        .style("stroke", "black")
        .attr("class", "Country")
        .style("opacity", .8)
        .on("mouseover", function(event, d) {
            console.log("Mouseover event triggered", d); // Debugging line
            console.log(geoJsonData.features)
            let countryData = dataMap.get(d);
            /* if (countryData) */ /* { */
                console.log(countryData, "countryData"); // Debugging line
                // Update tooltip content and position
                tooltip.html(`Country: ${countryData.country_name}<br>MWI Value: ${countryData.mwi_value}<br>Total Waste: ${countryData.total_waste}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px")
                    .transition()
                    .duration(200)
                    .style("opacity", .9); // Show tooltip
            }
       /*  } */)
        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 10) + "px")
                   .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseleave", function() {
         /*    console.log("Mouseleave event triggered"); */ // Debugging line
            d3.select(this).style("opacity", .8);
            // Hide tooltip on mouse leave
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
}
