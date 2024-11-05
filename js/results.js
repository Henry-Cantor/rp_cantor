/* Fetch CSV temperature data and display via Chart.js 
Temperature values are differences from the mean of 14 deg-C.*/

async function getData(url) {
    const response = await fetch(url); //.. moves up 1 folder level
    const data = await response.text(); // CSV in text format
    // console.log(data);
    return data;
}

async function organizeData1() {
    const data = await getData('data/Data1-Sheet1-2.csv');    // load data and await getData() function
    const xConditions = [];                                   // x-axis labels
    const yFirstCount = [];                                   // y-axis cell counts for first count
    const yPostCount = [];                                    // y-axis cell counts for post count
    const stFirst = [];                                       // standard deviations for first count
    const stPost = [];                                        // standard deviations for post count

    // \n - new line chracter
    // split('\n') - separate the table into an array of indiv. rows.
    // slice(start, end) - return a new array starting at index 'start' up to but not including 'end'
    const table = data.split('\n').slice(1);
    // console.log(table);

    table.forEach(row => {
        const columns = row.split(','); // split row into columns using commas

        const condition = columns[0];    // assign condition value
        xConditions.push(condition);                      // push condition values into xConditions array

        const firstCellCount = parseFloat(columns[1]);     // first cell density value
        yFirstCount.push(firstCellCount);                  
        
        const postCellCount = parseFloat(columns[2]);          // second cell density value
        yPostCount.push(postCellCount);           

        const stDevFirst = parseFloat(columns[3]);          // first cell count standard deviation value
        stFirst.push(stDevFirst);     

        const stDevPost = parseFloat(columns[4]);          // second cell count standard deviation value
        stPost.push(stDevPost);  
        
    });
    return {xConditions, yFirstCount, yPostCount, stFirst, stPost}     // return multiple values as an object
}

async function organizeData2() {
    const data = await getData('data/Data2 - Sheet1.csv');    // load data and await getData() function
    const xConditions = [];                                   // x-axis labels
    const yNumDiv = [];                                       // y-axis mean number of divisions
    const stDiv = [];                                         // standard deviations for each condition's number of divisions

    // \n - new line chracter
    // split('\n') - separate the table into an array of indiv. rows.
    // slice(start, end) - return a new array starting at index 'start' up to but not including 'end'
    const table = data.split('\n').slice(1);
    // console.log(table);

    table.forEach(row => {
        const columns = row.split(','); // split row into columns using commas

        const condition = columns[0];    // assign condition value
        xConditions.push(condition);                      // push condition values into xConditions array

        const numberDivisions = parseFloat(columns[1]);     // mean number of divisions for each condition
        yNumDiv.push(numberDivisions);                  
        
        const stDevDiv = parseFloat(columns[2]);          // standard deviation for the number of divisions
        stDiv.push(stDevDiv);  
        
    });
    return {xConditions, yNumDiv, stDiv}     // return multiple values as an object
}

async function createChart() {
    const data = await getData();       // wait for getData() to send formated data to createChart()
    const lineChart = document.getElementById('lineChart');
    const degreeSymbol = String.fromCharCode(176);

    const myChart = new Chart(lineChart, {
        type: 'line',
        data: {
            labels: data.xYears,        // x-axis labels
            datasets: [
                {
                    label: `Combined Global Land-Surface Air and Sea-Surface Water Temperatures in ${degreeSymbol}C`,
                    data: data.yTemps,
                    fill: false,
                    backgroundColor: 'rgba(255, 0, 132, 0.2)',
                    borderColor: 'rgba(255, 0, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: `Combined N.H. Land-Surface Air and Sea-Surface Water Temperatures in ${degreeSymbol}C`,
                    data: data.yNHtemps,
                    fill: false,
                    backgroundColor: 'rgba(0, 102, 255, 0.2)',
                    borderColor: 'rgba(0, 102, 255, 1)',
                    borderWidth: 1
                },
                {
                    label: `Combined S.H. Land-Surface Air and Sea-Surface Water Temperatures in ${degreeSymbol}C`,
                    data: data.ySHtemps,
                    fill: false,
                    backgroundColor: 'rgba(0, 153, 51, 0.2)',
                    borderColor: 'rgba(0, 153, 51, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,               // re-size based on screen size
            maintainAspectRatio: false,     
            scales: {                       // display options for x & y axes
                x: {
                    title: {
                        display: true,
                        text: 'Year',       // x-axis title
                        font: {             // font properties
                            size: 14
                        }
                    },
                    ticks: {
                        callback: function(val, index) {
                            return index % 5 === 0 ? this.getLabelForValue(val) : '';
                        },
                        font: {
                            size: 14
                        }
                    },
                    grid: {
                        color:'#6c767e'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Mean Temperatures',      // y-axis title
                        font: {                         // font properties
                            size: 14
                        }
                    },
                    ticks: {
                        maxTicksLimit: data.yTemps.length/10,
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color:'#6c767e'
                    }
                }
            },
            plugins: {      // Display options for title and legend
                title: {
                    display: true,      // display chart title
                    text: 'Global Mean Temperatures vs Year (since 1880)',
                    font: {
                        size: 24,
                    },
                    color: '#black',
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                },
                legend: {
                    align: 'start',
                    position: 'bottom',
                }
            }
        }
    });
}

createChart();