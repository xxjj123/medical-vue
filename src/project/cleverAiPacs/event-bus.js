// event-bus.js
import Vue from "vue";

class VueBus {
  constructor() {
    this._vm = new Vue();
  }

  on(event, callback) {
    this._vm.$on(event, callback);
    return this;
  }

  once(event, callback) {
    this._vm.$once(event, callback);
    return this;
  }

  off(event, callback) {
    if (!callback) {
      this._vm.$off(event);
    } else {
      this._vm.$off(event, callback);
    }
    return this;
  }

  emit(event, ...args) {
    this._vm.$emit(event, ...args);
    return this;
  }
}

export const EventBus = new VueBus();
