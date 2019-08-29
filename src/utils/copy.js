import { isIOS } from 'utils/platform';

export default function (value) {
    const el = document.createElement('textarea');
    el.style.position = 'absolute';
    el.style.top = '-9999px';
    document.body.appendChild(el);
    el.contentEditable = true;
    el.readOnly = true;
    el.value = value;

    if (isIOS()) {
        const range = document.createRange();
        range.selectNodeContents(el);
        const s = window.getSelection();
        s.removeAllRanges();
        s.addRange(range);
        el.setSelectionRange(0, 999999); // A big number, to cover anything that could be inside the element.
    } else {
        el.select();
    }

    document.execCommand('copy');
    document.body.removeChild(el);
}
