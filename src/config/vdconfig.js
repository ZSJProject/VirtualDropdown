/**
 * @ngdoc object
 * @name vsdropdownConfig
 * @description vsdropdownConfig contain constants and configuration of the vsdropdown
 */
module.exports = {
    ALL_SELECT_LIMIT: 20,
    LIST_FOCUS_EVENT: 'vsdropdown.listFocusEvent',
    OPTION_UPDATE_EVENT: 'vsdropdown.listFocusEvent',
    OPERATION_ADD: 'add',
    OPERATION_DEL: 'del',
    DOT_SEPARATOR: '.',
    BASIC_OPTION: {
        itemHeight: 32,
        multiple: 10,
        showCount: true
    },
    BASIC_VIEW: {
        overlayText: '선택된 아이템',
        propertyTitle: '속성',
        valueTitle: '값'
    },
    BASIC_FILTER:{
        enabled: true,
        filterPlaceholderTxt: '필터'
    }
};
