// 2018.05.04 21:33:46
function getCNTime(timestamp, isOnlyTime) {
    const date = new Date(timestamp);

    let hour = date.getHours();
    hour = hour < 10 ? `0${ hour }` : hour;
    let minutes = date.getMinutes();
    minutes = minutes < 10 ? `0${ minutes }` : minutes;
    let seconds = date.getSeconds();
    seconds = seconds < 10 ? `0${ seconds }` : seconds;

    if (isOnlyTime) {
        return `${ hour }:${ minutes }:${ seconds }`;
    }

    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month < 10 ? `0${ month }` : month;
    let day = date.getDate();
    day = day < 10 ? `0${ day }` : day;

    return `${ year }.${ month }.${ day } ${ hour }:${ minutes }:${ seconds }`;
}

// Jul-30-2018 07:23:00 AM
function getENTime(timestamp) {
    const date = new Date(timestamp);

    const month = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ][date.getMonth()];
    let day = date.getDate();
    day = day < 10 ? `0${ day }` : day;
    const year = date.getFullYear();


    let time = 'AM';
    let hour = date.getHours();
    if (hour > 12) {
        hour = hour - 12;
        time = 'PM';
    }
    hour = hour < 10 ? `0${ hour }` : hour;
    let minutes = date.getMinutes();
    minutes = minutes < 10 ? `0${ minutes }` : minutes;
    let seconds = date.getSeconds();
    seconds = seconds < 10 ? `0${ seconds }` : seconds;

    return `${ month }-${ day }-${ year } ${ hour }:${ minutes }:${ seconds } ${ time }`;
}

export default function (timestamp, lang, isOnlyTime) {
    return lang === 'zh' ? getCNTime(timestamp, isOnlyTime) : getENTime(timestamp);
}
