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
import _ from 'underscore';
import i18n from '../../i18n/all.properties';
import Backbone from 'backbone';
import jrsConfigs from 'js-sdk/src/jrs.configs';
import schedulerUtils from '../util/schedulerUtils';
import JobModel from '../model/JobModel';
import JobsView from './JobsView';
import JobEditorView from './JobEditorView';
import { ControlsBase } from "../../controls/controls.base";

_.extend(ControlsBase, jrsConfigs.inputControlsConstants);

export default Backbone.View.extend({

    className: 'schedulerApp',
    // initial state of the views

    jobsView: false,
    // initialize app

    _createJobModel: function() {
        return new JobModel();
    },

    _createJobsView: function(options) {
        return new JobsView(options);
    },

    _createJobEditorView: function(options) {
        return new JobEditorView(options);
    },

    _getChildViewInitParams: function () {
        return {
            model: this._createJobModel(),
            runInBackgroundMode: this.runInBackgroundMode,
            masterViewMode: this.masterViewMode,
            reportUri: this.schedulerStartupParams['reportUnitURI'],
            parentReportURI: this.schedulerStartupParams['parentReportURI'] || null,
            schedulerAccelator:this.schedulerAccelator
        }
    },

    initialize: function (options) {
        this.options = _.extend({}, options);

        // check if we have a mark which says "simply create a job to execute immediately and exit"
        this.runInBackgroundMode = document.location.hash.indexOf('#runInBackground@') === 0;

        // saving the URL from which we came - we need this url when user would like to get back
        schedulerUtils.saveCurrentLocation();

        // not, get our parameters from URL
        this.schedulerStartupParams = schedulerUtils.getParamsFromUri();

        // Master View Mode (MVM) is a mode then we only able to see the list of scheduled jobs for all
        // reports. In this mode we can't create new jobs, but we can control them: stop, continue, remove.
        this.masterViewMode = !this.schedulerStartupParams['reportUnitURI'];

        this.schedulerAccelator= this.schedulerStartupParams['schedulerAccelerator'];

        // we have two child views: job editor and list of jobs views.
        // let's prepare the object to initialize them later
        this.childViewInitParams = this._getChildViewInitParams();

        // suppress http basic auth for all requests
        $.ajaxSetup({ headers: { 'X-Suppress-Basic': true } });

        // handle ajax errors and reload page if request unauthorized
        $(document).on('ajaxError', function (e, xhr, settings, exception) {
            if (401 === xhr.status || 'Unauthorized' === exception) {
                location.reload();
            }
        });

        // by default we open list of jobs unless we are in the 'runInBackground' mode
        if (this.runInBackgroundMode) {
            this.runNowRequest();
        } else if (this.isJobEditFromServerMonitoring()) {
            this.openEditJobInterface(this.schedulerStartupParams.jobId);
        } else {
            this.openJobsListInterface();
        }

        if(this.schedulerAccelator){
            this._openNewJobInterface();
            this.$el.addClass('schedulerAccelerator').css({
                'display':'none',
                'position':'absolute',
                'bottom':0,
                'width':'100%'
            });
        }
    },

    prepareJobsView: function () {
        if (this.jobsView) {
            return;
        }

        this.jobsView = this._createJobsView(this.childViewInitParams);
        this.listenTo(this.jobsView, 'createNewJobRequest', this.createNewJobRequest);
        this.listenTo(this.jobsView, 'runNowRequest', this.runNowRequest);
        this.listenTo(this.jobsView, 'backButtonPressed', this.backButtonPressed);
        this.listenTo(this.jobsView, 'editJobPressed', this.openEditJobInterface);
    },

    prepareJobEditorView: function () {
        if (this.jobEditorView) {
            this.jobEditorView.remove();
        }

        this.jobEditorView = this._createJobEditorView(this.childViewInitParams);
        this.listenTo(this.jobEditorView, 'errorEditingJob', this.errorEditingJob);
        this.listenTo(this.jobEditorView, 'cancelJobCreation', this.cancelJobCreation);
        this.listenTo(this.jobEditorView, 'jobHasBeenCreated', this.jobHasBeenCreated);
    },

    //=======================================================================
    // next go methods which are responsive for some actions, like show list of jobs or create a new job

    openJobsListInterface: function () {
        // prepare a view which we need for this action
        this.prepareJobsView();
        // empty container of the application
        this.$el.empty();
        // render the view
        this.jobsView.render();
        // append view into application container
        this.$el.append(this.jobsView.$el);
        this.jobsView.refresh();
        document.title = i18n['company.name'] + ': ' + i18n['report.scheduling.list.title'];
    },

    createNewJobRequest: function () {
        this._openNewJobInterface(false);
    },

    runNowRequest: function () {
        this._openNewJobInterface(true);
    },

    editJob: function (jobId) {
        this.openEditJobInterface(jobId);
    },

    // internal method, which not be called directly
    _openNewJobInterface: function (runMode) {

        // prepare a view which we need for this action
        this.prepareJobEditorView();

        // adjust the "run mode" of the view
        this.jobEditorView.setRunNowMode(runMode);

        // empty container of the application
        this.$el.empty();

        // render the view
        this.jobEditorView.renderCreateNewJobInterface();

        // append view into application container
        this.$el.append(this.jobEditorView.$el);

        // now, prepare the model to represent the new job interface
        this.jobEditorView.prepareModelForCreatingNewJob();
        document.title = i18n['company.name'] + ': ' + i18n['report.scheduling.job.edit.title'];
    },

    openEditJobInterface: function (jobId) {
        // prepare a view which we need for this action
        this.prepareJobEditorView();

        // empty container of the application
        this.$el.empty();

        // render the view
        this.jobEditorView.editExistingJob(jobId);

        // append view into application container
        this.$el.append(this.jobEditorView.$el);
        document.title = i18n['company.name'] + ': ' + i18n['report.scheduling.job.edit.title'];
    },

    backButtonPressed: function () {
        schedulerUtils.getBackToPreviousLocation();
    },

    errorEditingJob: function () {
        this.openJobsListInterface();
    },

    isJobEditFromServerMonitoring: function () {
        return this.schedulerStartupParams.jobId && this.schedulerStartupParams.jobEditFromMonitoring;
    },

    cancelJobCreation: function () {
        if (this.schedulerAccelator) {
            schedulerUtils._closeScheduleOverlay();
            schedulerUtils._detachEvents();
        }else if(this.runInBackgroundMode|| this.isJobEditFromServerMonitoring()) {
            // in 'runInBackground' mode we have to get back to previous page
            schedulerUtils.getBackToPreviousLocation();
        } else {
            // in other case, we have to show the list of jobs
            this.openJobsListInterface();
        }
    },

    jobHasBeenCreated: function () {
        if (this.runInBackgroundMode  || this.isJobEditFromServerMonitoring()) {
            // in 'runInBackground' mode we have to get back to previous page
            schedulerUtils.getBackToPreviousLocation();
        } else {
            // in other case, we have to show the list of jobs
            this.openJobsListInterface();
        }
    }
});
