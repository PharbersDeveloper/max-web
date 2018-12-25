import Mixin from '@ember/object/mixin';
import { select } from "d3-selection";

export default Mixin.create({
	drawBg(id) {
		this.set('elementId', id);
		this.set('drawBg', select(`#${elementId}`).append('svg'));
	}
});