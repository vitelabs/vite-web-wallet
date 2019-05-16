import { pwdConfirm } from 'components/password/index.js';
import localStorage from 'utils/store';

const HoldPwdKey = 'isHoldPWD';

class account {
    holdPWD(pwd) {
        this.pass = pwd;
        this.isHoldPWD = true;
        localStorage.setItem(HoldPwdKey, true);
    }

    releasePWD() {
        this.isHoldPWD = false;
        localStorage.setItem(HoldPwdKey, false);
    }

    initPwd({
        showMask = true,
        title,
        submit = () => {},
        cancel = () => {},
        content = '',
        submitTxt = '',
        cancelTxt = '',
        exchange = false
    }, isConfirm = false) {
        const isHide = !isConfirm && this.isHoldPWD;

        if (isHide) {
            submit && submit();
            return true;
        }

        pwdConfirm({ showMask, title, submit, content, cancel, cancelTxt, submitTxt, exchange }, !this.isHoldPWD);
        return false;
    }
}

export default account;
