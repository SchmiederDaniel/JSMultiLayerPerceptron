class NeuralNetwork {
    constructor(layerArray) {
        this.layerArray = layerArray;
    }

    predict(input) {
        let output = input;
        for (let layer of this.layerArray) {
            output = layer.forward(output);
        }
        return output;
    }

    predictThreadSafe(input) {
        let output = input;
        for (let layer of this.layerArray) {
            layer = layer.deepCopy();
            output = layer.forward(output);
        }
        return output;
    }

    backwardWithoutTrain(lossFunction, output, y, learning_rate) {
        let grad = lossFunction.loss_prime(y, output);
        for (let j = this.layerArray.length - 1; j >= 0; j--) {
            let layer = this.layerArray[j].deepCopy();
            grad = layer.backward(grad, learning_rate);
        }
        return grad;
    }

    trainSingle(lossFunction, x_train, y_train, learning_rate) {
        this.trainSingle(lossFunction, x_train, y_train, learning_rate, false);
    }

    // Own train function
    trainSingle(lossFunction, x_train, y_train, learning_rate, verbose) {
        let error = 0;
        let x = NumpyArray.of(x_train);
        let y = NumpyArray.of(y_train);

        //forward
        let output = this.predict(x);

        //error
        if (verbose)
            error += lossFunction.loss(y, output);

        //backward
        let grad = lossFunction.loss_prime(y, output);

        for (let j = this.layerArray.length - 1; j >= 0; j--) {
            let layer = this.layerArray[j];
            grad = layer.backward(grad, learning_rate);
        }

        if (verbose)
            Console.log("error=" + error);
    }

    trainWithoutPredict(lossFunction, output, y, learning_rate) {
        let grad = lossFunction.loss_prime(y, output);
        for (let j = this.layerArray.length - 1; j >= 0; j--) {
            let layer = this.layerArray[j];
            grad = layer.backward(grad, learning_rate);
        }
        return grad;
    }

    trainWithoutPredict(lossFunction, output, y_train, learning_rate) {
        let y = NumpyArray.of(y_train);
        return trainWithoutPredict(lossFunction, output, y, learning_rate);
    }
}