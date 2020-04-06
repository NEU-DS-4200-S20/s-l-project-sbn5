// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
((() => {

  // Load the data from a json file (you can make these using
  // JSON.stringify(YOUR_OBJECT), just remove the surrounding "")
  d3.json("data/memberList.json", (data) => {

    // Create a table given the following: 
    // a dispatcher (d3-dispatch) for selection events; 
    // a div id selector to put our table in; and the data to use.
    let tableData = table()
      .selectionDispatcher(d3.dispatch(dispatchString))
      ("#table", data);
  
    });
})());