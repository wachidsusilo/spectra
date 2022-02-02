
const image = {
    md5: undefined,
    base64: undefined,
    size: undefined,
    element: undefined,
    rotation: 0,
    blob: undefined
}

const rect = {
    natural: undefined,
    default: undefined
}

export const setImageSrc = (base64, setEditMode, onFinish, rotation, reset) => {
    image.base64 = base64
    image.element = document.createElement('img')
    image.element.src = base64
    image.element.onload = () => {
        image.size = [image.element.naturalWidth, image.element.naturalHeight]
        if (rotation) image.rotation += rotation
        if (image.rotation > 3) image.rotation = 0
        if (reset) image.rotation = 0
        if (setEditMode) {
            setEditMode(false)
            setEditMode(true)
        }
        if (onFinish) onFinish()
    }
}

export const setImageMD5 = (md5) => {
    image.md5 = md5
}

export const setRect = (boundary, scaleRatio) => {
    if (!boundary.top && !boundary.left && !boundary.width && !boundary.height && isNaN(boundary.top) && isNaN(boundary.left) && isNaN(boundary.width) && isNaN(boundary.height)) return
    rect.natural = {
        width: Math.round(boundary.width * scaleRatio) < 1 ? 1 : Math.round(boundary.width * scaleRatio),
        height: Math.round(boundary.height * scaleRatio) < 1 ? 1 : Math.round(boundary.height * scaleRatio),
        top: Math.round(boundary.top * scaleRatio),
        left: Math.round(boundary.left * scaleRatio)
    }
}

export const setNaturalRect = (type, value) => {
    switch (type) {
        case 'x':
            rect.natural.left = value
            break
        case 'y':
            rect.natural.top = value
            break
        case 'w':
            rect.natural.width = value
            break
        default:
            rect.natural.height = value
            break
    }
}

export const setDefaultRect = () => {
    rect.default = JSON.parse(JSON.stringify(rect.natural))
    localStorage.setItem('default-rect', JSON.stringify(rect.default))
}

export const getImageSrc = () => {
    return image.base64
}

export const getImageMD5 = () => {
    return image.md5
}

export const getImageSize = () => {
    return image.size
}

export const getImageElement = () => {
    return image.element
}

export const getNaturalRect = () => {
    return rect.natural
}

export const loadDefaultRect = () => {
    if (localStorage.getItem('default-rect')) {
        rect.default = JSON.parse(localStorage.getItem('default-rect'))
        rect.natural = JSON.parse(localStorage.getItem('default-rect'))
    }
}

export const getDefaultRect = () => {
    if (!rect.default && localStorage.getItem('default-rect')) {
        rect.default = JSON.parse(localStorage.getItem('default-rect'))
    }
    return rect.default
}

export const getImageRotation = () => {
    return image.rotation
}
