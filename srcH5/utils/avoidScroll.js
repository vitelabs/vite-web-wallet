let startPosY;
let startPosX;
let curPosY;
let curPosX;

let stat = false;

const defaultConfig = {
    isExtraElement(element) {
        return element.tagName === 'INPUT' && element.type === 'range';
    }
};
const config = {};

const notPreventScrollElement = function (element) {
    return config.isExtraElement(element) || isScrollElement(element);
};

const isScrollElement = function (element) {
    while (element) {
        const style = window.getComputedStyle(element).position;
        if (style.overflowY === 'hidden' || style.overflowX === 'hidden') {
            return false;
        }

        if (checkIsScrollElementWhileScroll(element)) {
            return element;
        }
        element = element.parentElement;
    }
    return false;
};

const checkIsScrollElementWhileScroll = function (element) {
    const style = window.getComputedStyle(element);
    // console.log(style);
    // console.log(element, element.scrollHeight, element.clientHeight, startPosX, startPosY);
    return (
        (style.overflowY === 'scroll' || style.overflowY === 'auto')
        && (
            element.scrollHeight > element.clientHeight
            && !(startPosY <= curPosY && element.scrollTop === 0)
            && !(startPosY >= curPosY && element.scrollHeight - element.scrollTop === element.clientHeight)
        )
        || (style.overflowX === 'scroll' || style.overflowX === 'auto')
        && element.scrollWidth > element.clientWidth
            && !(startPosX <= curPosX && element.scrollLeft === 0)
            && !(startPosX >= curPosX && element.scrollWidth - element.scrollLeft === element.clientWidth)
    );
};

// bind
const bindFunc = {
    move(e) {
        curPosY = e.touches ? e.touches[0].screenY : e.screenY;
        curPosX = e.touches ? e.touches[0].screenX : e.screenX;

        if (notPreventScrollElement(e.target)) {
            return;
        }
        e.defaultPrevented || e.preventDefault();
    },
    start(e) {
        startPosY = e.touches ? e.touches[0].screenY : e.screenY;
        startPosX = e.touches ? e.touches[0].screenX : e.screenX;
    }
};
const api = {
    bind() {
        if (!stat) {
            stat = true;
            let supportsPassive = false;
            try {
                const opts = Object.defineProperty({}, 'passive', {
                    get: function () {
                        supportsPassive = true;
                        return supportsPassive;
                    }
                });
                window.addEventListener('test', null, opts);
            } catch (e) {
                console.warn(e);
            }

            document.addEventListener('touchmove', bindFunc.move, supportsPassive ? { passive: false } : false);
            document.addEventListener('touchstart', bindFunc.start, supportsPassive ? { passive: false } : false);
        }
        return this;
    },
    config(cfg) {
        cfg = cfg || {};
        config.isExtraElement = cfg.isExtraElement || defaultConfig.isExtraElement;
        return this;
    },
    move(nodes, target) {
        nodes = nodes || ('all' in document
            ? [].filter.call(document.all, el => window.getComputedStyle(el).position === 'fixed')
            : []);
        target = target || document.body;
        [].forEach.call(nodes, el => {
            target.appendChild(el);
        });
        return this;
    },
    destory() {
        stat = false;
        document.removeEventListener('touchmove', bindFunc.move, false);
        document.removeEventListener('touchstart', bindFunc.start, false);
    }
};

// if (typeof module !== 'undefined') {
//     module.exports = api;
// }

api.config();
api.bind();
