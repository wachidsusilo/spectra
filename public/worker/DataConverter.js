
onmessage = (e) => {
    const label = [];
    const dataR = [];
    const dataG = [];
    const dataB = [];
    const dataTotal = [];

    let counter = 0, val = 0, lastVal;
    const incrementProgress = (start, end) => {
        val = start + Math.round((++counter / e.data.length) * end);
        if (val !== lastVal) {
            lastVal = val;
            postMessage({ type: 'progress', value: val })
        }
    }

    for (let i = 0; i < e.data.length; i++) {
        label.push(i);
        dataR.push(e.data[i][0]);
        dataG.push(e.data[i][1]);
        dataB.push(e.data[i][2]);
        dataTotal.push(dataR[i] + dataG[i] + dataB[i]);
        incrementProgress(10, 100);
    }

    postMessage({ type: 'result', data: [label, dataR, dataG, dataB, dataTotal] });
    close();
}