if (window.Notification) {
    if (Notification.permission === 'granted') {
        console.info('Notification is granted.');
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            if (permission === 'granted') {
                console.log('Got notification permission');
            }
            if (permission === 'default') {
                console.log('The permission request was dismissed.');
            }
            if (permission === 'denied') {
                console.log('Permission wasn\'t granted. Allow a retry.');
            }
        });
    }
}

export const notice = (title, options) => {
    if (!window.Notification) return;
    const notice = new Notification(title, {
        requireInteraction: true,
        ...options
    });

    notice.onclick = () => {
        if (window.DESKTOP && window.ipcRenderer) {
            window.ipcRenderer.send('notificationClick');
        }
        notice.close();
    };
};
