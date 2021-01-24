// @TODO: YOUR CODE HERE!
// Set SVG area
var svgHeight = 500;
var svgWidth = 600;

// Set margin
var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};

// Set chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);

var chartGroup = svg.append("g")
                    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load Data (Poverty vs Healthcare)                    
d3.csv("assets/data/data.csv").then(function(data){

    data.forEach(function(entry) {
        entry.healthcare = +entry.healthcare;
        entry.poverty = +entry.poverty;
        console.log(entry.healthcare);
      });

    // Set Axis Ranges
    var xScale = d3.scaleLinear()
                .domain([d3.min(data, d => d.poverty)-5 , d3.max(data, d => d.poverty)])
                .range([0, width]);

    var yScale = d3.scaleLinear()
                .domain([-2, d3.max(data, d => d.healthcare)])
                .range([svgHeight, 0]);

    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    // Append X-Axis
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis)
    chartGroup.append("g")
        .call(leftAxis);  

    // Create circle/scatterplots
    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("r", "12")
        .attr("fill", "blue")
        .attr("opacity", ".5");

    // Add Y Axis Title
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height/2) - 10)
    .attr("dy", "1em")
    .attr("class", "aText")
    .text("Lacks Healthcare (%)");

    // Add Y Axis Title
     chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.bottom-10})`)
    .attr("class", "aText")
    .text("In Poverty (%)");

    // Add Chart Title
    chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${-10})`)
    .attr("class", "aText")
    .text("Poverty vs. Healthcare");



}).catch(error => console.log(error))
