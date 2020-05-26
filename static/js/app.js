//Unit 15 HW: Belly Button Biodiversity



//Creating dropdown menu with d3's append function
function createDropdown() {
    d3.json("data/samples.json").then(data => {
        var names = data.names

        d3.select("select").selectAll("option")
        .data(names)
        .enter()
        .append("option")
        .text(d => d)

    //Provide default table and charts before a selection is made
    var firstID = names[0]
    buildTable(firstID)
    buildChart(firstID)
    });

}

//Building demographics table
function buildTable(sample) {
    d3.json("data/samples.json").then(data => {
        var metadata = data.metadata

        //Filtering for metadata that matches selection from dropdown event
        var filterData = metadata.filter(x => x.id == sample)
        console.log(filterData)
        var filterData1 = filterData[0]
        console.log(filterData1)

        //Resets element so it can be appended when new id is selected
        var location = d3.select("#sample-metadata")
        location.html("")

        Object.entries(filterData1).forEach(([key, value]) => {
            var row = location.append("tr")
            row.append("td").html(`${key}: `)
            row.append("td").html(value)
        });
    });
}


function buildChart(sample) {
    d3.json("data/samples.json").then(data => {
        console.log(data)

        var samples = data.samples

        var filterData = samples.filter(x => x.id == sample)
        console.log(filterData)
        var filterData1 = filterData[0]
        console.log(filterData1)


        var xvalue = filterData1.otu_ids
        var yvalue = filterData1.sample_values
        var hovertext = filterData1.otu_labels

        //Prepping horizontal bar chart
        var trace1 = {
            x: xvalue.slice(0,10),
            y: yvalue.slice(0,10).map(x => `OTU ID ${x}`),
            text: hovertext,
            type: "bar",
            orientation: "h"
            };

        
        var chartData = [trace1]

        var layout = {
            title: "Top 10 OTUs for Test Subject",
            xaxis: { title: "Relative Abundance of Species" }
        }

        Plotly.newPlot("bar", chartData, layout)

        //Prepping bubble chart
        var trace2 = {
            x: xvalue,
            y: yvalue,
            text: hovertext,
            mode: 'markers',
            marker: {
              size: yvalue,
              color:xvalue
        }}
        
        var layout2 = {
            title: "Test Subject's Total OTUs"
        }

        var chartData2 = [trace2]

        Plotly.newPlot("bubble", chartData2, layout2)
    });
}

//This updates Plotly via the select html element/dropdown event
function optionChanged(sample) {
    buildTable(sample)
    buildChart(sample)
}

//Finally calling the initial function
createDropdown()


