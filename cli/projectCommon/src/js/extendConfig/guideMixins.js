import Driver from '@yh/ta404-ui/es/driver';
import '@yh/ta404-ui/es/driver/style';

export default {
  activated() {
    const obj = window.pageVmObj;
    const steps = obj[`steps_${obj._route.name}`];
    this.methods ? this.methods.fnCommonGuide(steps) : this.fnCommonGuide(steps);
  },
  deactivated() {
    this.methods ? this.methods.fnCommonGuide([], true) : this.fnCommonGuide([], true);
  },
  methods: {
    fnCommonGuide(steps, status) {
      const obj = window.pageVmObj;
      if (!status) {
        obj[`steps_${obj._route.name}`] = steps;
        obj.driver = new Driver({
          allowClose: false,
        });
        window.fnPageGuide = () => {
          obj.driver.defineSteps(steps);
          obj.driver.start();
        };
      } else {
        obj?.driver?.reset();
        window.fnPageGuide = null;
      }
    },
  },
};
