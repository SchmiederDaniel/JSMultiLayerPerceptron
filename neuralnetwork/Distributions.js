class DistributionInterface {
    biasFrom() { };

    biasTo() { };

    weightsFrom() { };

    weightsTo() { };
}

class CustomDistribution extends DistributionInterface {
    constructor(biasFrom, biasTo, weightFrom, weightTo) {
        super();

        this.biasFromValue = biasFrom;
        this.biasToValue = biasTo;

        this.weightFromValue = weightFrom;
        this.weightToValue = weightTo;
    }

    biasFrom = () => biasFromValue;
    biasTo = () => biasToValue;
    weightsFrom = () => weightFromValue;
    weightsTo = () => weightToValue;
}

class NormalDistribution extends DistributionInterface {
    biasFrom = () => -1;
    biasTo = () => 1;
    weightsFrom = () => 1;
    weightsTo = () => 1;
}