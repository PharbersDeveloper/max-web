import Component from '@ember/component';
import {
	computed
} from '@ember/object';
import Table from 'ember-light-table';

export default Component.extend({
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
		return [{
			label: '商品名',
			valuePath: 'id',
			width: '100px',
			align: 'center',
			className: 'testname',
			sortable: true,
			sorted: true,
		}, {
			label: '类别',
			valuePath: 'type',
			width: '100px',
			align: 'center',

		}, {
			label: '治疗领域',
			valuePath: 'treatmentarea',
			width: '100px',
			align: 'center',

		}, {
			label: '上市时间',
			valuePath: 'selltime',
			width: '80px',
			align: 'center',
		}, {
			label: '医保类型',
			valuePath: 'medicalinsurance',
			width: '80px',
			align: 'center',
		}, {
			label: '研发类型',
			valuePath: 'development',
			width: '80px',
			align: 'center',
		}, {
			label: '公司考核价',
			valuePath: 'companyprice',
			width: '100px',
			align: 'center',
		}];
	}),

	table: computed('model', function() {
		return new Table(this.get('columns'), this.get('model'));
	}),
	actions: {
		onColumnClick(column) {
			// console.log(column);
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
		}
	}

});
