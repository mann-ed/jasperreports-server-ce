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


/**
 * @version: $Id$
 */

/*
 * event handler for generic key events
 */

import jQuery from 'jquery';
import {
    Keys,
    isMetaHeld,
    isShiftHeld,
    matchMeOrUp
} from "../util/utils.common";

import actionModel from '../actionModel/actionModel.modelGenerator';
import layoutModule from '../core/core.layout';
import primaryNavModule from '../actionModel/actionModel.primaryNavigation';
import {tooltipModule} from '../components/components.tooltip';

var keyManager = {
    ignoreKeyDown : [
        Keys.DOM_VK_SHIFT,
        Keys.DOM_VK_CONTROL,
        Keys.DOM_VK_ALT
    ],

    noBubbleOnKeyUp : [
        Keys.DOM_VK_F10
    ]
};

document.observe('keyup', function(event){
    if (keyManager.noBubbleOnKeyUp.include(event.keyCode)) {
        Event.stop(event);
    }
});

document.observe('keydown', function(event){


    if (keyManager.ignoreKeyDown.include(event.keyCode)) {
        return;
    }

    //debug only
    //window.console && console.log('document.activeElement',document.activeElement);
    //window.console && console.log('keydown',event.target,event.keyCode);

    var focused = event.target;

    if(event.keyCode == Event.KEY_RETURN) {
        focused.fire('key:enter', {targetEvent: event, node: focused});
        return;
    }

    if(event.keyCode == 32) {
        focused.fire('key:space', {targetEvent: event, node: focused});
        return;
    }

    if(event.shiftKey && (event.keyCode == Keys.DOM_VK_F10)) {
        //prevent from showing native menu, specially in IE9
    	Event.stop(event);
        focused.fire('key:contextMenu', {targetEvent: event, node: focused});
        return;
    }
    if(event.keyCode == Event.KEY_LEFT) {
        focused.fire('key:left', {targetEvent: event, node: focused});
        return;
    }
    if(event.keyCode == Event.KEY_RIGHT) {
        focused.fire('key:right', {targetEvent: event, node: focused});
        return;
    }
    if(event.keyCode == Event.KEY_UP) {
        focused.fire('key:up', {targetEvent: event, node: focused});
        return;
    }
    if(event.keyCode == Event.KEY_DOWN) {
        focused.fire('key:down', {targetEvent: event, node: focused});
        return;
    }
    if(event.keyCode == Event.KEY_PAGEUP) {
        focused.fire('key:pageup', {targetEvent: event, node: focused});
        return;
    }
    if(event.keyCode == Event.KEY_PAGEDOWN) {
        focused.fire('key:pagedown', {targetEvent: event, node: focused});
        return;
    }
    if(event.keyCode == Event.KEY_HOME) {
        focused.fire('key:home', {targetEvent: event, node: focused});
        return;
    }
    if(event.keyCode == Event.KEY_END) {
        focused.fire('key:end', {targetEvent: event, node: focused});
        return;
    }
    //ctrl + y
    if(isMetaHeld(event) && (event.keyCode == 89)) {
        focused.fire('key:redo', {targetEvent: event, node: focused});
        return;
    }
    //ctrl + z
    if(isMetaHeld(event) && (event.keyCode == 90)) {
        focused.fire('key:undo', {targetEvent: event, node: focused});
        return;
    }
    //escape
    if(event.keyCode == Event.KEY_ESC) {
        focused.fire('key:escape', {targetEvent: event, node: focused});
        return;
    }

    // NOTE: Reacting to the TAB key is not recommended for accessibility
    // reasons.
    if(event.keyCode == Event.KEY_TAB) {
        focused.fire('key:tab', {targetEvent: event, node: focused});
        return;
    }

    //delete
    if(event.keyCode == Event.KEY_DELETE) {
        focused.fire('key:delete', {targetEvent: event, node: focused});
        return;
    }


    /**
     * Adhoc and Dashboard specific keys events
     */

    //command / ctrl + a
    if((event.keyCode == 65) && isMetaHeld(event)) {
        focused.fire('key:selectAll', {targetEvent: event, node: focused});
        return;
    }

    //fire for save
    //command / ctrl + s (save)
    if((event.keyCode == 83) && isMetaHeld(event) && !isShiftHeld(event)) {
        focused.fire('key:save', {targetEvent: event, node: focused});
        return;
    }


    //fire for zoom in
    //command / ctrl + shift + l (zoom in)
    if((event.keyCode == 76) && isMetaHeld(event) && isShiftHeld(event)) {
        focused.fire('key:chartZoomIn', {targetEvent: event, node: focused});
        return;
    }


    //fire for zoom  out
    //command / ctrl + shift + o (zoom out)
    if((event.keyCode == 79) && isMetaHeld(event) && isShiftHeld(event)) {
        focused.fire('key:chartZoomOut', {targetEvent: event, node: focused});
        return;
    }

});

////////////////////////////////////////////////
// global custom event handlers
// NOTE: See also Standard Navigation plugins ("stdnav/plugins")
////////////////////////////////////////////////


document.observe('key:escape', function(event){
    let hasTooltipEl = event.target.closest('[tooltiptext]');
    if(hasTooltipEl){
        tooltipModule.hideJSTooltip(hasTooltipEl);
    }
});

const fireMenuItemAction = function(event){
    var elem = event.target, matched;

    //if menu showing - simulate mouseup
    var menuElement = jQuery('#' + layoutModule.MENU_ID)[0];
    if (layoutModule.isVisible(menuElement)) {
        Event.stop(event);
        //var selected = jQuery(menuElement).find(":focus,." + layoutModule.HOVERED_CLASS)[0];
        var selected = elem;
        if (selected) {
            var thisItem = selected;
            if (!jQuery(selected).is(layoutModule.MENU_LIST_PATTERN)){
                thisItem = jQuery(selected).parent(layoutModule.MENU_LIST_PATTERN)[0];
            }
            thisItem && thisItem.onmouseup && setTimeout(thisItem.onmouseup.curry(event.memo.targetEvent),0);
        }
    }

    matched = matchMeOrUp(elem, layoutModule.NAVIGATION_PATTERN);
    if (matched) {
        if (matched.identify() == layoutModule.MAIN_NAVIGATION_HOME_ITEM_ID) {
            Event.stop(event);
            primaryNavModule.navigationOption("home");
        } else if (matched.identify() == layoutModule.MAIN_NAVIGATION_LIBRARY_ITEM_ID) {
            Event.stop(event);
            primaryNavModule.navigationOption("library");
        }
    }
};
document.observe('key:enter', fireMenuItemAction);
document.observe('key:space', fireMenuItemAction);

export default keyManager;

