/* Fetch CSV temperature data and display via Chart.js */

async function getData(url) {
    const response = await fetch(url); //.. moves up 1 folder level
    const data = await response.text(); // CSV in text format
    // console.log(data);
    return data;
}

async function organizeData1() {
    const data = await getData('data/Data1 - Sheet1-2.csv');    // load data and await getData() function
    const xConditions = [];                                   // x-axis labels
    const yFirstCount = [];                                   // y-axis cell counts for first count
    const yPostCount = [];                                    // y-axis cell counts for post count
    const stFirst = [];                                       // standard deviations for first count
    const stPost = [];                                        // standard deviations for post count

    // \n - new line chracter
    // split('\n') - separate the table into an array of indiv. rows.
    // slice(start, end) - return a new array starting at index 'start' up to but not including 'end'
    const table = data.split('\n').slice(0);
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
    console.log('Returning the values as objects: ', xConditions, yFirstCount, yPostCount, stFirst, stPost)
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
    const table = data.split('\n').slice(0);
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

async function createChart1() {
    const data = await organizeData1();       // wait for organizeData() to send formatted data to createChart()
    const barChart = document.getElementById('barChart1');

    const myChart = new Chart(barChart, {       // Build the first chart
        type: 'bar',
        data: {
            labels: data.xConditions,        // x-axis labels
            datasets: [                      // y-axis data of initial and post cell densities
                {
                    label: 'Initial Cell Density',
                    data: data.yFirstCount,
                    backgroundColor: 'rgba(255, 0, 132, 0.2)',
                    borderColor: 'rgba(255, 0, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: 'After-Incubation Cell Density',
                    data: data.yPostCount,
                    backgroundColor: 'rgba(0, 102, 255, 0.2)',
                    borderColor: 'rgba(0, 102, 255, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,               // re-size based on screen size
            maintainAspectRatio: true,     
            scales: {                       // display options for x & y axes
                x: {
                    title: {
                        display: true,
                        text: 'Condition',       // x-axis title
                        font: {             // font properties
                            size: 14
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Cell Density (cells/mL)',      // y-axis title
                        font: {                         // font properties
                            size: 14
                        }
                    },
                    ticks: {
                        maxTicksLimit: data.yPostCount.length*2,
                        font: {
                            size: 12
                        }
                    }
                }
            },
            plugins: {      // Display options for title and legend
                title: {
                    display: true,      // display chart title
                    text: 'Cell Density Measurements for Each Condition',
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

async function createChart2() {
    const data = await organizeData2();       // wait for getData() to send formated data to createChart()
    const barChart = document.getElementById('barChart2');

    const myChart = new Chart(barChart, {
        type: 'bar',
        data: {
            labels: data.xConditions,        // x-axis labels
            datasets: [                     // y-axis data of number of divisions per cell
                {
                    label: 'Number of Divisions',
                    data: data.yNumDiv,
                    backgroundColor: 'rgba(0, 181, 131, 0.2)',
                    borderColor: 'rgba(0, 181, 131)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,               // re-size based on screen size
            maintainAspectRatio: true,     
            scales: {                       // display options for x & y axes
                x: {
                    title: {
                        display: true,
                        text: 'Condition',       // x-axis title
                        font: {             // font properties
                            size: 14
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Average Divisions per Cell',      // y-axis title
                        font: {                         // font properties
                            size: 14
                        }
                    },
                    ticks: {
                        maxTicksLimit: data.yNumDiv.length*2,
                        font: {
                            size: 12
                        }
                    }
                }
            },
            plugins: {      // Display options for title and legend
                title: {
                    display: true,      // display chart title
                    text: 'Divisions per Cell for Each Condition',
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


// call functions to build charts
createChart1();
createChart2();