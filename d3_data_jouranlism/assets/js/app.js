// @TODO: YOUR CODE HERE!
// Set SVG area
var svgHeight = 500;
var svgWidth = 800;

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
      });

    // Set Axis Ranges
    var xScale = d3.scaleLinear()
                .domain([6 , d3.max(data, d => d.poverty)])
                .range([0, width]);

    var yScale = d3.scaleLinear()
                .domain([2, d3.max(data, d => d.healthcare)])
                .range([height, 0]);

    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    // Append X-Axis
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis)
    // Apend Y-Axis
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
        .attr("class","stateCircle")
        .attr("opacity", ".8");

    // Add text
    var textGroup = chartGroup.selectAll()
    .data(data)
    .enter()
    .append("text")
    .attr("y", d => yScale(d.healthcare))
    .attr("x", d => xScale(d.poverty))
    .text(d => d.abbr)
    .attr('font-size',8)
    .attr("class","stateText");

    //textGroup.exit().remove()

    // Add Y Axis Title
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height/2) - 10)
    .attr("dy", "1em")
    .attr("class", "aText")
    .text("Lacks Healthcare (%)");

    // Add X Axis Title
     chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.bottom-10})`)
    .attr("class", "aText")
    .text("In Poverty (%)");

    // Add Chart Title
    chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${-25})`)
    .attr("class", "aText")
    .text("Poverty vs. Healthcare");



}).catch(error => console.log(error))
