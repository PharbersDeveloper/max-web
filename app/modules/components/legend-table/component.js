import Component from '@ember/component';
import {
	computed
} from '@ember/object';
import Table from 'ember-light-table';

export default Component.extend({
	classNames: ['col-md-8', 'col-sm-12'],
	selfheight: '180px',
	sort: '',
	dir: 'asc',
	sortedModel: computed.sort('model', 'sortBy').readOnly(),
	sortBy: computed('dir', 'sort', function() {
		return [`${this.get('sort')}:${this.get('dir')}`];
	}).readOnly(),
	setRows: function(rows, that) {
		that.get('table').setRows([]);
		that.get('table').setRows(rows);
	},
	filterAndSortModel: function(that) {
		let model = that.get('sortedModel');
		// let result = model;
		that.get('setRows')(model, that);
	},
	columns: computed('columns', function() {

	}),

	table: computed('model', function() {
		return new Table(this.get('columns'), this.get('model'));
	}),
	actions: {
		onColumnClick(column) {
			if (column.sorted) {
				this.setProperties({
					dir: column.ascending ? 'asc' : 'desc',
					sort: column.get('valuePath'),
				});
				this.set('sort', column.get('valuePath'))
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
		},
	}

});