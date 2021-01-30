// @TODO: YOUR CODE HERE!
// Set SVG area
var svgHeight = 500;
var svgWidth = 800;

// Set margin
var margin = {
    top: 50,
    right: 50,
    bottom: 90,
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

// Set X-axis Parameters
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// Function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
        d3.max(data, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
}
 
// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
}

function renderText(textGroup, newXScale, chosenXAxis){

    textGroup.transition()
        .duration(1000)
        .attr("x", d=> newXScale(d[chosenXAxis]))
    return textGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

    var label;
    if (chosenXAxis === "poverty") {
      label = "In Poverty (%):";
    }
    else {
      label = "Age (Median):";
    }

    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}, ${d.abbr}<br>healthcare: ${d.healthcare}%<br>${chosenXAxis}: ${d[chosenXAxis]}%`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data1) {
      toolTip.show(data1);
    })
      // onmouseout event
      .on("mouseout", function(data1, index) {
        toolTip.hide(data1);
      });

    return circlesGroup;
}

// Load Data (Poverty vs Healthcare)                    
d3.csv("assets/data/data.csv").then(function(data,err){
    if (err) throw err;

    data.forEach(function(entry) {
        entry.healthcare = +entry.healthcare;
        entry.poverty = +entry.poverty;
        entry.age = +entry.age;
        entry.income = +entry.income;
      });

    // Set Axis Ranges
    var xLinearScale = xScale(data, chosenXAxis);

    var yLinearScale = d3.scaleLinear()
                        .domain([0, d3.max(data, d => d.healthcare)])
                        .range([height, 0]);
    
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append X-Axis
    var xAxis = chartGroup.append("g")
                        .attr("transform", `translate(0, ${height})`)
                        .call(bottomAxis);

    // Apend Y-Axis
    chartGroup.append("g")
        .call(leftAxis);  

    // Create circle/scatterplots
    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "12")
        .attr("class","stateCircle")
        .attr("opacity", ".8");

    // Add state text
    var textGroup = chartGroup.selectAll()
    .data(data)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d.healthcare))
    .text(d => d.abbr)
    .attr('font-size',8)
    .attr("class","stateText");

    // Create group for two x-axis labels
    var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

    var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

    var incomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("aText", true)
    .text("Lacks Healthcare (%)");

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    // x axis labels event listener
    labelsGroup.selectAll("text")
    .on("click", function() {
   // get value of selection
   var value = d3.select(this).attr("value");
   if (value !== chosenXAxis) {

     // replaces chosenXAxis with value
     chosenXAxis = value;

     // functions here found above csv import
     // updates x scale for new data
     xLinearScale = xScale(data, chosenXAxis);

     // updates x axis with transition
     xAxis = renderAxes(xLinearScale, xAxis);

     // updates circles with new x values
     circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

     // updates tooltips with new info
     circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

     // updates text with new x values
     textGroup = renderText(textGroup, xLinearScale, chosenXAxis);

     // changes classes to change bold text
     if (chosenXAxis === "age") {
        ageLabel
         .classed("active", true)
         .classed("inactive", false);
        povertyLabel
         .classed("active", false)
         .classed("inactive", true);
        incomeLabel
        .classed("active", false)
        .classed("inactive", true);
     }
     else if (chosenXAxis ==="income"){
        ageLabel
         .classed("active", false)
         .classed("inactive", true);
        povertyLabel
         .classed("active", false)
         .classed("inactive", true);
        incomeLabel
        .classed("active", true)
        .classed("inactive", false);         
     }
     else {
        ageLabel
         .classed("active", false)
         .classed("inactive", true);
        povertyLabel
         .classed("active", true)
         .classed("inactive", false);
         incomeLabel
         .classed("active", false)
         .classed("inactive", true);         
     }
   }
 });
}).catch(function(error) {
console.log(error);
});
