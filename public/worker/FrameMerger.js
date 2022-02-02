
onmessage = (e) => {
    const data = e.data
    const avg = []

    let counter = 0, val = 0, lastVal = 0
    const incrementProgress = (start, end) => {
        val = Math.round((start + (++counter / (data.length * data[0].length)) * (end - start)) * 10) / 10
        if(lastVal !== val) {
            lastVal = val
            postMessage({ type: 'progress', value: val })
        }
    }

    for (let i = 0; i < data[0].length; i++) {
        let val = 0
        for (let j = 0; j < data.length; j++) {
            val += data[j][i]
            incrementProgress(50, 100)
        }
        avg.push(val / data.length)
    }

    postMessage({ type: 'result', data: avg })
    close()
}