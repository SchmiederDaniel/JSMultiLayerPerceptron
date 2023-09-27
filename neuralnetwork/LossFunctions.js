class LossFunctionInterface {
    loss(y_true, y_pred) { };

    loss_prime(y_true, y_pred) { };
}

class LinearLoss extends LossFunctionInterface {
    // basic loss function where the error is y_pred - y_true
    loss(y_true, y_pred) {
        if (y_true.rows() != y_pred.rows())
            throw new IllegalArgumentException("Rows doesn't match " + y_true.rows() + ", " + y_pred.rows());
        if (y_true.cols() != y_pred.cols())
            throw new IllegalArgumentException("Cols doesn't match " + y_true.cols() + ", " + y_pred.cols());

        let sum = 0;
        for (let rowIndex = 0; rowIndex < y_true.rows(); rowIndex++) {
            for (let colIndex = 0; colIndex < y_true.cols(); colIndex++) {
                sum += Math.abs(y_pred.data[rowIndex][colIndex] - y_true.data[rowIndex][colIndex]);
            }
        }
        return sum / (y_true.rows() * y_pred.cols());

        //    return 2 * (y_pred - y_true) / np.size(y_true)
    }

    loss_prime(y_true, y_pred) {
        if (y_true.rows() != y_pred.rows())
            throw new IllegalArgumentException("Rows doesn't match " + y_true.rows() + ", " + y_pred.rows());
        if (y_true.cols() != y_pred.cols())
            throw new IllegalArgumentException("Cols doesn't match " + y_true.cols() + ", " + y_pred.cols());

        let newData = array(y_true.rows(), y_pred.cols());

        for (let rowIndex = 0; rowIndex < y_true.rows(); rowIndex++) {
            for (let colIndex = 0; colIndex < y_true.cols(); colIndex++) {
                newData[rowIndex][colIndex] = y_pred.data[rowIndex][colIndex] - y_true.data[rowIndex][colIndex];
            }
        }
        return new NumpyArray(newData);
        //    return 2 * (y_pred - y_true) / np.size(y_true)
    }
}

class MeanSquareError extends LossFunctionInterface {
    // Mean square error loss function
    loss(y_true, y_pred) {
        if (y_true.rows() != y_pred.rows())
            throw new IllegalArgumentException("Rows doesn't match " + y_true.rows() + ", " + y_pred.rows());
        if (y_true.cols() != y_pred.cols())
            throw new IllegalArgumentException("Cols doesn't match " + y_true.cols() + ", " + y_pred.cols());

        let sum = 0;
        for (let rowIndex = 0; rowIndex < y_true.rows(); rowIndex++) {
            for (let colIndex = 0; colIndex < y_true.cols(); colIndex++) {
                sum += Math.pow(y_true.data[rowIndex][colIndex] - y_pred.data[rowIndex][colIndex], 2);
            }
        }
        return sum / (y_true.rows() * y_pred.cols());

        //    return 2 * (y_pred - y_true) / np.size(y_true)
    }

    loss_prime(y_true, y_pred) {
        if (y_true.rows() != y_pred.rows())
            throw new IllegalArgumentException("Rows doesn't match " + y_true.rows() + ", " + y_pred.rows());
        if (y_true.cols() != y_pred.cols())
            throw new IllegalArgumentException("Cols doesn't match " + y_true.cols() + ", " + y_pred.cols());

        let newData = array(y_true.rows(), y_pred.cols());

        for (let rowIndex = 0; rowIndex < y_true.rows(); rowIndex++) {
            for (let colIndex = 0; colIndex < y_true.cols(); colIndex++) {
                newData[rowIndex][colIndex] = 2 * (y_pred.data[rowIndex][colIndex] - y_true.data[rowIndex][colIndex]) / (y_true.rows() * y_true.cols());
            }
        }
        return new NumpyArray(newData);
        //    return 2 * (y_pred - y_true) / np.size(y_true)
    }
}

class BinaryCrossEntropy extends LossFunctionInterface {
    loss(y_true, y_pred) {
        if (y_true.rows() != y_pred.rows())
            throw new IllegalArgumentException("Rows doesn't match " + y_true.rows() + ", " + y_pred.rows());
        if (y_true.cols() != y_pred.cols())
            throw new IllegalArgumentException("Cols doesn't match " + y_true.cols() + ", " + y_pred.cols());

        let sum = 0;
        for (let rowIndex = 0; rowIndex < y_true.rows(); rowIndex++) {
            for (let colIndex = 0; colIndex < y_true.cols(); colIndex++) {
                sum += -y_true.data[rowIndex][colIndex] * Math.log(y_pred.data[rowIndex][colIndex])
                    - (1 - y_true.data[rowIndex][colIndex]) * Math.log(1 - y_pred.data[rowIndex][colIndex]);
            }
        }
        return sum / (y_true.rows() * y_pred.cols());
    }

    loss_prime(y_true, y_pred) {
        if (y_true.rows() != y_pred.rows())
            throw new IllegalArgumentException("Rows doesn't match " + y_true.rows() + ", " + y_pred.rows());
        if (y_true.cols() != y_pred.cols())
            throw new IllegalArgumentException("Cols doesn't match " + y_true.cols() + ", " + y_pred.cols());

        let newData = array(y_true.rows(), y_pred.cols());
        for (let rowIndex = 0; rowIndex < y_true.rows(); rowIndex++) {
            for (let colIndex = 0; colIndex < y_true.cols(); colIndex++) {
                newData[rowIndex][colIndex] = ((1 - y_true.data[rowIndex][colIndex]) / (1 - y_pred.data[rowIndex][colIndex])
                    - y_true.data[rowIndex][colIndex] / y_pred.data[rowIndex][colIndex]) / (y_true.rows() * y_true.cols());
            }
        }
        return new NumpyArray(newData);
    }
}