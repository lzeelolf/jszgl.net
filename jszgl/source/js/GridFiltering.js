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
    title: '��ʻ֤��Ϣ',
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

    emptyText: '����Ϣ',
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
        { text: '���ʺ�', dataIndex: 'payId', align: 'left', maxWidth: 80,filter:'number' },
        {
            text: '����', dataIndex: 'uName', maxWidth: 120, filter: {
                type: 'string',
                itemDefaults: {
                    emptyText: '����...'
                }
            }},
        { text: '����', dataIndex: 'department', filter: 'list'},
        { xtype: 'datecolumn', text: '��������', dataIndex: 'birthDate',  filter: true },
        { xtype: 'datecolumn', text: '��������', dataIndex: 'txrq', filter: true},
        { text: '����', dataIndex: 'age', filter: 'number'  },
        { text: '���֤��', dataIndex: 'cardId' },
        { xtype: 'datecolumn', text: '������֤����', dataIndex: 'sjDate', filter: true },
        { xtype: 'datecolumn', text: '��Ч��ʼ����', dataIndex: 'startDate', filter: true},
        { xtype: 'datecolumn', text: '��Ч��ֹ����', dataIndex: 'deadline', filter: true},
        { text: '׼�ݴ���', dataIndex: 'sjDriveCode', filter: 'list' },
        { text: '׼�ٻ���', dataIndex: 'sjDriveType', filter: 'list' },
        { text: '����', dataIndex: 'sjRemark', filter: 'list' },
        { text: '����', dataIndex: 'PC', filter: 'list'},
        { text: '֤��״̬', dataIndex: 'status', filter: 'list' },
        { xtype: 'datecolumn', text: '�������', dataIndex: 'yearlyCheckDate', filter: true},
        { text: 'ƴ����', dataIndex: 'pym' },
        { text: '������', dataIndex: 'phyTest', filter: 'list'}
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
