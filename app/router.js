import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
    location: config.locationType,
    rootURL: config.rootURL
});

Router.map(function() {
  this.route('landing');
  this.route('data-center');
  this.route('add-data');
  this.route('data', function() {
    this.route('overview');
  });
});

export default Router;