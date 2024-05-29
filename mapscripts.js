(function() {

    
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

// Drawing the map
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

//Colorscale on the worldmap

        let colorScale = d3.scaleLinear()
        .domain(d3.extent(worldData, d => d.mwi_value))
        .range(["#81d4fa", "#01579b"]); 
    

    let dataMap = new Map(worldData.map(d => [d.country_code, d]));

//Making the Colorscale use our mwi_value to color the map.

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
        .on("mouseleave", function() {
        });
}
 })();
