import Component from '@ember/component';
import { computed } from '@ember/object';
import Table from 'ember-light-table';

export default Component.extend({
	tagName: '',
	selfheight: '180px',
	sort: '',
	dir: 'asc',
	sortedModel: computed.sort('model', 'sortBy').readOnly(),
	sortBy: computed('dir', 'sort', function () {
		return [`${this.get('sort')}:${this.get('dir')}`];
	}).readOnly(),
	setRows: function (rows, thisInstance) {
		thisInstance.get('table').setRows([]);
		thisInstance.get('table').setRows(rows);
	},
	filterAndSortModel: function (thisInstance) {
		let model = thisInstance.get('sortedModel');

		thisInstance.get('setRows')(model, thisInstance);
	},
	columns: computed('columns', function () {

	}),

	table: computed('model', function () {
		let handledData = [],
			model = this.get('model');

		if (typeof model !== 'undefined') {
			model.forEach(function (d) {

				let temp = {
					index: '',
					hospitalName: ''
				};

				temp.index = d.index;
				temp.hospitalName = d.hospitalName;

				handledData.push(temp);
			});
		}
		return new Table(this.get('columns'), handledData);
	}),
	actions: {
		onColumnClick(column) {
			if (column.sorted) {
				this.setProperties({
					dir: column.ascending ? 'asc' : 'desc',
					sort: column.get('valuePath')

				});
				this.set('sort', column.get('valuePath'));

				this.get('filterAndSortModel')(this);
			}
		},
		onAfterResponsiveChange(matches) {
			if (matches.indexOf('jumbo') > -1) {
				this.get('table.expandedRows').setEach('expanded', false);
			}
		},
		onScrolledToBottom() {
			if (this.get('canLoadMore')) {
				this.incrementProperty('page');
				this.get('fetchRecords').perform();
			}
		}
	}

});
