import Component from '@ember/component';
import { inject } from '@ember/service';
export default Component.extend({
	i18n: inject(),
	tagName: '',
	activeOv: ''
});