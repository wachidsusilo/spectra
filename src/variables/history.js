
const history = {
    spectrometer: [],
    analyzer: []
};

const strToUnix = (o) => {
    const dates = o.date.split('-');
    const times = o.time.split(':');
    const date = new Date(dates[2], dates[1] - 1, dates[0], times[0], times[1], 0, 0);
    return date.getTime();
}

export const setAnalyzerHistory = (data) => {
    history.analyzer = data;
    if (history.analyzer.length > 1) {
        history.analyzer.sort((a, b) => {
            if (strToUnix(a) > strToUnix(b)) return -1;
            if (strToUnix(a) < strToUnix(b)) return 1;
            return 0;
        })
    }
}

export const setSpectrometerHistory = (data) => {
    history.spectrometer = data;
    if (history.spectrometer.length > 1) {
        history.spectrometer.sort((a, b) => {
            if (strToUnix(a) > strToUnix(b)) return -1;
            if (strToUnix(a) < strToUnix(b)) return 1;
            return 0;
        })
    }
}

export const getSpectrometerHistory = () => {
    return history.spectrometer;
}

export const getAnalyzerHistory = () => {
    return history.analyzer;
}
