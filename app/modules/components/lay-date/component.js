import Component from '@ember/component';
// import StateMachine from 'npm:javascript-state-machine';

export default Component.extend({
    init() {
        this._super(...arguments);
      //   var fsm = new StateMachine({
      //   init: 'solid',
      //   transitions: [
      //     { name: 'melt',     from: 'solid',  to: 'liquid' },
      //     { name: 'freeze',   from: 'liquid', to: 'solid'  },
      //     { name: 'vaporize', from: 'liquid', to: 'gas'    },
      //     { name: 'condense', from: 'gas',    to: 'liquid' }
      //   ],
      //   methods: {
      //     onMelt:     function() { console.log('I melted')    },
      //     onFreeze:   function() { console.log('I froze')     },
      //     onVaporize: function() { console.log('I vaporized') },
      //     onCondense: function() { console.log('I condensed') }
      //   }
      // });
      //    window.console.info(fsm)
  },
    didInsertElement() {
        window.laydate.render({
          elem: window.document.getElementById('test1'), //指定元素
          type: 'month',
          range: true
        });
    }
});
