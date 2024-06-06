import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './actions';

import componentStore from '@yh/ta404-ui/es/store';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const store = new Vuex.Store({
  strict: debug,
  state: {},
  mutations,
  actions,
  modules: {
    ...componentStore,
  },
});

export default store;
