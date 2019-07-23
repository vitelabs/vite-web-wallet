export default class eventEmitter {
    constructor() {
        this.eventList = [];
    }

    on(name, cb) {
        const event = {
            name,
            cb
        };
        this.eventList.push(event);

        return event;
    }

    emit(name, data) {
        this.eventList.forEach(event => {
            event.name === name && event.cb && event.cb(data);
        });
    }

    off(event) {
        if (!event) {
            return;
        }

        let i;
        for (i = 0; i < this.eventList.length; i++) {
            if (event === this.eventList[i]) {
                break;
            }
        }

        (i !== this.eventList.length) && this.eventList.splice(i, 1);
    }
}
