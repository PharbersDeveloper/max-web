import Route from '@ember/routing/route';
import {inject} from '@ember/service';
export default Route.extend({
    cookies: inject(),
    // beforeModel(transition) {
    //     if(!this.get('cookies').exists('uid')) {
    //         let loginController = this.controllerFor('index');
    //         loginController.set('previousTransition', transition);
    //         this.transitionTo('index');
    //     }
    // },
});
