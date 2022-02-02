import { v4 as UUID } from 'uuid';
import { getImageMD5 } from './image';

const data = {
    raw: [],
    dataset: {
        labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        datasets: [{
            borderColor: '#b71c1c',
            backgroundColor: '#ff000055',
            label: 'red',
            data: []
        }, {
            borderColor: '#1b5e20',
            backgroundColor: '#00ff0055',
            label: 'green',
            data: []
        }, {
            borderColor: '#0d47a1',
            backgroundColor: '#0000ff55',
            label: 'blue',
            data: []
        }, {
            borderColor: '#313131',
            backgroundColor: '#31313155',
            label: 'total',
            data: []
        }]
    },
    property: {
        id: 0,
        imageHash: '',
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

export const setData = (raw, dataset, saved) => {
    const date = new Date();
    data.raw = raw;
    data.dataset.labels = dataset[0];
    data.dataset.datasets[0].data = dataset[1];
    data.dataset.datasets[1].data = dataset[2];
    data.dataset.datasets[2].data = dataset[3];
    data.dataset.datasets[3].data = dataset[4];
    data.property.id = UUID();
    data.property.title = '';
    data.property.date = zeroPad(date.getDate(), 2) + '-' + zeroPad(date.getMonth(), 2) + '-' + date.getFullYear();
    data.property.time = zeroPad(date.getHours(), 2) + ':' + zeroPad(date.getMinutes(), 2);
    data.property.imageHash = getImageMD5();
    data.property.saved = saved;
}

export const setDataTitle = (title) => {
    data.property.title = title;
}

export const setDataDescription = (description) => {
    data.property.description = description;
}

export const setDataSaved = (saved) => {
    data.property.saved = saved;
}

export const setDataProperty = (meta, saved) => {
    data.property.id = meta.id;
    data.property.imageHash = meta.imageHash;
    data.property.title = meta.title;
    data.property.description = meta.description;
    data.property.date = meta.date;
    data.property.time = meta.time;
    data.property.saved = saved ? saved : false;
}

export const getRawData = () => {
    return data.raw;
}

export const getDataset = (rgbRef) => {
    if (rgbRef) {
        const r = rgbRef.current.red, g = rgbRef.current.green, b = rgbRef.current.blue, t = rgbRef.current.total;
        const dataset = {
            labels: data.dataset.labels,
            datasets: []
        }
        if (r) dataset.datasets.push(data.dataset.datasets[0]);
        if (g) dataset.datasets.push(data.dataset.datasets[1]);
        if (b) dataset.datasets.push(data.dataset.datasets[2]);
        if (t) dataset.datasets.push(data.dataset.datasets[3]);
        if (!r && !g && !b && !t) {
            dataset.datasets = [{
                borderColor: '#b71c1c',
                backgroundColor: '#ff000055',
                label: 'red',
                data: []
            }, {
                borderColor: '#1b5e20',
                backgroundColor: '#00ff0055',
                label: 'green',
                data: []
            }, {
                borderColor: '#0d47a1',
                backgroundColor: '#0000ff55',
                label: 'blue',
                data: []
            }, {
                borderColor: '#313131',
                backgroundColor: '#31313155',
                label: 'total',
                data: []
            }]
        }
        return dataset;
    }
    return data.dataset;
}

export const getDataProperty = () => {
    return data.property;
}

export const getImageHash = () => {
    return data.imageHash;
}

export const clearData = () => {
    data.raw = [];
    data.dataset.labels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    data.dataset.datasets[0].data = [];
    data.dataset.datasets[1].data = [];
    data.dataset.datasets[2].data = [];
    data.dataset.datasets[3].data = [];
    data.property.id = 0;
    data.property.title = '';
    data.property.date = '';
    data.property.time = '';
    data.property.imageHash = '';
}

