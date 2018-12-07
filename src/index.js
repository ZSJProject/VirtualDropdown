/*
*    FN  : index.js
*    C   : 2018년 8월 6일 10:58:48 작성
*    DS  :
*    N   :
*    A   : supernovel(ekfueh@naver.com)
*    L   : 모든 권한은 supernovel(ekfueh@naver.com)에 있습니다.
*/

import DropdownTemplate from './index.pug';
import ClassName from './index.scss';
import DropdownController from './controller';

angular.module('vsdropdown', [ 'ngSanitize' ])
    .component('vsDropdown', {
        template: DropdownTemplate({
            Class: ClassName
        }),
        bindings: {
            options: '<',
            items: '<',
            selected: '=',
            onAdd: '&',
            onClick: '&',
            onRemove: '&',
            onBottom: '&',
            placeholder: '@'
        },
        controller: DropdownController
    });