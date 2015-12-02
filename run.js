
var fs = require('fs');
var brain = require('brain');

var net = new brain.NeuralNetwork();

var content;
// First I want to read the file
fs.readFile('./60.csv', function read(err, data) {
    if (err) {
        throw err;
    }
    content = data.toString();

    // Invoke the next step here however you like
    console.log(content);   // Put all of the code here (not the best solution)
    processFile();          // Or put the next step in a function and invoke it
});

function processFile() {
    var daysTemp = content.split('\n');
    var days = [];
    for(var i in daysTemp){
    	var tmp = daysTemp[i].split(';');
    	days[i] = [];
    	for (var j = 0; j < tmp.length; j++) {
    		days[i].push(parseFloat(tmp[j])/20000);
    	};
    }	
    var train = [];
    for (var i = 0; i < days.length-3; i++) {
    	train.push({input: days[i].concat(days[i+1],days[i+2]), output: days[i+3][0]})
    };
    console.log(train[train.length-1]);
    net.train(train, {
          errorThresh: 0.005,  // error threshold to reach
          iterations: 20000,   // maximum training iterations
          log: true,           // console.log() progress periodically
          logPeriod: 10,       // number of iterations between logging
          learningRate: 0.3    // learning rate
        });
    var inp = days[days.length-3].concat(days[days.length-2],days[days.length-1])
    var output = net.run(inp); 
    console.log(inp,output);
}

