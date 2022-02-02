
onmessage = (e) => {
    const imageData = e.data;
    const width = imageData.width;
    const height = imageData.height;

    const orientation = width <= height;
    const index = [];
    for (let i = 0; i < (orientation ? height : width); i++) {
        index.push(i);
    }

    let counter = 0, val = 0, lastVal;
    const incrementProgress = (start, end) => {
        val = start + Math.round((++counter / (width * height)) * (end - start));
        if (val !== lastVal) {
            lastVal = val;
            postMessage({ type: 'progress', value: val })
        }
    }

    let rawData = [];
    if (orientation) {
        rawData = imageData.data;
    } else {
        for (let i = width - 1; i >= 0; i--) {
            for (let j = 0; j < height; j++) {
                const index = (j * width + i) * 4;
                rawData.push(imageData.data[index]);
                rawData.push(imageData.data[index + 1]);
                rawData.push(imageData.data[index + 2]);
                rawData.push(imageData.data[index + 3]);
                incrementProgress(0, 50);
            }
        }
    }

    const data = [];
    const dataR = [];
    const dataG = [];
    const dataB = [];
    const dataTotal = [];
    counter = 0;
    for (let i = 0; i < (orientation ? height : width); i++) {
        let r = 0, g = 0, b = 0;
        for (let j = 0; j < (orientation ? width : height); j++) {
            const index = (i * (orientation ? width : height) + j) * 4;
            r += rawData[index];
            g += rawData[index + 1];
            b += rawData[index + 2];
            incrementProgress(orientation ? 0 : 50, 100);
        }
        if (orientation) {
            data.push([Math.round(r / (orientation ? width : height)), Math.round(g / (orientation ? width : height)), Math.round(b / (orientation ? width : height))]);
            dataR.push(Math.round(r / (orientation ? width : height)));
            dataG.push(Math.round(g / (orientation ? width : height)));
            dataB.push(Math.round(b / (orientation ? width : height)));
            dataTotal.push(dataR[i] + dataG[i] + dataB[i]);
        } else {
            data.unshift([Math.round(r / (orientation ? width : height)), Math.round(g / (orientation ? width : height)), Math.round(b / (orientation ? width : height))]);
            dataR.unshift(Math.round(r / (orientation ? width : height)));
            dataG.unshift(Math.round(g / (orientation ? width : height)));
            dataB.unshift(Math.round(b / (orientation ? width : height)));
            dataTotal.push(dataR[i] + dataG[i] + dataB[i]);
        }
    }

    postMessage({ type: 'result', data: [data, [index, dataR, dataG, dataB, dataTotal]] });
    close();
}
