export function execWithRecaptcha(fn, ...args) {
    const ele = document.createElement('div');
    ele.classList.add('g-recaptcha', 'g-recaptcha-custom-style');
    document.body.append(ele);
    const reset = () => {
        try {
            document.body.removeChild(ele);
        } catch (e) {
            console.log(e);
        }
        grecaptcha.reset(id);
    };

    const id = grecaptcha.render(ele, {
        sitekey: import.meta.env.VITE_RECAPTCHA_TOKEN,
        callback: () => {
            reset();
            fn(...args);
        },
        'expired-callback': () => {
            reset();
            console.log('expireddddd');
        },
        'error-callback': () => {
            reset();
            console.log('errorrrr');
        }
    });
}
