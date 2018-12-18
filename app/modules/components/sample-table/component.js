import Component from '@ember/component';
import {
	computed
} from '@ember/object';
import Table from 'ember-light-table';

export default Component.extend({
	tagName: '',
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
		let handledData = [];
		this.get('model').forEach(function(d){
			let temp = {
				province:"",
				market_size:"",
				market_growth:"",
				sales_amount:"",
				sales_growth:"",
				ev_value:"",
				share:"",
				share_growth:"",
			}
			temp.province = d.province;
			temp.market_size = d.market_size;
			temp.market_growth = d.market_growth;
			temp.sales_amount = d.sales_amount;
			temp.sales_growth = d.sales_growth;
			temp.ev_value = d.ev_value;
			temp.share = d.share;
			temp.share_growth = d.share_growth;
			handledData.push(temp);
		});
		return new Table(this.get('columns'), handledData);
	}),
	actions: {
		onColumnClick(column) {
			// this.get('logger').log(column);
			if (column.sorted) {
				this.setProperties({
					dir: column.ascending ? 'asc' : 'desc',
					sort: column.get('valuePath'),
					// canLoadMore: true,
					// page: 0
				});
				// this.get('model').clear();
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
