class Visualizer {
    static drawNetwork(ctx, network) {
        const margin = 50;
        const left = margin;
        const top = margin;
        const width = ctx.canvas.width - margin * 2;
        const right = left + width;
        const height = ctx.canvas.height - margin * 2;

        // const levelHeight=height/network.levels.length;
        const layerTops = [];
        for (let i = 0; i < network.levels.length + 1; i++) {
            layerTops.push(top + lerp(height, 0, i / network.levels.length))
        }

        for (let i = 0; i < network.levels.length; i++) {
            Visualizer.drawWeights(ctx, network.levels[i], left, right, layerTops[i], layerTops[i + 1]);
        }

        //draw input layer
        Visualizer.drawNodes(ctx, network.levels[0].inputs, left, layerTops[0], right);

        //draw output layer including hidden
        for (let i = 0; i < network.levels.length; i++) {
            Visualizer.drawNodes(ctx, network.levels[i].outputs, left, layerTops[i + 1], right);
            Visualizer.drawBiases(ctx, network.levels[i].biases, left, layerTops[i + 1], right);
        }
        // Visualizer.drawLevel(ctx, network.levels[0], left, top, width, height);
        //label output
        Visualizer.labelOutput(ctx, ['\uD83E\uDC09', '\uD83E\uDC08', '\uD83E\uDC0A', '\uD83E\uDC0B'], left, layerTops[layerTops.length - 1], right);
    }

    static drawNodes(ctx, values, left, top, right) {

        const nodeRadius = 18;
        for (let i = 0; i < values.length; i++) {
            const x = lerp(left, right, Visualizer.#getLerpT(values, i));
            ctx.beginPath();
            ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = getRGBA(values[i]);
            ctx.fill();
        }
    }

    static drawBiases(ctx, values, left, top, right) {

        const nodeRadius = 18;
        for (let i = 0; i < values.length; i++) {
            const x = lerp(left, right, Visualizer.#getLerpT(values, i));

            ctx.beginPath();
            ctx.lineWidth = 2
            ctx.arc(x, top, nodeRadius * 0.8, 0, Math.PI * 2);
            ctx.strokeStyle = getRGBA(values[i]);
            // ctx.setLineDash([3, 3]);
            ctx.stroke();
            // ctx.setLineDash([]);
        }
    }

    static drawWeights(ctx, level, left, right, top, bottom) {

        const { inputs, outputs, weights } = level;
        for (let i = 0; i < inputs.length; i++) {
            for (let j = 0; j < outputs.length; j++) {
                ctx.beginPath();
                ctx.moveTo(lerp(left, right, Visualizer.#getLerpT(inputs, i)), top);
                ctx.lineTo(lerp(left, right, Visualizer.#getLerpT(outputs, j)), bottom);
                ctx.lineWidth = 2;
                ctx.strokeStyle = getRGBA(weights[i][j]);
                ctx.setLineDash([7, 3]);
                ctx.stroke();
            }
        }
    }

    static labelOutput(ctx, labels, left, top, right) {

        const nodeRadius = 18;
        for (let i = 0; i < labels.length; i++) {
            const x = lerp(left, right, Visualizer.#getLerpT(labels, i));

            ctx.beginPath();
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "black";
            ctx.strokeStyle = "white";
            ctx.font = (nodeRadius * 1.5) + "px Arial";
            ctx.fillText(labels[i], x, top + nodeRadius * 0.1);
            ctx.lineWidth = 0.5;
            ctx.strokeText(labels[i], x, top + nodeRadius * 0.1);
        }

    }

    static drawLevel(ctx, level, left, top, width, height) {
        const right = left + width;
        const bottom = top + height;

        const { inputs, outputs, weights, biases } = level;

        for (let i = 0; i < inputs.length; i++) {
            for (let j = 0; j < outputs.length; j++) {
                ctx.beginPath();
                ctx.moveTo(lerp(left, right, Visualizer.#getLerpT(inputs, i)), bottom);
                ctx.lineTo(lerp(left, right, Visualizer.#getLerpT(outputs, j)), top);
                ctx.lineWidth = 2;
                ctx.strokeStyle = getRGBA(weights[i][j]);
                ctx.stroke();
            }
        }

        const nodeRadius = 18;
        for (let i = 0; i < inputs.length; i++) {
            const x = lerp(left, right, Visualizer.#getLerpT(inputs, i));
            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = getRGBA(inputs[i]);
            ctx.fill();
        }


        for (let i = 0; i < outputs.length; i++) {
            const x = lerp(left, right, Visualizer.#getLerpT(outputs, i));

            ctx.beginPath();
            ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = getRGBA(outputs[i]);
            ctx.fill();

            ctx.beginPath();
            ctx.lineWidth = 2
            ctx.arc(x, top, nodeRadius * 0.8, 0, Math.PI * 2);
            ctx.strokeStyle = getRGBA(biases[i]);
            ctx.setLineDash([3, 3]);
            ctx.stroke();
            ctx.setLineDash([]);
        }



    }

    static #getLerpT(nodes, index) {
        return nodes.length == 1 ? 0.5 : index / (nodes.length - 1);
    }
}