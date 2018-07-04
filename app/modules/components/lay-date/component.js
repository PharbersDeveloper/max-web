import Component from '@ember/component';
// import laydate from 'npm:layui-laydate';
// import StateMachine from 'npm:javascript-state-machine';

export default Component.extend({
    init() {
        this._super(...arguments);
        // laydate.render({
        //   elem: '#test1' //指定元素
        // });
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
    }
});
