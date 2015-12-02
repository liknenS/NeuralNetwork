var Neural1 = function (size, alpha) {
    this.weights = [];
    for (var i = 0; i < size; i++) {
        this.weights.push((Math.random()-0.5 ));
    }
    ;
    this.alpha = alpha || Math.random() * 10+1
}
Neural1.prototype.calculate = function (vals) {
    var res = 0;
    for (var i = 0; i < vals.length; i++) {

        //console.log('calculate:val',i,(vals[i]&&vals[i].val));
        res += (vals[i].val || vals[i]) * this.weights[i];
    }
    ;
    this.val = 1 / (1 + Math.exp(-this.alpha * res));
    return this.val;
}

var NeuralSumm = function (size) {
    this.weights = [];
    for (var i = 0; i < size; i++) {
        this.weights.push((Math.random() + 0.5) / size);
    }
    ;
}
NeuralSumm.prototype.calculate = function (vals) {
    this.val = 0;
    for (var i = 0; i < vals.length; i++) {
        this.val += (vals[i].val || vals[i]) * this.weights[i];
    }
    ;
    return this.val;
}

var NeuralNetwork = function () {
    var self = {};
    self.train = function (data, props) {

        self.data = data;
        self.inputSize = data[0].input.length;

        props = props || {};
        props.layersCount = props.layersCount || 3;
        props.layersSize = props.layersSize || self.inputSize *3;
        props.maxIter = props.maxIter || 1000000;
        props.logStep = props.logStep || 10000;
        props.maxError = props.maxError || 0.01;
        self.lernSpeed = props.lernSpeed || 0.02;

        self.neuralNetwork = [];

        self.neuralNetwork.push(data[0].input);	//self.neuralNetwork[0] - input layer

        for (var i = 1; i < props.layersCount + 1; i++) {

            self.neuralNetwork.push([]);
            for (var j = 0; j < props.layersSize; j++) {
                self.neuralNetwork[i].push(new Neural1(self.neuralNetwork[i - 1].length));
            }
            ;
            console.log(i + '-' + self.neuralNetwork[i].length);
        }
        ;
        self.neuralNetwork.push([new Neural1(self.neuralNetwork[self.neuralNetwork.length - 1].length)]);
        var errToExit = 1;
        for (var i = 0; i < props.maxIter; i++) {
            var dataIndex = Math.floor(Math.random() * self.data.length);
            var res = self.run(self.data[dataIndex].input);
            var error = res * (1 - res) * (self.data[dataIndex].output[0] - res);
            errToExit = errToExit * 0.4 + Math.abs(self.data[dataIndex].output[0] - res);
            self.neuralNetwork[self.neuralNetwork.length - 1][0].q = error * self.neuralNetwork[self.neuralNetwork.length - 1][0].alpha;
            back();

            if (!(i % props.logStep)) {
                console.log(self.data[dataIndex].output[0],(self.data[dataIndex].output[0]- res) );
            }
            if (errToExit < props.maxError) {
                console.log('===== end ===='+i);
                break;
            }

        };
    }
    self.run = function (input) {
        self.neuralNetwork[0] = input;
        for (var i = 1; i < self.neuralNetwork.length; i++) {
            for (var j = 0; j < self.neuralNetwork[i].length; j++) {
                self.neuralNetwork[i][j].calculate(self.neuralNetwork[i - 1]);
            }
            ;
        }
        ;
        return self.neuralNetwork[self.neuralNetwork.length - 1][0].val;
    }
    function back() {
        for (var l = self.neuralNetwork.length - 1; l > 0; l--) {
            for (var n = 0; n < self.neuralNetwork[l].length; n++) {
                if (l != self.neuralNetwork.length - 1) {
                    var tmp = 0
                    for (var i = 0; i < self.neuralNetwork[l + 1].length; i++) {
                        tmp += self.neuralNetwork[l + 1][i].q * self.neuralNetwork[l + 1][i].weights[n];
                    }
                    ;
                    self.neuralNetwork[l][n].q = tmp * self.neuralNetwork[l][n].alpha * (1 - self.neuralNetwork[l][n].val) * self.neuralNetwork[l][n].val;

                    //console.log(l,tmp, self.neuralNetwork[l][n].q,self.neuralNetwork[l][n].val);
                }
                for (var i = 0; i < self.neuralNetwork[l][n].weights.length; i++) {
                    var tmp = self.lernSpeed * self.neuralNetwork[l][n].q * (self.neuralNetwork[l - 1][i].val || self.neuralNetwork[l - 1][i]);
                    //console.log(tmp);
                    self.neuralNetwork[l][n].weights[i] += tmp;
                }
                ;
            }
            ;
        }
        ;

    }

    return self;

}
module.exports.NeuralNetwork = NeuralNetwork;