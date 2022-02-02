
const url = 'https://spectra-image-converter.herokuapp.com/convert';

export const convertImage = (blob) => new Promise((resolve, reject) => {
    const data = new FormData();
    data.append('img', blob, blob.name);
    fetch(url, {
        method: 'POST',
        body: data
    }).then(res => {
        res.blob().then((res) => {
            resolve(res);
        }).catch(e => reject(e))
    }).catch(err => reject(err));
})