const _extractHostname = (url) => {
    let hostname;
    if (url.indexOf('//') > -1) {
        // eslint-disable-next-line prefer-destructuring
        hostname = url.split('/')[2];
    } else {
        [hostname] = url.split('/');
    }

    [hostname] = hostname.split(':');
    [hostname] = hostname.split('?');

    return hostname;
};
const _extractRootDomain = (url) => {
    let domain = _extractHostname(url);
    const splitArr = domain.split('.');
    const arrLen = splitArr.length;

    if (arrLen > 3) {
        domain = `${splitArr[arrLen - 3]}.${splitArr[arrLen - 2]}.${splitArr[arrLen - 1]}`;
        if (splitArr[arrLen - 2].length === 2 && splitArr[arrLen - 1].length === 2 && arrLen > 4) {
            domain = `${splitArr[arrLen - 4]}.${domain}`;
        }
    }
    return domain;
};

export const createCookie = (name, value, days) => {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = `; expires=${date.toUTCString()}`;
    } else {
        expires = '';
    }

    document.cookie = `${name}=${value}${expires}; domain=${_extractRootDomain(window.location.href)}; path=/;`;
};

export const getCookie = (name) => {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');

    let value = null;
    ca.forEach((c) => {
        let val = c;
        while (val.charAt(0) === ' ') { val = val.substring(1, val.length); }
        if (val.indexOf(nameEQ) === 0) { value = val.substring(nameEQ.length, val.length); }
    });

    return value;
};

export const deleteCookie = (name) => {
    createCookie(name, '', -1);
};
