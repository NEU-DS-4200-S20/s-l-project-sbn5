
((() => {

// ------------------------------------------------------------------
// MAP CODE STARTS HERE
// ------------------------------------------------------------------


// set svg height and width
var width = 960;
var height = 500;

//copied over from example code provided in class
var svg = d3
  .select("#map-container")
  .append("svg")
  .attr("viewBox", [0, 0, width, height])
  .attr("transform", "translate(-200,0) scale(3 3)")

var projection = d3
  .geoAlbersUsa()
  .translate([-1300, height + 400])
  .scale(6*width);

var path = d3.geoPath().projection(projection);



//pulling the data
d3.json("us.json", function(us) {
  d3.csv("data/cities-visited.csv", function(cities) {
    d3.csv("data/statesvisited.csv", function(statesVisited) {
      d3.tsv("data/us-state-names.tsv", function(stateNames) {
        //to select only northeast states in the usa
        //here ohio was omitted as state on the graph, 
        //even though they appear on the table because it was an outliers 
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

//function to drawMap within svg element
function drawMap(mapData, cities, statesVisited) {
  var mapGroup = svg.append("g").attr("class", "mapGroup");
 // zoom method
 svg.call(d3.zoom().on("zoom", function () {
  mapGroup.attr("transform", d3.event.transform)
  svg.attr("translate", d3.event.translate)
  mapGroup.selectAll("circle")
           .attr("r", function(d) {
                if (d3.event && d3.event.transform.k) {
                   return 8/d3.event.transform.k;
                }
                else {
                 return 8;
                }})
}))
.append("g");
  mapGroup
    .append("g")
    .selectAll("path")
    .data(mapData)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("id", "state-borders")
    .attr("class", "states");


  //draw cities on map with projection
  var circles = mapGroup
    .selectAll("circle")
    .data(cities)
    .enter()
    .append("circle")
    .attr("class", "cities")
    .attr("cx", function(d) {
      if (!projection([d.lon, d.lat])) {
        return;
       }
      return projection([d.lon, d.lat])[0];    })
    .attr("cy", function(d) {
      if (!projection([d.lon, d.lat])) {
        return;
       }
     return projection([d.lon, d.lat])[1];    })
    .attr("r", 8);
 
  //calls brush method, highlight and brushend
  mapGroup.append("g").call(brush);
}


//highlight the corresponding parts on the map
function highlight() {
   // remove any current selection
   d3.selectAll(".final").classed("final", false);

  if (d3.event.selection === null) return; // do nothing
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

// brushing functionality  
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
}



// ------------------------------------------------------------------
// MAP CODE ENDS HERE
// ------------------------------------------------------------------

//TABLE 
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