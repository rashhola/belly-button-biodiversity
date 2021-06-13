// Write a function that will build the metadata for a single sample. It should do the following:
// - loop over the samples.json file with d3.json().then()

function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      var createArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result =  createArray[0];
      // Use d3 to select the required panel
      var panelData = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      panelData.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        panelData.append("h6").text(`${key.toUpperCase()}: ${value}`);

      });
  
      // BONUS: Build the Gauge Chart
      buildGauge(result.wfreq);
    });
}

// - extract the metadata from the json
// - filter the metadata for the sample id
// - update the metadata html elements
// - clear any existing metadata in the metadata html elements
// - append hew header tags for each key-value pair in the filtered metadata



// Write a function that will build the charts for a single sample. It should do the following:
// - loop over the samples.json file with d3.json().then()

function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
        var sampleData = data.samples;
        var createArray = sampleData.filter(sampleObj => sampleObj.id == sample);
        var result = createArray[0];
    
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

      // Build a Bubble Chart
        var layout = {
            title: "Bacteria Cultures Per Sample",
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
        };
        var trace = [
            {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
            }
        ];

// - extract the samples from the json
// - filter the samples for the sample id
// - extract the ids, labels, and values from the filtered result
// - build a bubble chart and plot with Plotly.newPlot()
// - build a bar chart and plot with Plotly.newPlot()

      Plotly.newPlot("bubble", trace, layout);
      
      //Create a horizontal bar chart
        var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        var trace = [{
            y: yticks,
            x: sample_values.slice(0, 10).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h",
            }];
  
        var layout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: { t: 30, l: 150 }
        };

  
      Plotly.newPlot("bar", trace, layout);
    });
}      


// Write a function called init() that will populate the charts/metadata and elements on the page. It should do the following:
// - select the dropdown element in the page
// - loop over the samples.json data to append the .name attribute into the value of an option HTML tag (lookup HTML documentation on dropdown menus)
// - extract the first sample from the data
// - call your two functions to build the metadata and build the charts on the first sample, so that new visitors see some data/charts before they select something from the dropdown

function init() {
    // Grab a reference to the dropdown select element
    var selectDropdown = d3.select("#selDataset");
  
    // Populate the select options by using the list of sample names
    d3.json("samples.json").then((data) => {
      var name = data.names;
  
      name.forEach((sample) => {
        selectDropdown
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the sample data from the list to build the plots
      var sampleData = name[0];
      buildCharts(sampleData);
      buildMetaData(sampleData);
    });
}
  

  // Write a function called optionChanged() that takes a new sample as an argument. It should do the following:
// - call your two functions to build the metadata and build the charts on the new sample
// Look at line 30 of index.html: that is the event listener that will call this function when someone selects something on the dropdown

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetaData(newSample);
}

// Initialize the dashboard
init();