import { type VueConstructor } from 'vue';
import {
    buildDirective,
    defaultDOMPurifyInstanceBuilder,
  type DirectiveConfig,
  type MinimalDOMPurifyConfig,
  type DOMPurifyInstanceBuilder,
} from './dompurify-html';
export { type DirectiveConfig, type MinimalDOMPurifyConfig, type DOMPurifyInstanceBuilder };

export { buildDirective as buildVueDompurifyHTMLDirective } from './dompurify-html';

export default {
    install(
        Vue: VueConstructor,
        config: DirectiveConfig = {},
        buildDOMPurifyInstance = defaultDOMPurifyInstanceBuilder
    ): void {
        Vue.directive(
            'dompurify-html',
            buildDirective(config, buildDOMPurifyInstance)
        );
    },
};
