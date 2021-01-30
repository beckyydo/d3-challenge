// @TODO: YOUR CODE HERE!
// Set SVG area
var svgHeight = 500;
var svgWidth = 800;

// Set margin
var margin = {
    top: 50,
    right: 50,
    bottom: 90,
    left: 90
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

function yScale(data, chosenYAxis) {

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenYAxis]) * 0.5,
      d3.max(data, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);

    return yLinearScale;
}
 
// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis,) {
    var bottomAxis = d3.axisBottom(newXScale);
      
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
    
    return xAxis;
}

function renderYAxes(newYScale, yAxis){

  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {
    
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
  
    return circlesGroup;
}

function renderCirclesY(circlesGroup, newYScale, chosenYAxis){
  
  circlesGroup.transition()
  .duration(1000)
  .attr("cy", d => newYScale( d[chosenYAxis]))

  return circlesGroup;
}

function renderText(textGroup, newXScale, chosenXAxis){
    textGroup.transition()
        .duration(1000)
        .attr("x", d=> newXScale(d[chosenXAxis]))
    return textGroup;
}
function renderTextY(textGroup, newYScale, chosenYAxis){
  textGroup.transition()
      .duration(1000)
      .attr("y", d=> newYScale(d[chosenYAxis]))
  return textGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}, ${d.abbr}<br>${chosenYAxis}: ${d[chosenYAxis]}%<br>${chosenXAxis}: ${d[chosenXAxis]}%`);
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
        entry.smoke = +entry.smoke;
      });

    // Set Axis Ranges
    var xLinearScale = xScale(data, chosenXAxis);

    var yLinearScale = yScale(data, chosenYAxis);
    
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append X-Axis
    var xAxis = chartGroup.append("g")
                        .attr("transform", `translate(0, ${height})`)
                        .call(bottomAxis);

    // Apend Y-Axis
    var yAxis = chartGroup.append("g")
                      .attr("transform", `translate(0, 0)`)
                      .call(leftAxis);  

    // Create circle/scatterplots
    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", "13")
        .attr("class","stateCircle")
        .attr("opacity", ".8");

    // Add state text
    var textGroup = chartGroup.selectAll()
    .data(data)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
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
    var ylabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(0, ${height / 2} ) rotate(-90)`)
    
    var healthLabel = ylabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", -25)
    .attr("value", "healthcare") // value to grab for event listener
    .classed("active", true)
    .text("Lack Healthcare (%)");

    var smokeLabel = ylabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", -45)
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes (%)");


    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // x axis labels event listener
    labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {
        // replaces chosenXAxis with value
        chosenXAxis = value;
    
        // updates x scale for new data
        xLinearScale = xScale(data, chosenXAxis);
        
        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

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

    // x axis labels event listener
    ylabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value2 = d3.select(this).attr("value");
      if (value2 !== chosenYAxis) {
        // replaces chosenXAxis with value
        chosenYAxis = value2;
        
        // updates y scale for new data
        yLinearScale = yScale(data, chosenYAxis);

        // updates y axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new y values
        circlesGroup = renderCirclesY(circlesGroup, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // updates text with new x values
        textGroup = renderTextY(textGroup, yLinearScale, chosenYAxis);

        // changes classes to change bold text
        if (chosenYAxis === "smokes") {
          smokeLabel
          .classed("active", true)
          .classed("inactive", false);
          healthLabel
          .classed("active", false)
          .classed("inactive", true);
        }
        else {
          smokeLabel
          .classed("active", false)
          .classed("inactive", true);
          healthLabel
          .classed("active", true)
          .classed("inactive", false);      
        }
      }
    });
  }).catch(function(error) {console.log(error);});
