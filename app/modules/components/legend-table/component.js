import Component from '@ember/component';
import { computed } from '@ember/object';
import Table from 'ember-light-table';

export default Component.extend({
	classNames: ['col-md-8', 'col-sm-12'],
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
		let handledData = [];

		this.get('model').forEach(function (d) {
			let temp = {
				prod: '',
				market: '',
				sales: '',
				cont: '',
				'cont_month': '',
				'cont_season': '',
				'cont_year': ''
			};

			temp.prod = d.prod;
			temp.market = d.market;
			temp.sales = d.sales;
			temp.cont = d.cont;
			temp['cont_month'] = d.contMonth;
			temp['cont_season'] = d.contSeason;
			temp['cont_year'] = d.contYear;
			handledData.push(temp);
		});
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
