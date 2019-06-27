const BackendError = {
    success: 0,
    timeout: -1,
    // tslint:disable-next-line:object-literal-sort-keys
    serviceNotFound: -2,
    serviceUnavailable: -3,
    loginFail: -4,
    registerFail: -5,
    createPostFail: -6,
    rconnectFail: -7,
    noHandler: -8
}
export {
    BackendError
};