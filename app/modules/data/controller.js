// import Controller from '@ember/controller';
//
// export default Controller.extend({
// 	title: '市场规模增长最快',
//     data:'2018-4',
//     city:'北京',
// });
import Controller from '@ember/controller';

export default Controller.extend({
	budgetTip: false,
	humanTip: false,
	tabLi: false,
	targetIncrease: 0,
	budget: 0,
	hidden(hiddenProperty) {
		if (this.get(hiddenProperty)) {
			this.set(hiddenProperty, true)
		}
	},

	init() {
		this._super(...arguments);
		this.columnsHospital = [{
				label: '产品名称',
				valuePath: 'prod',
				// width: '100px',
				classNames:'tabl',
				align: 'center',
				sorted: false, //是否可以对列进行排序
				minResizeWidth: '70px',//列可以调整的最小宽度
				// breakpoints: ['mobile', 'tablet', 'desktop'],  可以隐藏的列

			}, {
				label: '市场销售额',
				valuePath: 'market_sale',
				// width: '100px',
				classNames:'tabl',
				align: 'center',
				minResizeWidth: '70px',
				// breakpoints: ['mobile', 'tablet', 'desktop']
			}, {
				label: '市场增长(%)',
				valuePath: 'market_growth',
				// width: '100px',
				align: 'center',
				classNames:'tabl',
				minResizeWidth: '70px',

			}, {
				label: '当期销售额',
				valuePath: 'current_sales',
				// width: '100px',
				align: 'center',
				minResizeWidth: '70px',
			}, {
				label: '销售增长(%)',
				valuePath: 'sales_growth',
				// width: '100px',
				align: 'center',
				minResizeWidth: '70px',
			}, {
				label: 'EV值(%)',
				valuePath: 'ev_value',
				// width: '80px',
				align: 'center',
				minResizeWidth: '70px',
			}, {
				label: '份额(%)',
				valuePath: 'share',
				// width: '80px',
				align: 'center',
				minResizeWidth: '70px',
			}, {
				label: '份额增长(%)',
				valuePath: 'share_growth',
				// width: '100px',
				align: 'center',
				minResizeWidth: '70px',
			}, {
				label: '指标',
				valuePath: 'target',
				// width: '100px',
				align: 'center',
				minResizeWidth: '50px',
			},
			{
				label: '指标达成率(%)',
				valuePath: 'achievement_rate',
				// width: '100px',
				align: 'center',
				minResizeWidth: '70px',
			},
			{
				label: '销售贡献率(%)',
				valuePath: 'contribution_rate',
				// width: '100px',
				align: 'center',
				minResizeWidth: '70px',
			}
		];
		this.columnsHospitalValue = [{
			'prod': '产品一',
			'market_sale': 123456,
			'market_growth': 12,
			'current_sales': 45175,
			'sales_growth': 16,
			'ev_value': 100,
			'share': 45,
			'share_growth': 9,
			'target': 5861,
			'achievement_rate': 47,
			'contribution_rate': 41,
		}, {
			'prod': '产品二',
			'market_sale': 54387,
			'market_growth': 135,
			'current_sales': 87345,
			'sales_growth': 68,
			'ev_value': 468,
			'share': 78,
			'share_growth': 41,
			'target': 579,
			'achievement_rate': 13,
			'contribution_rate': 96,
		}, {
			'prod': '产品三',
			'market_sale': 8321,
			'market_growth': 647,
			'current_sales': 56,
			'sales_growth': 786,
			'ev_value': 563,
			'share': 536,
			'share_growth': 786,
			'target': 53,
			'achievement_rate': 56,
			'contribution_rate': 34,
		}, {
			'prod': '产品四',
			'market_sale': 67456,
			'market_growth': 13422,
			'current_sales': 452,
			'sales_growth': 42,
			'ev_value': 45,
			'share': 656,
			'share_growth': 76,
			'target': 42435,
			'achievement_rate': 452,
			'contribution_rate': 657,
		},{
			'prod': '产品5',
			'market_sale': 67456,
			'market_growth': 13422,
			'current_sales': 452,
			'sales_growth': 42,
			'ev_value': 45,
			'share': 656,
			'share_growth': 76,
			'target': 42435,
			'achievement_rate': 452,
			'contribution_rate': 657,
		},{
			'prod': '产品6',
			'market_sale': 67456,
			'market_growth': 13422,
			'current_sales': 452,
			'sales_growth': 42,
			'ev_value': 45,
			'share': 656,
			'share_growth': 76,
			'target': 42435,
			'achievement_rate': 452,
			'contribution_rate': 657,
		},
	];
	},
	actions: {
		budget() {
			// console.log('budget');
			this.toggleProperty('budgetTip');
			this.hidden('humanTip');
		},
		human() {
			// console.log('human');
			this.toggleProperty('humanTip');
			this.hidden('budgetTip');
		},
		tab() {
			// console.log('tabLi');
			this.toggleProperty('tabLi');
			this.hidden('tabLi');
		},

	}
});
