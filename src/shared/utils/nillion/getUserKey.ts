import * as nillion from '@nillion/client-web';

export const getUserKey = () => {
    // const userKey = window.localStorage.getItem('nillion:userKey');

    // if (!userKey) {
    const userKey = nillion.UserKey.generate();

    // window.localStorage.setItem('nillion:userKey', userKey.);

    return userKey;
    // }

    // return userKey;
};
