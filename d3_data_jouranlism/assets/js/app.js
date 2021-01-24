// @TODO: YOUR CODE HERE!
var svgHeight = window.innerHeight;
var svgWidth = window.innerWidth;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("body")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);

var chartGroup = svg.append("g")
                    .attr("transform", `translate(${margin.left}, ${margin.top})`);


d3.csv("assets/data/data.csv").then(function(data){

    data.forEach(function(entry) {
        entry.healthcare = +entry.healthcare;
        entry.poverty = +entry.poverty;
      });

    console.log(data);

    // Set Axis Ranges
    var xScale = d3.scaleTime()
                .domain([0, d3.max(data, d => d.poverty)])
                .range([0, width]);

    var yScale = d3.scaleLinear()
                .domain([0, d3.max(data, d=> d.healthcare)])
                .range([svgHeight, 0]);

    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);


    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis)

    chartGroup.append("g")
        .call(leftAxis);  

    var line = d3.line()
                .x(d => xScale(d.poverty))
                .y(d => yScale(d.healthcare));

    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("r", "15")
        .attr("fill", "blue")
        .attr("opacity", ".5");


}).catch(error => console.log(error))
