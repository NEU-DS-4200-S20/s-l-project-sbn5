// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
((() => {

var width = 960;
var height = 500;

var svg = d3
  .select("#map-container")
  .append("svg")
  .attr("viewBox", [0, 0, width, height])
  .attr("transform", "translate(-200,0) scale(10 10)")
  //.attr("width", width)
  //.attr("height", height);

var projection = d3
  .geoAlbersUsa()
  .translate([-600, height + 150])
  .scale(4*width);

var path = d3.geoPath().projection(projection);

d3.json("us.json", function(us) {
  d3.csv("data/cities-visited.csv", function(cities) {
    d3.csv("data/statesvisited.csv", function(statesVisited) {
      d3.tsv("data/us-state-names.tsv", function(stateNames) {
        //to select only northeast states in the usa 
        var selectedRegions = [9, 23, 25, 33, 34, 36, 42, 44, 50];  
        var mapData = topojson.feature(us, us.objects.states).features.filter((d) => 
        { 
          return selectedRegions.includes(d.id);
        }); 
        drawMap(mapData, cities, statesVisited);
      });
    });
  });
});

var brush = d3
  .brush()
  .on("start brush", highlight)
  .on("end", brushend);

/**
 * Function to draw the map on the page
 * @param {*} us 
 * @param {*} cities 
 * @param {*} statesVisited 
 */
function drawMap(mapData, cities, statesVisited) {
  var mapGroup = svg.append("g").attr("class", "mapGroup");

  let fillFunction = function(d) {
    let stateName = stateNames.filter(function (n) { return n.id == d.id })[0].name
    let statesVisitedNames = statesVisited.map(function (s) { return s.name } );
    let isVisited = statesVisitedNames.includes(stateName);

    if (isVisited) {
      return 'blue';
    } else {
      return 'gray';
    }
  }

  mapGroup
    .append("g")
    // .attr("id", "states")
    .selectAll("path")
    .data(mapData)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", "states");

  mapGroup
    .append("path")
    .datum(
      mapData, function(a, b) {
        return a !== b;
      })
    .attr("id", "state-borders")
    .attr("d", path);

  var circles = svg
    .selectAll("circle")
    .data(cities)
    .enter()
    .append("circle")
    .attr("class", "cities")
    .attr("cx", function(d) {
      return projection([d.lon, d.lat])[0];
    })
    .attr("cy", function(d) {
      return projection([d.lon, d.lat])[1];
    })
    .attr("r", 8);

  svg.append("g").call(brush);
}

function highlight() {

   // remove any current selection
   d3.selectAll(".final").classed("final", false);

  if (d3.event.selection === null) return;

  let [[x0, y0], [x1, y1]] = d3.event.selection;

  circles = d3.selectAll("circle");

  circles.classed(
    "selected",
    d =>
      x0 <= projection([d.lon, d.lat])[0] &&
      projection([d.lon, d.lat])[0] <= x1 &&
      y0 <= projection([d.lon, d.lat])[1] &&
      projection([d.lon, d.lat])[1] <= y1
  );
}

// shows that the brushing functionality has 
// been done and keeps track of the number
// as an output in the console
function brushend() {
   // get all the cities current selected and make it a final selection
   let selection = d3.selectAll(".selected")
   selection.classed("selected", false)
   selection.classed("final", true)

   d3.csv("data/memberList.csv", function(memberList) {

     let members_selc = memberList.filter(function (d) {
       let memberCities = d.cities;
       citiies_selected = d3.selectAll(".final").data()
       .map(function (s) { return s.properties} );
       let isSelected = citiies_selected.includes(memberCities);
       return isSelected;
     });
    });
  console.log("brushed");
}



  // Load the data from a json file (you can make these using
  // JSON.stringify(YOUR_OBJECT), just remove the surrounding "")
  d3.json("data/memberList.json", (data) => {

    const dispatchString = "selectionUpdated";

    // Create a table given the following: 
    // a dispatcher (d3-dispatch) for selection events; 
    // a div id selector to put our table in; and the data to use.
    let tableData = table()
      .selectionDispatcher(d3.dispatch(dispatchString))
      ("#table", data);
  
    });
})());