/**
 * This example illustrates how to use the "gridfilters" plugin.
 */
Ext.define('KitchenSink.view.grid.GridFiltering', {
    extend: 'Ext.grid.Panel',
    xtype: 'grid-filtering',
    requires: [
        'Ext.grid.filters.Filters',
        'KitchenSink.store.Products'
    ],
    title: '驾驶证信息',
    collapsible: true,
    frame: true,
    width: 700,
    height: 500,
    resizable: true,
    // Need a minHeight. Neptune resizable framed panels are overflow:visible
    // so as to enable resizing handles to be embedded in the border lines.
    minHeight: 200,
    //</example>

    plugins: {
        gridfilters: true
    },

    emptyText: '无信息',
    loadMask: true,
    stateful: true,

    // Set a stateId so that this grid's state is persisted.
    stateId: 'stateful-filter-grid',

    store: {
        type: 'ajax',
        url: './index.ashx?Method=queryCard',
        autoLoad: true,
        autoDestroy: true
    },

    // Dispatch named listener and handler methods to this instance
    defaultListenerScope: true,

    tbar: [{
        text: 'Show Filters...',
        tooltip: 'Show filter data for the store',
        handler: 'onShowFilters'
    }, {
        text: 'Clear Filters',
        tooltip: 'Clear all filters',
        handler: 'onClearFilters'
    }],
    columns: [
        { text: '工资号', dataIndex: 'payId', align: 'left', maxWidth: 80,filter:'number' },
        {
            text: '姓名', dataIndex: 'uName', maxWidth: 120, filter: {
                type: 'string',
                itemDefaults: {
                    emptyText: '查找...'
                }
            }},
        { text: '部门', dataIndex: 'department', filter: 'list'},
        { xtype: 'datecolumn', text: '出生日期', dataIndex: 'birthDate',  filter: true },
        { xtype: 'datecolumn', text: '退休日期', dataIndex: 'txrq', filter: true},
        { text: '年龄', dataIndex: 'age', filter: 'number'  },
        { text: '身份证号', dataIndex: 'cardId' },
        { xtype: 'datecolumn', text: '初次领证日期', dataIndex: 'sjDate', filter: true },
        { xtype: 'datecolumn', text: '有效起始日期', dataIndex: 'startDate', filter: true},
        { xtype: 'datecolumn', text: '有效截止日期', dataIndex: 'deadline', filter: true},
        { text: '准驾代码', dataIndex: 'sjDriveCode', filter: 'list' },
        { text: '准假机型', dataIndex: 'sjDriveType', filter: 'list' },
        { text: '批号', dataIndex: 'sjRemark', filter: 'list' },
        { text: '批次', dataIndex: 'PC', filter: 'list'},
        { text: '证件状态', dataIndex: 'status', filter: 'list' },
        { xtype: 'datecolumn', text: '年鉴日期', dataIndex: 'yearlyCheckDate', filter: true},
        { text: '拼音码', dataIndex: 'pym' },
        { text: '体检结论', dataIndex: 'phyTest', filter: 'list'}
    ],

    onClearFilters: function () {
        // The "filters" property is added to the grid (this) by gridfilters
        this.filters.clearFilters();
    },

    onShowFilters: function () {
        var data = [];

        // The actual record filters are placed on the Store.
        this.store.getFilters().each(function (filter) {
            data.push(filter.serialize());
        });

        // Pretty it up for presentation
        data = Ext.JSON.encodeValue(data, '\n').replace(/^[ ]+/gm, function (s) {
            for (var r = '', i = s.length; i--; ) {
                r += '&#160;';
            }
            return r;
        });
        data = data.replace(/\n/g, '<br>');

        Ext.Msg.alert('Filter Data', data);
    }
});
