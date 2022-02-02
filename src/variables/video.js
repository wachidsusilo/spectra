
const video = {
    frames: [],
    size: []
}

export const setVideoFrame = (frames, width, height) => {
    video.frames = frames
    video.size = [width, height]
}

export const getVideoFrames = (from, to) => {
    return video.frames.slice(from, to)
}

export const getVideoSize = () => {
    return video.size
}

export const isVideoFramesAvailable = () => {
    return video.frames.length > 0
}