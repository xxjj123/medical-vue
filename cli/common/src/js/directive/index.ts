import Vue from "vue";
import VueDOMPurifyHTML from "@common/js/directive/dompurify-html";
Vue.use(VueDOMPurifyHTML, {
  namedConfigurations: {
    'svg': {
      USE_PROFILES: { svg: true }
    },
    'mathml': {
      USE_PROFILES: { mathMl: true }
    },
  }
});
