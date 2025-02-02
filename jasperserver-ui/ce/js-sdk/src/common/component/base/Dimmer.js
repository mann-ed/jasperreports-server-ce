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

import $ from 'jquery';
import classUtil from '../../util/classUtil';
var $dimmer;
var counter;
export default classUtil.extend({
    constructor: function (options) {
        if (!$dimmer) {
            counter = 0;
            $dimmer = $('<div id=\'dialogDimmer\' class=\'dimmer\'></div>').css(options);
            $(document.body).append($dimmer);
            $dimmer.hide();
        }
        counter++;
    },
    css: function (options) {
        $dimmer.css(options);
        return this;
    },
    show: function () {
        var dimmerCount = this.getCount() || 0;
        this.setCount(dimmerCount + 1);
        $dimmer.show();
        return this;
    },
    hide: function () {
        if (this.isVisible()) {
            var dimmerCount = this.getCount();
            this.setCount(--dimmerCount);
            !dimmerCount && $dimmer.hide();
            return this;
        }
    },
    setCount: function (value) {
        $dimmer.data({ 'count': value });
    },
    getCount: function () {
        return parseInt($dimmer.data('count'), 10);
    },
    isVisible: function () {
        return $dimmer.is(':visible');
    },
    remove: function () {
        if (this._removed) {
            return;
        }
        this._removed = true;
        if (!$dimmer) {
            return;
        }
        counter--;
        if (!counter) {
            $dimmer.remove();
            $dimmer = null;
        }
    }
});