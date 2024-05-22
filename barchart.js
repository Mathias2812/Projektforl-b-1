// create the datasets
let mwiOutliers = [];
let wasteOutliers = [];


// Specify the API endpoint for Data
const apiUrls = [
    'http://localhost:4000/data/mwiOutliers', 'http://localhost:4000/data/wasteOutliers'];




Promise.all(apiUrls.map(url => fetch(url).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })))
    .then(dataArray => {
        // Store the fetched data in respective variables
        mwiOutliers = dataArray[0];
        wasteOutliers = dataArray[1];

        // Log the fetched data to the console
        console.log('mwiOutliers:', mwiOutliers);
        console.log('wasteOutliers:', wasteOutliers)
    })
    .catch(error => {
        console.error('Error:', error);
    });




 // set the dimensions and margins of the graph
 let margin = {top: 30, right: 30, bottom: 70, left: 60},
     width = 460 - margin.left - margin.right,
     height = 400 - margin.top - margin.bottom;
 
 // append the svg object to the body of the page
 let svg = d3.select("#top5")
   .append("svg")
     .attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)
   .append("g")
     .attr("transform",
           "translate(" + margin.left + "," + margin.top + ")");
 
 // X axis
 let x = d3.scaleBand()
   .range([ 0, width ])
   .domain(mwiOutliers.map(function(d) { return d.group; }))
   .padding(0.2);
 svg.append("g")
   .attr("transform", "translate(0," + height + ")")
   .call(d3.axisBottom(x))
 
 // Add Y axis
 let y = d3.scaleLinear()
   .domain([0, 20])
   .range([ height, 0]);
 svg.append("g")
   .attr("class", "myYaxis")
   .call(d3.axisLeft(y));
 
 // A function that create / update the plot for a given variable:
 function update(data) {
 
   let u = svg.selectAll("rect")
     .data(data)
 
   u
     .enter()
     .append("rect")
     .merge(u)
     .transition()
     .duration(1000)
       .attr("x", function(d) { return x(d.group); })
       .attr("y", function(d) { return y(d.value); })
       .attr("width", x.bandwidth())
       .attr("height", function(d) { return height - y(d.value); })
       .attr("fill", "#69b3a2")
 }
 
 // Initialize the plot with the first dataset
 update(mwiOutliers)