
const device = {
    current: undefined,
    list: []
}

export const setActiveDevice = (index) => {
    device.current = device.list[index];
}

export const setDeviceList = (list) => {
    device.list = list;
    if(device.list.length > 0) {
        if(device.current) {
            const index = device.list.findIndex(o => o.id === device.current.id);
            if(index >= 0) device.current = device.list[index];
            else device.current = undefined;
        }
    } else {
        device.current = undefined;
    }
}

export const getActiveDevice = () => {
    return device.current;
}

export const getDeviceList = () => {
    return device.list;
}
