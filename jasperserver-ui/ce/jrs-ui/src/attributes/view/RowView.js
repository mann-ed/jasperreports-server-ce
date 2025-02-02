/*
 * Copyright (C) 2005 - 2022 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 *
 * Unless you have purchased a commercial license agreement from Jaspersoft,
 * the following license terms apply:
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import _ from 'underscore';
import i18n from '../../i18n/AttributesBundle.properties';
import i18n2 from '../../i18n/CommonBundle.properties';
import BaseRow from 'js-sdk/src/common/component/baseTable/childView/BaseRow';
import attributesTypesEnum from '../../attributes/enum/attributesTypesEnum';
import rowTemplatesFactory from '../../attributes/factory/rowTemplatesFactory';

var SECURE_VALUE_SUBSTITUTION = '~secure~';
var RowView = BaseRow.extend({
    className: 'table-row',
    template: _.template(rowTemplatesFactory({readOnly: true})),
    templateHelpers: function () {
        return {
            i18n: i18n,
            i18n2: i18n2,
            type: this.type,
            types: attributesTypesEnum,
            encrypted: SECURE_VALUE_SUBSTITUTION
        };
    },
    computeds: {
        encrypt: {
            get: function () {
                return SECURE_VALUE_SUBSTITUTION;
            },
            set: function (value) {
                this.setBinding('value', value);
            }
        }
    },
    initialize: function (options) {
        this.type = options.type;
        BaseRow.prototype.initialize.apply(this, arguments);
    }
});
export default RowView;