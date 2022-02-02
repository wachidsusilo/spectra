
onmessage = (e) => {
    const canvas = new OffscreenCanvas(e.data.size[0], e.data.size[1])
    postMessage(e.data.element)
    close()
}