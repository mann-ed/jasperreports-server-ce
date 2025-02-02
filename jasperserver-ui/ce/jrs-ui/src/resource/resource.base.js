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
import {$break} from 'prototype';
import TouchController from '../util/touch.controller';
import {buildActionUrl} from "../util/utils.common";
import buttonManager from '../core/core.events.bis';
import dynamicTree from '../dynamicTree/dynamicTree.utils';
import jQuery from 'jquery';

var resource = {
    messages: {},
    resourceLabelMaxLength: 100,
    resourceIdMaxLength: 100,
    resourceDescriptionMaxLength: 250,
    PROPAGATE_EVENT: 'propagateEvent',
    STEP_DISPLAY_ID: 'stepDisplay',
    FLOW_CONTROLS_ID: 'flowControls',
    initSwipeScroll: function () {
        var display = jQuery('#' + resource.STEP_DISPLAY_ID)[0];    //        var hasControls = $(resource.FLOW_CONTROLS_ID).childElements().length > 0;
        //
        //        var scrollElement = hasControls ? display.up() : display;
        //        var hasControls = $(resource.FLOW_CONTROLS_ID).childElements().length > 0;
        //
        //        var scrollElement = hasControls ? display.up() : display;
        display && new TouchController(display.parent(), display.parents().eq(2), {}    //            debug: true
        );
    },
    submitForm: function (formId, params, fillForm) {
        if (!params) {
            return;
        }    // prepare action url
        // prepare action url
        var url = buildActionUrl(params);
        fillForm && fillForm();    // write form attributes and submit it
        // write form attributes and submit it
        jQuery('#' + formId).attr('method', 'post').attr('action', url);
        jQuery('#' + formId)[0].submit();
    },
    // Setup main event handler for click events on Add Resource pages.
    registerClickHandlers: function (handlers, observeElementSelector, addAtBeginning) {
        if (resource._bodyClickEventHandlers) {
            //If we want some handlers to fire before others we should pass addAtBeginning = true
            (addAtBeginning ? Array.prototype.unshift : Array.prototype.push).apply(resource._bodyClickEventHandlers, handlers);
            return;
        }
        resource._bodyClickEventHandlers = handlers;
        var selector = observeElementSelector || 'body';
        jQuery(selector).on('click', function (event) {
            resource._bodyClickEventHandlers && resource._bodyClickEventHandlers.each(function (clickEventHandler) {
                var result = clickEventHandler(event);    //if handler returns some result
                //this means that we have found necessary handler so
                //do not need to process other
                //if handler returns some result
                //this means that we have found necessary handler so
                //do not need to process other
                if (result) {
                    if (result !== resource.PROPAGATE_EVENT) {
                        Event.stop(event);
                    }
                    throw $break;
                }
            });
        });
    },
    TreeWrapper: function (options) {
        var that = this;
        this._treeId = options.treeId;
        this._resourceUriInput = jQuery('#' + options.resourceUriInput || '#resourceUri')[0];
        this._uri = this._resourceUriInput && this._resourceUriInput.getValue() || options.uri || '/';
        if (!options.providerId)
            throw 'There is no tree provider set for tree #{id}'.interpolate({ id: this._treeId });    // Setup folders tree
        // Setup folders tree
        var treeOptions = [
            'providerId',
            'rootUri',
            'organizationId',
            'publicFolderUri',
            'urlGetNode',
            'urlGetChildren'
        ].inject({}, function (treeOption, key) {
            options[key] !== null && (treeOption[key] = options[key]);
            return treeOption;
        });
        this._tree = new dynamicTree.createRepositoryTree(this._treeId, treeOptions);
        this._tree.observe('tree:loaded', function () {
            that._tree.openAndSelectNode(jQuery('#' + that._resourceUriInput)[0].getValue());
        });
        this._tree.observe('leaf:selected', function (event) {
            that._uri = event.memo.node.param.uri;
            that._resourceUriInput.setValue(that._uri);
        });
        this._tree.observe('node:selected', function () {
            that._resourceUriInput.setValue(that._uri = '');
        });
        return {
            getTreeId: function () {
                return that._treeId;
            },
            getTree: function () {
                return that._tree;
            },
            selectFolder: function (folderUri) {
                that._tree.openAndSelectNode(folderUri);
            },
            getSelectedFolderUri: function () {
                return that._uri;
            }
        };
    },
    ////////////////////////////////
    // Utility Methods
    ////////////////////////////////
    switchButtonState: function (button, state) {
        buttonManager[state ? 'enable' : 'disable'].call(buttonManager, button);
    },
    switchDisableState: function (element, disable) {
        (element = jQuery(element)[0]) && element[disable ? 'disable' : 'enable'].call(element);
    },
    generateResourceId: function (name) {
        if (window.localContext && window.localContext.initOptions && window.localContext.initOptions.resourceIdNotSupportedSymbols) {
            return name.replace(new RegExp(window.localContext.initOptions.resourceIdNotSupportedSymbols, 'g'), '_');
        } else {
            throw 'There is no resourceIdNotSupportedSymbols property in init options.';
        }
    },
    testResourceId: function (resourceId) {
        if (window.localContext && window.localContext.initOptions && window.localContext.initOptions.resourceIdNotSupportedSymbols) {
            return new RegExp(window.localContext.initOptions.resourceIdNotSupportedSymbols, 'g').test(resourceId);
        } else {
            throw 'There is no resourceIdNotSupportedSymbols property in init options.';
        }
    },
    labelValidator: function (value) {
        var isValid = true;
        var errorMessage = '';
        if (value.blank()) {
            errorMessage = resource.messages['labelIsEmpty'];
            isValid = false;
        } else if (value.length > resource.resourceLabelMaxLength) {
            errorMessage = resource.messages['labelToLong'];
            isValid = false;
        }
        return {
            isValid: isValid,
            errorMessage: errorMessage
        };
    },
    getLabelValidationEntry: function (element) {
        return {
            element: element,
            validators: [
                {
                    method: 'mandatory',
                    messages: { mandatory: resource.messages['labelIsEmpty'] }
                },
                {
                    method: 'minMaxLength',
                    messages: { tooLong: resource.messages['labelToLong'] },
                    options: { maxLength: resource.resourceLabelMaxLength }
                }
            ]
        };
    },
    getIdValidationEntry: function (element) {
        return {
            element: element,
            validators: [
                {
                    method: 'resourceIdChars',
                    messages: resource.messages
                },
                {
                    method: 'mandatory',
                    messages: { mandatory: resource.messages['resourceIdIsEmpty'] }
                },
                {
                    method: 'minMaxLength',
                    messages: { tooLong: resource.messages['resourceIdToLong'] },
                    options: { maxLength: resource.resourceIdMaxLength }
                }
            ]
        };
    },
    /**
     * The context of this method should contain _isEditMode property. Id it is true then validator will not validate
     * the value but will return isValid=true.
     */
    resourceIdValidator: function (value) {
        var isValid = true;
        var errorMessage = '';
        if (!this._isEditMode) {
            if (value.blank()) {
                errorMessage = resource.messages['resourceIdIsEmpty'];
                isValid = false;
            } else if (value.length > resource.resourceIdMaxLength) {
                errorMessage = resource.messages['resourceIdToLong'];
                isValid = false;
            } else if (resource.testResourceId(value)) {
                errorMessage = resource.messages['resourceIdInvalidChars'];
                isValid = false;
            }
        }
        return {
            isValid: isValid,
            errorMessage: errorMessage
        };
    },
    getDescriptionValidationEntry: function (element) {
        return {
            element: element,
            validators: [{
                method: 'minMaxLength',
                messages: { tooLong: resource.messages['descriptionToLong'] },
                options: { maxLength: resource.resourceDescriptionMaxLength }
            }]
        };
    },
    descriptionValidator: function (value) {
        var isValid = true;
        var errorMessage = '';
        if (value.length > resource.resourceDescriptionMaxLength) {
            errorMessage = resource.messages['descriptionToLong'];
            isValid = false;
        }
        return {
            isValid: isValid,
            errorMessage: errorMessage
        };
    },
    dataSourceValidator: function (value) {
        var isValid = true;
        var errorMessage = '';
        if (value.trim() === '') {
            errorMessage = resource.messages['dataSourceInvalid'];
            isValid = false;
        }
        return {
            isValid: isValid,
            errorMessage: errorMessage
        };
    },
    queryValidator: function (value) {
        var isValid = true;
        var errorMessage = '';
        if (value.trim() === '') {
            errorMessage = resource.messages['queryInvalid'];
            isValid = false;
        }
        return {
            isValid: isValid,
            errorMessage: errorMessage
        };
    },
    getValidationEntries: function (elementsToValidate) {
        // To use this method all elements should have validator or validationEntry property set.
        return elementsToValidate.collect(function (element) {
            if (element.validationEntry) {
                return element.validationEntry;
            } else {
                return {
                    validator: element.validator,
                    element: element
                };
            }
        });
    }
};

export default resource;