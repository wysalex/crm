import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutations_types.js'

Vue.use(Vuex)

const state = {
  hasNewSupplier: false,
  hasNewCustomer: false
}

const actions = {
  toggleNewSupplier ({ commit }, { needShowTip }) {
    commit(types.HAS_NEW_SUPPLIER, needShowTip)
  },
  toggleNewCustomer ({ commit }, { needShowTip }) {
    commit(types.HAS_NEW_CUSTOMER, needShowTip)
  }
}

const mutations = {
  [types.HAS_NEW_SUPPLIER] (state, needShowTip) {
    state.hasNewSupplier = needShowTip
  },
  [types.HAS_NEW_CUSTOMER] (state, needShowTip) {
    state.hasNewCustomer = needShowTip
  }
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
  // 嚴格模式，禁止直接修改 state
  strict: true
})
