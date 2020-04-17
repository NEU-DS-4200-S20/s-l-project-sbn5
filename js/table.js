/* global D3 */

function table() {

    // Based on Mike Bostock's margin convention
    // https://bl.ocks.org/mbostock/3019563
    let ourBrush = null,
      selectableElements = d3.select(null),
      dispatcher;
  
    // Create the chart by adding an svg to the div with the id 
    // specified by the selector using the given data
    function chart(selector, data) {
      let table = d3.select(selector)
        .append("table")
          .classed("my-table", true);
  
      // Here, we grab the labels of the first item in the dataset
      //  and store them as the headers of the table.
      let tableHeaders = Object.keys(data[0]);
  
      // You should append these headers to the <table> element as <th> objects inside
      // a <th>
      // See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table
  
      let header = table.append("thead").append("tr");
        header
            .selectAll("th")
            .data(tableHeaders)
            .enter()
            .append("th")
            .text(function(d) {
                return d;
            });
  
      // Add a row for each row of the data.  Within each row, 
      // add a cell for each piece of data in the row.
  
      let tablebody = table.append("tbody");
        rows = tablebody
            .selectAll("tr")
            .data(data)
            .enter()
            .append("tr");
    
        cells = rows
            .selectAll("td")
            .data(function(d) {
                return[d["Business Name"], d["Product or Service"], d["City"], d["State"], d["Phone Number"], d["Website"]];
            })
            .enter()
            .append("td")
            .text(function(d){
                return d;
            });
  
      rows.on("mouseover", selectRow).on("mousemove", selectRow);
    
        table.on("mouseleave", endSelection);
    
        function selectRow() { 
            d3.select(this).attr("class", "selected");
            let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
            dispatcher.call(dispatchString, this, tablebody.selectAll(".selected").data());
        }
    
        function endSelection() {
            let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
            tablebody.selectAll(".selected").attr("class","");
            dispatcher.call(dispatchString, this, []);
        }
  
      return chart;
    }
  
    // Gets or sets the dispatcher we use for selection events
    chart.selectionDispatcher = function (_) {
      if (!arguments.length) return dispatcher;
      dispatcher = _;
      return chart;
    };
  
    // Given selected data from another visualization 
    // select the relevant elements here (linking)
    chart.updateSelection = function (selectedData) {
      if (!arguments.length) return;
  
      // Select an element if its datum was selected
      d3.selectAll('tr').classed("selected", d => {
        return selectedData.includes(d)
      });
  
      d3.selectAll('td').classed("selected", d => {
        return selectedData.includes(d)
      });
    };
  
    return chart;
}