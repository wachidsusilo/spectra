
const analyzerMeta = [];

const spectrometerMeta = [];

export const updateAnalyzerMeta = (meta) => {
    const index = analyzerMeta.findIndex(o => (o.id === meta.id));
    if(index < 0){
        analyzerMeta.push(meta);
    } else {
        analyzerMeta[index] = meta;
    }
}

export const updateSpectrometerMeta = (meta) => {
    const index = spectrometerMeta.findIndex(o => (o.id === meta.id));
    if(index < 0){
        spectrometerMeta.push(meta);
    } else {
        spectrometerMeta[index] = meta;
    }
}

export const removeAnalyzerMeta = (meta) => {
    const index = analyzerMeta.findIndex(o => (o.id === meta.id));
    if(index >= 0) {
        analyzerMeta.splice(index, 1);
    }
}

export const removeSpectrometerMeta = (meta) => {
    const index = spectrometerMeta.findIndex(o => (o.id === meta.id));
    if(index >= 0) {
        spectrometerMeta.splice(index, 1);
    }
}

export const setAnalyzerMeta = (metas) => {
    analyzerMeta.splice(0);
    analyzerMeta.push(...metas);
}

export const setSpectrometerMeta = (metas) => {
    spectrometerMeta.splice(0);
    spectrometerMeta.push(...metas);
}

export const getAnalyzerMeta = () => {
    return analyzerMeta;
}

export const getSpectrometerMeta = () => {
    return spectrometerMeta;
}