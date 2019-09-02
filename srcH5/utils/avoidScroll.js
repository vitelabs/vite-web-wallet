let startPosY;
let startPosX;
let curPosY;
let curPosX;

let stat = false;

const defaultConfig = {
    isExtraElement(element) {
        switch (true) {
        case element.tagName === 'INPUT' && element.type === 'range':
            return true;
        default:
            return false;
        }
    }
};
const config = {};

const notPreventScrollElement = function (element) {
    return config.isExtraElement(element) || isScrollElement(element, true);
};

const isScrollElement = function (element, whileTouch) {
    const checkFunc = whileTouch ? checkIsScrollElementWhileTouch : checkIsScrollElementWhileScroll;
    while (element) {
        if (checkFunc(element)) {
            return element;
        }
        element = element.parentElement;
    }
    return false;
};
const checkIsScrollElementWhileTouch = function (element) {
    const style = window.getComputedStyle(element);
    let tmp;
    let check;

    if (style.overflowY === 'scroll' && element.scrollHeight > element.clientHeight) {
        check = true;
        if (element.scrollTop === 0) {
            element.scrollTop = 1;
        }
        tmp = element.scrollHeight - element.clientHeight;
        if (tmp === element.scrollTop) {
            element.scrollTop = tmp - 1;
        }
    }
    if (style.overflowX === 'scroll' && element.scrollWidth > element.clientWidth) {
        check = true;
        if (element.scrollLeft === 0) {
            element.scrollLeft = 1;
        }
        tmp = element.scrollWidth - element.clientWidth;
        if (tmp === element.scrollLeft) {
            element.scrollLeft = tmp - 1;
        }
    }
    if (check) {
        return element;
    }
};
const checkIsScrollElementWhileScroll = function (element) {
    const style = window.getComputedStyle(element);

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
        notPreventScrollElement(e.target) || (e.defaultPrevented || e.preventDefault());
    },
    start(e) {
        // const target = isScrollElement(e.target, true);
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

if (typeof module !== 'undefined') {
    module.exports = api;
}

api.config();
api.bind();
