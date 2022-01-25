import jwt_decode from "jwt-decode";
import * as requester from 'services/requester';
import * as api from 'services/api';

const ACCESS_TOKEN = 'ACCESS-TOKEN';
const X_CSRF_TOKEN = 'x-csrf-token';

export const loginJWT = async (data) => {
    try {
        const result = await requester.post(api.loginAuth(), data);
        if(!result.accessToken) { throw result }
        sessionStorage.setItem(ACCESS_TOKEN, result.accessToken);
        const decodedJwt = jwt_decode(result.accessToken);

        return decodedJwt;
    } catch(err) {
        console.log(JSON.parse(err.errors[0].rejectedValue));
        return err.message ? err.message : 'Login auth failed!';
    }
}

export const getFirstPartyCookie = async () => {
    try {
        const result = await requester.get(api.firstPartyCookie());
        return result;
    } catch(err) {
        return err.message ? err.message : 'Get FPC failed!';
    }
}

export const getToken = () => {
    try {
        let token = 'Bearer ' + sessionStorage.getItem(ACCESS_TOKEN);
        return token;
    } catch(err) {
        console.log('[authService.js] getToken() failed!');
    }
};

export const getCsrfToken = () => {
    try {
        let csrfToken = sessionStorage.getItem(X_CSRF_TOKEN);
        console.log(csrfToken);
        return csrfToken;
    } catch(err) {
        console.log('[authService.js] getCsrfToken() failed!');
    }
};