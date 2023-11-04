const types = {
    authLogin: 'auth - login',
    authLogout: 'auth - logout',
    productDeleteAll: 'product - delete all',
    productChange: 'product - change'
}

const initialStore = {
    user: {id: 0, nombre: "", email: ""}
}

const storeReducer = (state,action) => {
    switch(action.type){
        case types.authLogout:
            return {
                ...state,
                user:null
            }
        case types.authLogin:
            return {
                ...state,
                user:action.payload
            }
        default:
            return state;
    }

}

export { initialStore, types }
export default storeReducer