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

import Tree from 'js-sdk/src/common/component/tree/Tree';
import $ from 'jquery';
import _ from 'underscore';
import TreeDataLayer from 'js-sdk/src/common/component/tree/TreeDataLayer';
import TooltipTreePlugin from 'js-sdk/src/common/component/tree/plugin/TooltipPlugin';
import ContextMenuTreePlugin from 'js-sdk/src/common/component/tree/plugin/ContextMenuTreePlugin';
import tenantTreeDataUriTemplateUtil from '../utils/tenantTreeDataUriTemplateUtil';
import i18n from 'js-sdk/src/i18n/CommonBundle.properties';
import jrsConfigs from 'js-sdk/src/jrs.configs';

var processors = {
    tenantProcessor: function (tenantId) {
        return {
            processItem: function (item) {
                item._node = true;
                item.label = item.value.tenantName;
                item.value.label = item.label;
                item.value.uri = item.value.tenantUri;
                item.id === tenantId && (item.addToSelection = true);
                return item;
            }
        };
    }
};
export default function (options) {
    var comparator = options.comparator, TreeWithPlugins = Tree.use(TooltipTreePlugin, {
        i18n: i18n,
        contentTemplate: options.tooltipContentTemplate
    });
    if (options.contextMenu) {
        TreeWithPlugins = TreeWithPlugins.use(ContextMenuTreePlugin, { contextMenu: options.contextMenu });
    }
    return TreeWithPlugins.create().instance(_.extend({}, {
        selection: {
            allowed: {
                left: true,
                right: true
            },
            multiple: false
        },
        rootless: true,
        collapsed: true,
        lazyLoad: true,
        bufferSize: 5000,
        allowMouseDownEventPropagation: true,
        dataUriTemplate: tenantTreeDataUriTemplateUtil({
            contextPath: jrsConfigs.contextPath
        }),
        levelDataId: 'id',
        getDataArray: function (data, status, xhr) {
            var orgs = data ? data['organization'] : [];
            comparator && orgs.sort(comparator);
            return orgs;
        },
        processors: [processors.tenantProcessor(options.tenantId)],
        customDataLayers: {
            //workaround for correct viewing of '/' tenant label
            '/': _.extend(new TreeDataLayer({
                dataUriTemplate: jrsConfigs.contextPath + '/flow.html?_flowId=treeFlow&method=getNode&provider=tenantTreeFoldersProvider&uri=/',
                processors: [processors.tenantProcessor(options.tenantId)],
                getDataArray: function (data) {
                    data = JSON.parse($(data).text());
                    return [{
                        id: data.id,
                        tenantName: data.label,
                        tenantUri: '/',
                        resourceType: 'folder',
                        _links: { content: '@fakeContentLink' }
                    }];
                }
            }), {
                accept: 'text/html',
                dataType: 'text'
            })
        }
    }));
}