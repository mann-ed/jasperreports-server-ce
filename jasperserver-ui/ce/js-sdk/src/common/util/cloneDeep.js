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

var primitiveTypes = ["string", "number", "boolean", "undefined"];

export default function cloneDeep(source, customizer) {
    if (source === null) {
        return source;
    }

    var sourceType = typeof source;

    if (primitiveTypes.indexOf(sourceType) >= 0) {
        return source;
    }

    var target,
        value,
        key;

    if (typeof customizer === "function") {
        target = customizer(source);

        if (target) {
            return target;
        }
    }

    target = Array.isArray(source) ? [] : {};

    for (key in source) {
        if (source.hasOwnProperty(key)) {
            value = source[key];

            if (typeof value === "object") {
                if (typeof customizer === "function") {
                    target[key] = customizer(value, key) || cloneDeep(value);
                } else {
                    target[key] = cloneDeep(value);
                }
            } else {
                target[key] = value;
            }
        }
    }

    return target;
}