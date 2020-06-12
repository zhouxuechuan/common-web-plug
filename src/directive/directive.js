import moment from 'moment';
import _ from 'lodash';
// import {} from '../common/constant';
export default (Vue) => {
  Vue.directive('numberOnly', {
    bind: function (el) {
      el.handler = function () {
        // el.value = el.value.replace(/\D+/, '');
        console.log(el);
        console.log(el.value);
      };
      el.addEventListener('input', el.handler);
    },
    unbind: function (el) {
      el.removeEventListener('input', el.handler);
    }
  });
};
