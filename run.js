
var fs = require('fs');
var brain = require('./neuro');

var net = new brain.NeuralNetwork();

var content;
// First I want to read the file
// fs.readFile('./60.csv', function read(err, data) {
//     if (err) {
//         throw err;
//     }
//     content = data.toString();
//
//     // Invoke the next step here however you like
//     //console.log(content);   // Put all of the code here (not the best solution)
//     processFile();          // Or put the next step in a function and invoke it
// });

function processFile() {
    var daysTemp = content.split('\n');
    var days = [];
    for(var i in daysTemp){
    	var tmp = daysTemp[i].split(';');
    	days[i] = [];
    	for (var j = 0; j < tmp.length; j++) {
    		days[i].push(parseFloat(tmp[j])/20000);
    	};
        days[i].push(days[i][0]*days[i][0]);
    }	
    var train = [];
    for (var i = 0; i < days.length-6; i++) {
    	train.push({input: days[i].concat(days[i+1],days[i+2]), output: [days[i+3][0]]})
    };
    console.log(train[train.length-1]);
    net.train(train);
    var inp = days[days.length-3].concat(days[days.length-2],days[days.length-1]);
    var output = net.run(inp); 
    console.log(inp,output*20);
}
net.train([{input: [0, 0], output: [0]},
           {input: [0, 1], output: [1]},
           {input: [1, 0], output: [1]},
           {input: [1, 1], output: [0]}]);

console.log(net.run([0, 0]));
console.log(net.run([1, 0]));
console.log(net.run([0, 1]));
console.log(net.run([1, 1]));

