
onmessage = (e) => {
    const imageData = e.data;
    const width = imageData.width;
    const height = imageData.height;
    const data = [];
    let counter = 0, val = 0, lastVal;
    for(let i = width - 1; i >= 0; i--) {
        for(let j = 0; j < height; j++){
            data.push(imageData.data[(j * width + i) * 4]);
            data.push(imageData.data[(j * width + i) * 4 + 1]);
            data.push(imageData.data[(j * width + i) * 4 + 2]);
            data.push(imageData.data[(j * width + i) * 4 + 3]);
            val = Math.round(++counter / (imageData.width * imageData.height) * 100);
            if (val !== lastVal) {
                lastVal = val;
                postMessage({ type: 'progress', value: val })
            }
        }
    }
    const res = new ImageData(height, width);
    res.data.set(data);

    postMessage({ type: 'result', imageData: res });
    close();
}