const padding = 40;
const radius = 10;

class Visualizer {
    constructor(neuralNetwork, canvas, context) {
        this.neuralNetwork = neuralNetwork;
        this.canvas = canvas;
        this.context = context;
    }

    draw(posX, posY, width, height, color) {
        this.drawLines(width, height, color);

        this.drawCircles(width, height, color);
    }

    drawLines(width, height, color) {
        let network = this.createLoopArray(width, height);

        this.context.lineWidth = 3;
        this.context.strokeStyle = "orange";
        for (let i = 0; i < network.length - 1; i++) {
            let layer = network[i];
            let nextLayer = network[i + 1];
            for (let node of layer) {
                for (let nextNode of nextLayer) {
                    context.beginPath();
                    context.moveTo(node[0], node[1]);
                    context.lineTo(nextNode[0], nextNode[1]);
                    context.stroke();
                }
            }
        }
    }

    drawCircles(width, height, color) {
        let network = this.createLoopArray(width, height);

        this.context.lineWidth = 3;
        this.context.strokeStyle = "darkred";
        this.context.fillStyle = color;

        for (let layer of network) {
            for (let node of layer) {
                context.beginPath();
                context.arc(node[0], node[1], radius, 0, 2 * Math.PI, false);
                context.fill();
                context.stroke();
            }
        }
    }

    createLoopArray(width, height) {
        let layerCount = this.neuralNetwork.layerArray.length;
        let layerPadding = (width - padding * 2) / layerCount; // the spacing between layers of the layer has a width of 0

        let network = [];
        for (let x = 0; x < this.neuralNetwork.layerArray.length; x++) {
            let layer = this.neuralNetwork.layerArray[x];
            if (layer instanceof Dense) {
                let newLayers = [];
                const nodeCount = layer.weights.cols();
                const nodePadding = (height - padding * 2) / nodeCount;
                const middleY = (height - ((nodeCount - 1) * nodePadding + padding * 2)) / 2; // to center the y position

                for (let y = 0; y < nodeCount; y++) {
                    newLayers.push([x * layerPadding + padding, y * nodePadding + padding + middleY]);
                }
                network.push(newLayers);

                if (x == this.neuralNetwork.layerArray.length - 2) { // for the last layer // .length - 2 because the activation function is also a layer
                    const lastCount = layer.weights.rows();
                    const lastPadding = (height - padding * 2) / lastCount;
                    const lastMiddleY = (height - ((lastCount - 1) * lastPadding + padding * 2)) / 2; // to center the y position

                    let lastLayer = [];
                    for (let y = 0; y < lastCount; y++) {
                        lastLayer.push([(x + 1) * layerPadding + padding, y * lastPadding + padding + lastMiddleY]);
                    }
                    network.push(lastLayer);
                }
            }
        }
        return network;
    }
}