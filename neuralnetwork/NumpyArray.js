class NumpyArray {
    data = [];
    /*
    constructor(data);
    constructor(row, cols)
    */
    constructor(...args) {
        if (args.length == 1 && args[0] instanceof Array) {
            this.data = args[0];
        } else if (args.length == 2 && isNumber(args[0]) && isNumber(args[1])) {
            this.data = array(args[0], args[1]);
        } else {
            throw new Error("No constructor for NumpyArray with " + paremeters.length + " parameters " + paremeters.reduce((sum, obj) => sum + ", " + object.constructor.name + "(" + obj + ")", "").substring(2, 999));
        }
    }

    // TODO alle array inits replacen Array.from(Array(rows), () => new Array(cols));
    // TODO: Sind arrow functions ram verschwenderisch? Weil sie ja mit jeder erstellung eines Objektes als variable deklaliert werden. (Also wenn man mehrere Tausende Objekte erstellt...)

    rows = () => this.data.length;
    cols = () => this.data[0].length;

    dot(other) {
        if (this.cols() != other.rows())
            throw new Error("Columns doesn't match rows " + this.cols() + ", " + other.rows());
        let newData = array(this.rows(), other.cols());

        for (let rowIndex = 0; rowIndex < this.rows(); rowIndex++) {
            for (let colIndex = 0; colIndex < other.cols(); colIndex++) {
                let sum = 0;
                for (let otherColIndex = 0; otherColIndex < this.cols(); otherColIndex++) {
                    sum += this.data[rowIndex][otherColIndex] * other.data[otherColIndex][colIndex];
                }
                newData[rowIndex][colIndex] = sum;
            }
        }
        return new NumpyArray(newData);
    }

    static of(...input) {
        input = flatten(input);
        let newData = array(input.length, 1);
        for (let index = 0; index < input.length; index++) {
            newData[index][0] = input[index];
        }
        return new NumpyArray(newData);
    }

    add(other) {
        let a = this.rows() < other.rows() ? this : other;
        let b = this.rows() < other.rows() ? other : this;

        // add one number to every value in array
        if (a.rows() == 1 && a.cols() == 1) {
            let newData = array(b.rows(), b.cols());
            for (let rowIndex = 0; rowIndex < b.rows(); rowIndex++) {
                for (let colIndex = 0; colIndex < b.cols(); colIndex++) {
                    newData[rowIndex][colIndex] = a.data[0][0] + b.data[rowIndex][colIndex];
                }
            }
            return new NumpyArray(newData);
        }

        // add 1 dimensional array to a two dimensional array
        if (a.rows() == 1 && a.cols() == b.cols()) {
            let newData = array(b.rows(), a.cols());
            for (let rowIndex = 0; rowIndex < b.rows(); rowIndex++) {
                for (let colIndex = 0; colIndex < a.cols(); colIndex++) {
                    newData[rowIndex][colIndex] = a.data[0][colIndex] + b.data[rowIndex][colIndex];
                }
            }
            return new NumpyArray(newData);
        }

        // matrix addition
        if (a.rows() == b.rows() && a.cols() == b.cols()) {
            let newData = array(a.rows(), a.cols());
            for (let rowIndex = 0; rowIndex < a.rows(); rowIndex++) {
                for (let coldIndex = 0; coldIndex < a.cols(); coldIndex++) {
                    newData[rowIndex][coldIndex] = a.data[rowIndex][coldIndex] + b.data[rowIndex][coldIndex];
                }
            }
            return new NumpyArray(newData);
        }
        throw new Error("Couldn't find a add( function for array dimensions " + dimension() + " / " + other.dimension());
    }

    dimension = () => "(" + rows() + ", " + cols() + ")";

    subtract(other) {
        // determines if the subtraction needs to be reversed later on
        let reversed = !(this.rows() < other.rows());
        let a = this.rows() < other.rows() ? this : other;
        let b = this.rows() < other.rows() ? other : this;

        // subtract one number to every value in array
        if (a.rows() == 1 && a.cols() == 1) {
            let newData = array(b.rows(), b.cols());
            for (let rowIndex = 0; rowIndex < b.rows(); rowIndex++) {
                for (let colIndex = 0; colIndex < b.cols(); colIndex++) {
                    if (reversed) {
                        newData[rowIndex][colIndex] = b.data[rowIndex][colIndex] - a.data[0][0];
                    } else {
                        newData[rowIndex][colIndex] = a.data[0][0] - b.data[rowIndex][colIndex];
                    }
                }
            }
            return new NumpyArray(newData);
        }

        // subtract 1 dimensional array from a two dimensional array
        if (a.rows() == 1 && a.cols() == b.cols()) {
            let newData = array(b.rows(), a.cols());
            for (let rowIndex = 0; rowIndex < b.rows(); rowIndex++) {
                for (let colIndex = 0; colIndex < a.cols(); colIndex++) {
                    if (reversed) {
                        newData[rowIndex][colIndex] = b.data[rowIndex][colIndex] - a.data[0][colIndex];
                    } else {
                        newData[rowIndex][colIndex] = a.data[0][colIndex] - b.data[rowIndex][colIndex];
                    }
                }
            }
            return new NumpyArray(newData);
        }

        // matrix subtraction
        if (a.rows() == b.rows() && a.cols() == b.cols()) {
            let newData = array(a.rows(), a.cols());
            for (let rowIndex = 0; rowIndex < a.rows(); rowIndex++) {
                for (let coldIndex = 0; coldIndex < a.cols(); coldIndex++) {
                    if (reversed) {
                        newData[rowIndex][coldIndex] = b.data[rowIndex][coldIndex] - a.data[rowIndex][coldIndex];
                    } else {
                        newData[rowIndex][coldIndex] = a.data[rowIndex][coldIndex] - b.data[rowIndex][coldIndex];
                    }
                }
            }
            return new NumpyArray(newData);
        }
        throw new Error("Couldn't find a subtract( function for array dimensions " + dimension() + " / " + other.dimension());
    }

    subtractScalar(value) {
        let newData = array(this.rows(), this.cols());
        for (let rowIndex = 0; rowIndex < this.rows(); rowIndex++) {
            for (let colIndex = 0; colIndex < this.cols(); colIndex++) {
                newData[rowIndex][colIndex] = value - this.data[rowIndex][colIndex];
            }
        }
        return new NumpyArray(newData);
    }

    transpose() {
        let newData = array(this.cols(), this.rows());
        for (let rowsIndex = 0; rowsIndex < this.rows(); rowsIndex++) {
            for (let colsIndex = 0; colsIndex < this.cols(); colsIndex++) {
                newData[colsIndex][rowsIndex] = this.data[rowsIndex][colsIndex];
            }
        }
        return new NumpyArray(newData);
    }

    inverse() {
        let newData = array(this.rows(), this.cols());
        for (let rowIndex = 0; rowIndex < this.rows(); rowIndex++) {
            for (let colIndex = 0; colIndex < this.cols(); colIndex++) {
                newData[rowIndex][colIndex] = -this.data[rowIndex][colIndex];
            }
        }
        return new NumpyArray(newData);
    }

    multiplyScalar(other) {
        if (isNumber(other)) {
            let newData = array(this.rows(), this.cols());
            for (let rowIndex = 0; rowIndex < this.rows(); rowIndex++) {
                for (let colIndex = 0; colIndex < this.cols(); colIndex++) {
                    newData[rowIndex][colIndex] = this.data[rowIndex][colIndex] * other;
                }
            }
            return new NumpyArray(newData);
        } else {
            let a = this.rows() < other.rows() ? this : other;
            let b = this.rows() < other.rows() ? other : this;

            if (a.cols() == 1 && a.rows() == 1) {
                let newData = array(b.rows(), b.cols());
                for (let colIndex = 0; colIndex < b.cols(); colIndex++) {
                    for (let rowIndex = 0; rowIndex < b.rows(); rowIndex++) {
                        newData[rowIndex][colIndex] = a.data[0][0] * b.data[rowIndex][colIndex];
                    }
                }
                return new NumpyArray(newData);
            }

            if (a.rows() == 1 && a.rows() == b.rows()) {
                let newData = array(b.rows(), b.cols());
                for (let colIndex = 0; colIndex < b.cols(); colIndex++) {
                    for (let rowIndex = 0; rowIndex < b.rows(); rowIndex++) {
                        newData[rowIndex][colIndex] = a.data[0][colIndex] * b.data[rowIndex][colIndex];
                    }
                }
                return new NumpyArray(newData);
            }

            if (a.rows() == b.rows() && a.cols() == b.cols()) {
                let newData = array(a.rows(), a.cols());
                for (let rowIndex = 0; rowIndex < a.rows(); rowIndex++) {
                    for (let colIndex = 0; colIndex < a.cols(); colIndex++) {
                        newData[rowIndex][colIndex] = a.data[rowIndex][colIndex] * b.data[rowIndex][colIndex];
                    }
                }
                return new NumpyArray(newData);
            }

            if (a.rows() == b.rows()) {
                a = this.cols() < other.cols() ? this : other;
                b = this.cols() < other.cols() ? other : this;

                if (a.cols() == 1) {
                    let newData = array(rows(), b.cols());
                    for (let rowIndex = 0; rowIndex < this.rows(); rowIndex++) {
                        for (let colIndex = 0; colIndex < b.cols(); colIndex++) {
                            newData[rowIndex][colIndex] = b.data[rowIndex][colIndex] * a.data[rowIndex][0];
                        }
                    }
                    return new NumpyArray(newData);
                }
            }

            throw new Error("One array must be in the dimension of [1][x] or the same dimension of the second array " + a.dimension() + ", " + b.dimension());
        }
    }

    //randomize = (from, to) => this.data.map(array => array.map(value => Math.random() * (from + to) - from)); maybe works?
    randomize(from, to) {
        for (let rowIndex = 0; rowIndex < this.rows(); rowIndex++) {
            for (let colIndex = 0; colIndex < this.cols(); colIndex++) {
                this.data[rowIndex][colIndex] = Math.random() * (from + to) - from;
            }
        }
        return this;
    }

    copy = () => new NumpyArray(this.data.slice(0))

    //toString = () => this.data;
    toString = () => "NumpyArray(" + arrayToString(this.data) + " rows:" + this.rows() + " cols:" + this.cols() + ")";
}