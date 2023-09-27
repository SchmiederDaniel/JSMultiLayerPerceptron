class LayerInterface {
    forward(input) { };

    backward(output_gradient, learning_rate) { };

    deepCopy() { };
}

class ActivationInterface extends LayerInterface {
    constructor(copyInput) {
        super();
        this.input = copyInput;
    }

    forward(input) {
        this.input = input;
        return this.activation(input);
    }

    activation(input) { };

    backward(output_gradient, learning_rate) {
        return output_gradient.multiplyScalar(this.activation_prime(this.input));
    }

    activation_prime(input) { };
}

class Sigmoid extends ActivationInterface {
    constructor(copyInput) {
        super(copyInput);
    }

    activation(input) {
        let newData = array(input.rows(), input.cols());
        for (let rowIndex = 0; rowIndex < input.rows(); rowIndex++) {
            for (let colIndex = 0; colIndex < input.cols(); colIndex++) {
                newData[rowIndex][colIndex] = Sigmoid.sigmoid(input.data[rowIndex][colIndex]);
            }
        }
        return new NumpyArray(newData);
    }

    static sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }

    activation_prime(input) {
        let newData = array(input.rows(), input.cols());
        for (let rowIndex = 0; rowIndex < input.rows(); rowIndex++) {
            for (let colIndex = 0; colIndex < input.cols(); colIndex++) {
                let s = Sigmoid.sigmoid(input.data[rowIndex][colIndex]);
                newData[rowIndex][colIndex] = s * (1 - s);
            }
        }
        return new NumpyArray(newData);
    }

    deepCopy() {
        return new Sigmoid(this.input.copy());
    }

    toString() {
        return "Sigmoid";
    }
}

class Tanh extends ActivationInterface {
    constructor(copyInput) {
        super(copyInput);
    }

    activation(input) {
        let newData = array(input.rows(), input.cols());
        for (let rowIndex = 0; rowIndex < input.rows(); rowIndex++) {
            for (let colIndex = 0; colIndex < input.cols(); colIndex++) {
                newData[rowIndex][colIndex] = Math.tanh(input.data[rowIndex][colIndex]);
            }
        }
        return new NumpyArray(newData);
    }

    activation_prime(input) {
        let newData = array(input.rows(), input.cols());
        for (let rowIndex = 0; rowIndex < input.rows(); rowIndex++) {
            for (let colIndex = 0; colIndex < input.cols(); colIndex++) {
                let s = Math.tanh(input.data[rowIndex][colIndex]);
                // newData[rowIndex][colIndex] = s * (1 - s);
                s * s;
                newData[rowIndex][colIndex] = 1 - s;
            }
        }
        return new NumpyArray(newData);
    }

    deepCopy() {
        return new Tanh(this.input.copy());
    }

    toString() {
        return "Tanh";
    }
}

class Dense extends LayerInterface {
    constructor(...args) {
        super();
        if (isNumber(args[0]) && isNumber(args[1]) && args[2] instanceof DistributionInterface && args.length === 3) {
            // input_size, output_size, distribution
            let input_size = args[0];
            let output_size = args[1];
            let distribution = args[2];
            this.weights = new NumpyArray(output_size, input_size);
            this.bias = new NumpyArray(output_size, 1);

            this.weights.randomize(distribution.weightsFrom(), distribution.weightsTo());
            this.bias.randomize(distribution.biasFrom(), distribution.biasTo());
        } else if (args[0] instanceof NumpyArray && args[1] instanceof NumpyArray && args[2] instanceof NumpyArray && args.length === 3) {
            // weights, bias, inputCopy
            this.weights = args[0];
            this.bias = args[1];
            this.input = args[2];
        } else if (args[0] instanceof NumpyArray && args[1] instanceof NumpyArray && args.length === 2) {
            // weights, bias
            this.weights = args[0];
            this.bias = args[1];
        } else {
            throw new Error("No suitable constructor found " + args.length + " " + args.map(e => e.toString()))
        }
    }

    forward(input) {
        this.input = input;
        return this.weights.dot(input).add(this.bias);
    }

    backward(output_gradient, learning_rate) {
        // TODO: dimension output_gradient = (1, 1)
        let weights_gradient = output_gradient.dot(this.input.transpose());
        let input_gradient = this.weights.transpose().dot(output_gradient);
        this.weights = this.weights.subtract(weights_gradient.multiplyScalar(learning_rate));
        this.bias = this.bias.subtract(output_gradient.multiplyScalar(learning_rate)); // idk if activation is a vector or matrix
        return input_gradient;
    }

    deepCopy() {
        return new Dense(this.weights.copy(), this.bias.copy(), this.input.copy());
    }

    toString() {
        return "DenseLayer(" + this.weights.dimension() + " " + this.bias.dimension() + ")";
    }

    //  @Override
    //  public String toString() {
    //    return "Dense " + weights + " " + bias;
    //  }
}