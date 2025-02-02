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
import AttributesDesigner from '../../attributes/view/AttributesDesigner';
import attributesTypesEnum from '../../attributes/enum/attributesTypesEnum';
import designerButtonsTrait from '../../serverSettingsCommon/view/traits/buttonsTrait';
import designerFilterTrait from '../../attributes/view/trait/designerFilterTrait';
import designerInheritedTrait from '../../attributes/view/trait/designerInheritedTrait';
import designerPermissionTrait from '../../attributes/view/trait/designerPermissionTrait';

var designerByType = {};
designerByType[attributesTypesEnum.SERVER] = [
    designerButtonsTrait,
    designerPermissionTrait
];
designerByType[attributesTypesEnum.TENANT] = [
    designerFilterTrait,
    designerInheritedTrait,
    designerPermissionTrait
];
designerByType[attributesTypesEnum.USER] = [
    designerFilterTrait,
    designerInheritedTrait
];

function combineTraits(traits) {
    var mainTrait = {};
    _.each(traits, function (trait) {
        _.extend(mainTrait, trait);
    });
    return mainTrait;
}

export default function (type, options) {
    var designer = AttributesDesigner.extend(combineTraits(designerByType[type]));
    return new designer(options);
}