import toast from 'components/toast/index.js';
import bigNumber from 'utils/bigNumber';
import date from 'utils/date';
import ellipsisAddr from 'utils/ellipsisAddr.js';

document.addEventListener('drop', e => {
    e.preventDefault();
    e.stopPropagation();
});
document.addEventListener('dragover', e => {
    e.preventDefault();
    e.stopPropagation();
});

export default {
    install(Vue) {
        Vue.prototype.$onKeyDown = function (_code, cb) {
            const lastEvent = window.document.onkeydown;
            window.document.onkeydown = e => {
                e = e || window.event;
                const code = e.keyCode || e.which;
                if (!code || code !== _code) {
                    return;
                }
                e.preventDefault();
                if (cb) {
                    return cb();
                }
                return false;
            };
            return lastEvent;
        };

        Vue.prototype.$offKeyDown = function () {
            window.document.onkeydown = null;
        };

        Vue.prototype.$trim = (msg = '') => msg.replace(/(^\s*)|(\s*$)/g, '');

        Vue.prototype.$toast = function (message, err, type, position) {
            if (!err) {
                toast(message, type, position);
                return;
            }

            const error = err && err.error ? err.error : err || null;
            const code = error ? error.code || -1 : -1;
            const errMsg = error ? error.message || error.msg || '' : '';

            // code 11000 wc error
            // 11012 用户拒绝
            // 11020 链接断开
            // 11021 用户关闭弹窗，继续下面操作

            // code 12000 web error
            // code 12001 未解锁
            // code 12002 无激活账户
            // code 1000001 Show quota confirm, don't neet toast

            if ([ 1000001, 11012, 11020, 11021, 12001 ].indexOf(+code) !== -1) {
                return;
            }

            if (!this || !this.$t) {
                return;
            }

            let msg = code === -1 || !this.$i18n.messages.zh.errCode[Math.abs(code)]
                ? message || this.$t('hint.err')
                : this.$t(`errCode.${ Math.abs(code) }`);
            if (Math.abs(code) === 32002) {
                msg = `${ errMsg } (${ code })`;
            }
            if (code > 0) {
                msg = `${ msg } (${ code })`;
            }
            toast(msg, type, position);
        };

        // ----------filters

        Vue.filter('date', function (value, locale, isOnlyTime) {
            return date(value, locale, isOnlyTime);
        });
        Vue.filter('formatNum', function (value, decimal, number) {
            return bigNumber.formatNum(value, decimal, number);
        });
        Vue.filter('toBasic', function (num, minUnit, decimalPlaces) {
            return bigNumber.toBasic(num, minUnit, decimalPlaces);
        });
        Vue.filter('toMin', function (num, decimal, fix) {
            return bigNumber.formatNum(num, decimal, fix);
        });

        // 短地址
        Vue.filter('shortAddr', function (address, length = 5) {
            if (!address || address.length < 11) return address;
            return ellipsisAddr(address, length);
        });

        // 百分比
        Vue.filter('percentage', function (num, decimal) {
            return `${ bigNumber.formatNum(bigNumber.multi(num, 100), decimal) }%`;
        });

        // Filters for depth

        /*
            This used for format num in depth, some value bigger than 1e7 should set fix to 0
            if stay the original fix, there will be some layout bugs.
        */
        Vue.filter('depthFormatNum', function (value, decimal) {
            let number = decimal;
            // If value > 1e7，set fix number to 0.
            if (bigNumber.compared(value, Math.pow(10, 7)) === 1) {
                number = 0;
            }
            return bigNumber.formatNum(value, decimal, number);
        });
    }
};
