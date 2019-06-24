const BackendError = {
    timeout: {
        code: -1,
        desc: "process timeout"
    },
    serviceNotFound: {
        code: -2,
        desc: "service not found"
    },
    serviceUnavailable: {
        code: -3,
        desc: "service unavailable"
    },
    loginFail: {
        code: -4,
        desc: "login fail"
    },
    registerFail: {
        code: -5,
        desc: "user exists"
    }
}
export {
    BackendError
};