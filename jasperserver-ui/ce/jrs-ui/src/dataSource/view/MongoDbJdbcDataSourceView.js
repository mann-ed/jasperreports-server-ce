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
import $ from 'jquery';
import i18n from '../../i18n/all.properties';
import resourceLocator from '../../resource/resource.locate';
import mongoJdbcFileSourceTypes from '../enum/mongoJdbcFileSourceTypes';
import CustomDataSourceView from '../view/CustomDataSourceView';
import MongoDbJdbcDataSourceModel from '../model/MongoDbJdbcDataSourceModel';
import MongoDbJdbcSpecificTemplate from '../template/mongoDbJdbcSpecificTemplate.htm';
import MongoDbJdbcFileLocationSectionTemplate from '../template/mongoDbJdbcFileLocationSectionTemplate.htm';
import selectDialogTemplate from 'js-sdk/src/common/templates/components.pickers.htm';
import jrsConfigs from "js-sdk/src/jrs.configs";
import request from 'js-sdk/src/common/transport/request';

let adminWorkflowsLoadingPromise = null;
let adminWorkflows = null;

export default CustomDataSourceView.extend({
    PAGE_TITLE_NEW_MESSAGE_CODE: 'resource.datasource.mongoJdbc.page.title.new',
    PAGE_TITLE_EDIT_MESSAGE_CODE: 'resource.datasource.mongoJdbc.page.title.edit',
    modelConstructor: MongoDbJdbcDataSourceModel,
    browseButton: false,
    events: function () {
        var events = _.extend({}, CustomDataSourceView.prototype.events);
        events['change [name=fileSourceType]'] = 'changeFileSourceType';
        events['change [name=autoSchemaDefinition]'] = 'changeAutoSchemaDefinition';
        return events;
    },
    initialize: function (options) {
        CustomDataSourceView.prototype.initialize.apply(this, arguments);
        this.listenTo(this.model, 'change:serverFileName', this.adjustFileSystemConnectButton);
        this.loadAdminWorkflows();
    },
    loadAdminWorkflows: function () {
        if (!adminWorkflowsLoadingPromise) {
            adminWorkflowsLoadingPromise = request({
                type: "GET",
                dataType: "json",
                url: jrsConfigs.contextPath + "/rest_v2/hypermedia/workflows?parentName=admin"
            }).then((result) => {
                adminWorkflows = result;
            });
        }

        return adminWorkflowsLoadingPromise;
    },
    changeFileSourceType: function () {
        _.defer(_.bind(function () {
            this.renderFileLocationSection();
        }, this));
    },
    changeAutoSchemaDefinition: function () {
        _.defer(_.bind(function () {
            this.renderFileLocationSection();
        }, this));
    },
    render: function () {
        this.loadAdminWorkflows().then(() => {
            this.$el.empty();
            this.renderMongoDbSpecificSection();
            this.renderFileLocationSection();
            this.renderTimezoneSection();
            this.renderTestConnectionSection();
            this.$el.find('[name=serverAddress]').focus();
        })

        return this;
    },
    validationMethodOnSaveClick: function (callback) {
        !this.model.get('parentFolderUri') && this.model.set('parentFolderUri', '/');
        !this.model.get('label') && this.model.set('label', $('[name=dataSourceType] option:selected').text());
        var self = this;
        this.model.save({}, { dryRun: true }).fail(function (xhr) {
            var response = false;
            try {
                response = JSON.parse(xhr.responseText);
            } catch (e) {
            }
            var errors = _.isArray(response) ? response : [response];
            _.each(errors, function (error) {
                if (error && error.errorCode && error.parameters) {
                    if (error.errorCode === 'illegal.parameter.value.error' && error.parameters[0] === 'resourceReference.uri') {
                        self.fieldIsInvalid(self, 'repositoryFileName', i18n['resource.file.invalid.path'], 'name');
                    } else if (error.errorCode === 'invalid.server.file.system.path' && error.parameters[0] === 'textDataSource.propertyMap[fileName]') {
                        self.fieldIsInvalid(self, 'serverFileName', i18n['resource.file.invalid.path'], 'name');
                    }
                }
            });
        }).done(callback);
    },
    templateData: function () {
        var fileSourceTypes = _.extend({}, mongoJdbcFileSourceTypes);
        if (!this.model.isLocalFileSystemAccessAllowed(adminWorkflows)) {
            delete fileSourceTypes['SERVER_FILE_SYSTEM'];
        }
        return _.extend(CustomDataSourceView.prototype.templateData.apply(this, arguments), { fileSourceTypeOptions: fileSourceTypes });
    },
    renderMongoDbSpecificSection: function () {
        this.$el.append(_.template(MongoDbJdbcSpecificTemplate, this.templateData()));
    },
    renderFileLocationSection: function () {
        // we are going to re-render the file location section, and
        // we need to remove everything which was there, and draw it again
        this.renderOrAddAnyBlock(this.$el.find('[name=fileLocationContainer]'), _.template(MongoDbJdbcFileLocationSectionTemplate, this.templateData()));    // browse button is a special component, and
        // if we render this section second time and we have this
        // component on the page we need to remove it
        // browse button is a special component, and
        // if we render this section second time and we have this
        // component on the page we need to remove it
        if (this.browseButton) {
            this.browseButton.remove();
            this.browseButton = false;
        }    // and now, under certain condition, we may create this button again
        // and now, under certain condition, we may create this button again
        if (this.model.get('fileSourceType') === 'repository' && !this.model.get('autoSchemaDefinition')) {
            this.browseButton = resourceLocator.initialize({
                i18n: i18n,
                template: selectDialogTemplate,
                resourceInput: this.$el.find('[name=repositoryFileName]')[0],
                browseButton: this.$el.find('[name=repositoryBrowserButton]')[0],
                providerId: 'fileResourceBaseTreeDataProvider',
                dialogTitle: i18n['resource.Add.Files.Title'],
                selectLeavesOnly: true,
                onChange: _.bind(function (value) {
                    this.model.set('repositoryFileName', value);
                    this.model.validate({ 'repositoryFileName': value });
                }, this)
            });
        }
    }
});