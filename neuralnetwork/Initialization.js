class LayerType {
    constructor(networkBuilder, layerList, distributionType) {
        this.networkBuilder = networkBuilder;
        this.layerList = layerList;
        this.distributionType = distributionType;
    }
    /*
    dense(input_size, output_size)
    dense(weights, bias)
    */
    dense(input_size, output_size) {
        //if(arguments.legnth != 2) TODO it doesnt work
        // throw new Error("Used dense function with wrong amount of parameters! " + arguments.length);

        if (this.weights instanceof NumpyArray) {
            this.layerList.push(new Dense(this.weights, this.bias));
        } else {
            this.layerList.push(new Dense(input_size, output_size, this.distributionType.distributionType));
        }
        return this.networkBuilder;
    }
}

class DistributionType {
    distributionType = new NormalDistribution();
    constructor(networkBuilder, layerList) {
        this.networkBuilder = networkBuilder;
        this.layerList = layerList;
    }

    normalDistribution() {
        this.distributionType = new NormalDistribution();
        return this.networkBuilder;
    }

    /*zeroBias() {
      distributionType = new CustomDistribution(0, 0.0001, -1, 1);
      return networkBuilder;
    },
  
    ownBias(from, to) {
      distributionType = new CustomDistribution(from, to, -1, 1);
      return networkBuilder;
    },
  
    customDistributions(fromBias, toBias, fromWeight, toWeight) {
      distributionType = new CustomDistribution(fromBias, toBias, fromWeight, toWeight);
      return networkBuilder;
    },*/
}

class ActivationType {
    constructor(networkBuilder, layerList) {
        this.networkBuilder = networkBuilder;
        this.layerList = layerList
    }

    sigmoid() {
        this.layerList.push(new Sigmoid());
        return this.networkBuilder;
    }

    tanh() {
        this.layerList.push(new Tanh());
        return this.networkBuilder;
    }
    /*
    elu() {
      layerList.push(new ELU());
      return networkBuilder;
    },
    reLU() {
      layerList.push(new ReLU());
      return networkBuilder;
    },
    leakyReLu() {
      layerList.push(new LeakyReLu());
      return networkBuilder;
    },*/
}

class NetworkBuilder {
    layerList = [];
    distribution = new DistributionType(this, this.layerList);
    layer = new LayerType(this, this.layerList, this.distribution);
    activation = new ActivationType(this, this.layerList);

    build() {
        return new NeuralNetwork(this.layerList);
    }

    toStrings() {
        return "NetworkBuilder(" + this.layerList.map(layer => layer.toString() + ", ") + ")";
    }
}