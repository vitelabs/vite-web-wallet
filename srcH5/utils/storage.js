
const localStorage = window.localStorage;

export function setItem(key, data) {
    const saveData = typeof data === 'string' ? data : JSON.stringify(data);

    try {
        localStorage.setItem(getKey(key), saveData);
    } catch (err) {
        console.error(err);
    }
}

export function getItem(key) {
    let data;

    try {
        data = localStorage.getItem(getKey(key));
    } catch (err) {
        console.error(err);
        return null;
    }

    if (!data) {
        return null;
    }

    try {
        data = JSON.parse(data);
        return data;
    } catch (err) {
        return data;
    }
}

function getKey(name) {
    return `ViteMobileDex:${ name }`;
}
