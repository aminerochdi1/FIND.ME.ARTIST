import Cookies from 'js-cookie'
import config from "../config.json"

export async function getSessionWithCookies(cookies) {
    return cookies["userSession"];
}

export async function getSessionWithServerSideProps(req) {
    const token = await getSessionWithCookies(req.cookies);
    if (token === undefined) return null;

    const response = await fetch(config.API + "/user/session/check", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            { token }
        )
    });
    const responseData = await response.json();
    if (response.status >= 200 && response.status < 300) {
        const { user } = responseData;
        return user;
    }
    return null;
}

export async function fetchUser() {
    const token = getSession();

    const response = await fetch(config.API + "/user/session/check", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            { token }
        )
    });
    const responseData = await response.json();
    if (response.status >= 200 && response.status < 300) {
        const { user } = responseData;
        return user;
    }
    return null;
}

export function getSession() {
    return Cookies.get("userSession");
}

export function setSession(value) {
    Cookies.set("userSession", value, { expires: 7 });
}

export function setTempSession(value) {
    Cookies.set("userSession", value, { expires: null });
}

export function removeSession() {
    Cookies.remove("userSession");
}