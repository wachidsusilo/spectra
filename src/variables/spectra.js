import { v4 as UUID } from 'uuid';

const spectra = {
    data: [],
    dataset: {
        labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        datasets: [{
            borderColor: '#0d47a1',
            backgroundColor: '#0000ff55',
            label: 'data',
            data: []
        },]
    },
    properties: {
        id: 0,
        title: '',
        description: '',
        date: '',
        time: '',
        saved: false
    }
}


const zeroPad = (num, places) => {
    return String(num).padStart(places, '0');
}

export const setSpectra = (data) => {
    const date = new Date();
    spectra.dataset.labels = [...Array(data.length).keys()];
    spectra.dataset.datasets[0].data = data;
    spectra.data = data;
    spectra.properties.id = UUID();
    spectra.properties.title = '';
    spectra.properties.date = zeroPad(date.getDate(), 2) + '-' + zeroPad(date.getMonth(), 2) + '-' + date.getFullYear();
    spectra.properties.time = zeroPad(date.getHours(), 2) + ':' + zeroPad(date.getMinutes(), 2);
}

export const setSpectraTitle = (title) => {
    spectra.properties.title = title;
}

export const setSpectraDescription = (description) => {
    spectra.properties.description = description;
}

export const setSpectraSaved = (saved) => {
    spectra.properties.saved = saved;
}

export const setSpectraProperty = (meta, saved) => {
    spectra.properties.id = meta.id;
    spectra.properties.title = meta.title;
    spectra.properties.description = meta.description;
    spectra.properties.date = meta.date;
    spectra.properties.time = meta.time;
    spectra.properties.saved = saved ? saved : false;
}

export const getSpectra = () => {
    return spectra.data;
}

export const getSpectraDataset = () => {
    return spectra.dataset;
}

export const getSpectraProperties = () => {
    return spectra.properties;
}
