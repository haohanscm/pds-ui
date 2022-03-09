const shop = {
    state: {
        serviceType: 1
    },
    mutations: {
        UPDATE_TYPE: (state, type) => {
            state.serviceType = type
        }
    },
    actions: {
        updateType({ commit }, type) {
            commit('UPDATE_TYPE', type)
        }
    }
}

export default shop
