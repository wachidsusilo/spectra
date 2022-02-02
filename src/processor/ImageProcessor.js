
import { IMAGE_ANALYZER } from '../constants/constant'
import { getNaturalRect, getImageSize, getImageElement, setImageSrc, setImageMD5 } from './../variables/image'
import { setData } from './../variables/data'
import SparkMD5 from 'spark-md5'
import { getVideoSize, setVideoFrame } from './../variables/video';

const state = {
    extraction: false,
    merging: false,
    mergeWorker: null
}

export const cancelExtraction = () => {
    state.extraction = false
}

export const extractVideoFrame = (blob, onProgress, onFinish) => {
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    const frames = []
    state.extraction = true

    const seek = () => {
        if (!state.extraction) return
        if (video.readyState !== 4) {
            setTimeout(() => seek(), 10)
            return
        }
        context.drawImage(video, 0, 0)
        frames.push(canvas.toDataURL())
        video.currentTime = video.currentTime + (1 / 30)
        if (video.currentTime < video.duration) {
            if (onProgress) onProgress((video.currentTime / video.duration) * 100)
            setTimeout(() => seek(), 10)
        } else {
            setVideoFrame(frames, video.width, video.height)
            if (onFinish) onFinish(frames.length)
        }
    }

    video.onloadedmetadata = () => {
        video.width = video.videoWidth
        video.height = video.videoHeight
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        video.muted = true
        video.currentTime = 0
    }

    video.onloadeddata = () => {
        const checkDataReady = setInterval(() => {
            if (video.readyState === 4) {
                seek()
                clearInterval(checkDataReady)
            }
        }, 100)
    }

    video.src = URL.createObjectURL(blob)
}

export const cancelMerge = () => {
    state.merging = false
    if(state.mergeWorker) state.mergeWorker.terminate()
}

export const mergeFrame = (sources, onProgress, onFinish) => {
    const canvas = document.createElement('canvas')
    canvas.width = getVideoSize()[0]
    canvas.height = getVideoSize()[1]
    const context = canvas.getContext('2d')
    const img = new Image()
    const data = []
    let index = 0
    state.merging = true
    state.mergeWorker = null

    img.onload = () => {
        if(!state.merging) return
        context.drawImage(img, 0, 0)
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        data.push(imageData.data)
        index++
        if(index < sources.length) {
            setTimeout(() => img.src = sources[index], 10)
            if(onProgress) onProgress((index / sources.length) * 50)
        } else {
            const worker = new Worker('worker/FrameMerger.js')
            state.mergeWorker = worker
            worker.onmessage = (e) => {
                if(e.data.type === 'progress') {
                    if(onProgress) onProgress(e.data.value)
                } else if (e.data.type === 'result') {
                    state.mergeWorker = null
                    const imData = new ImageData(canvas.width, canvas.height)
                    imData.data.set(e.data.data)
                    context.putImageData(imData, 0, 0)
                    canvas.toBlob((blob) => {
                        getMD5(blob).then((md5) => {
                            setImageMD5(md5)
                        }).catch(e => console.log(e))
                    })
                    const base64 = canvas.toDataURL()
                    setImageSrc(base64, null, onFinish, null, true)
                }
            }

            worker.postMessage(data)
        }
    }

    img.src = sources[index]
}

export const analyzeImage = (onProgress, onFinish) => {
    if (!getImageElement()) return
    if (!getImageSize()) return
    if (!getNaturalRect()) return

    const rect = getNaturalRect()

    const imageWidth = getImageSize()[0]
    const imageHeight = getImageSize()[1]

    const canvas = document.createElement('canvas')
    canvas.width = imageWidth
    canvas.height = imageHeight

    const context = canvas.getContext('2d')
    context.drawImage(getImageElement(), 0, 0)

    const worker = new Worker('worker/ImageAnalyzer.js')
    worker.onmessage = (e) => {
        if (e.data.type === IMAGE_ANALYZER[0]) {
            if (onProgress) onProgress(e.data.value)
        } else if (e.data.type === IMAGE_ANALYZER[1]) {
            setData(e.data.data[0], e.data.data[1], false)
            if (onFinish) onFinish()
        }
    }

    worker.onerror = (e) => {
        console.log(e)
    }

    worker.postMessage(context.getImageData(rect.left, rect.top, rect.width, rect.height))
}

export const rotateImage = (image, onProgress, onFinish) => {
    if (!getImageElement()) return
    if (!getImageSize()) return

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.width = getImageSize()[0]
    canvas.height = getImageSize()[1]
    context.drawImage(getImageElement(), 0, 0)

    const worker = new Worker('worker/ImageRotator.js')
    worker.onmessage = (e) => {
        if (e.data.type === IMAGE_ANALYZER[0]) {
            if (onProgress) onProgress(e.data.value)
        } else if (e.data.type === IMAGE_ANALYZER[1]) {
            canvas.width = e.data.imageData.width
            canvas.height = e.data.imageData.height
            context.putImageData(e.data.imageData, 0, 0)
            const base64 = canvas.toDataURL()
            image.src = base64
            canvas.toBlob((blob) => {
                getMD5(blob).then((md5) => {
                    setImageMD5(md5)
                }).catch(e => console.log(e))
            })
            setImageSrc(base64, null, onFinish, 1)
        }
    }

    worker.onerror = (e) => {
        console.log(e)
    }

    worker.postMessage(context.getImageData(0, 0, canvas.width, canvas.height))
}

export const getMD5 = async (blob) => new Promise((resolve, reject) => {
    let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
        file = blob,
        chunkSize = 2097152,
        chunks = Math.ceil(file.size / chunkSize),
        currentChunk = 0,
        spark = new SparkMD5.ArrayBuffer(),
        fileReader = new FileReader()

    fileReader.onload = (e) => {
        spark.append(e.target.result)
        currentChunk++

        if (currentChunk < chunks) {
            loadNext()
        } else {
            resolve(spark.end())
        }
    }

    fileReader.onerror = (error) => {
        reject(error)
    }

    const loadNext = () => {
        let start = currentChunk * chunkSize,
            end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize
        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
    }
    loadNext()
})

export const convertRawData = (rawData, onProgress, onFinish) => {
    const worker = new Worker('worker/DataConverter.js')

    worker.onmessage = (e) => {
        if (e.data.type === IMAGE_ANALYZER[0]) {
            if (onProgress) onProgress(e.data.value)
        } else if (e.data.type === IMAGE_ANALYZER[1]) {
            setData(rawData, e.data.data, true)
            if (onFinish) onFinish()
        }
    }

    worker.onerror = (error) => {
        console.log(error)
    }

    worker.postMessage(rawData)
}