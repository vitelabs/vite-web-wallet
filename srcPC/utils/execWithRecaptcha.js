export function execWithRecaptcha(fn,...args) {
    return grecaptcha.enterprise.ready(function () {
        grecaptcha.enterprise
            .execute('6LftcmEfAAAAAIPegCWaLgMAylian8xtsuUou9C7', { action: 'submit' })
            .then(function () {
                return fn(...args);
            })
            .catch(e => {
            });
    });
}
