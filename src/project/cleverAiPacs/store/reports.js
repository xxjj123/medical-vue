export default {
  namespaced: true,
  state: {
    reports_tag: "",    // yxsj yxzd
    reports_yxsj_content: "",
    reports_yxzd_content: "",
  },
  getters: {
    get_reports_tag: (state) => {
      return state.reports_tag;
    },
    get_reports_yxsj_content: (state) => {
      return state.reports_yxsj_content;
    },
    get_reports_yxzd_content: (state) => {
      return state.reports_yxzd_content;
    },
  },
  mutations: {
    SET_REPORTS_TAG(state, payload) {
      state.reports_tag = payload;
    },
    SET_REPORTS_MUIL_CONTEXT(state, payload) {
      const {name, data} = payload;
      state[`reports_${name}_content`] = data;
    },
    SET_REPORTS_YXSJ_CONTENT(state, payload) {
      state.reports_yxsj_content = payload;
    },
    SET_REPORTS_YXZD_CONTENT(state, payload) {
      state.reports_yxzd_content = payload;
    },
  },
  actions: {

  }
}
