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
 * @author: Olesya Bobruyko
 * @version: $Id$
 */

import i18n from '../../../i18n/ImportExportBundle.properties';
import _ from 'underscore';

var errorCodeToMessageMap = {};

errorCodeToMessageMap["import.resource.uri.too.long"] = [
    {
        msg: i18n["import.resource.uri.too.long"],
        parameters: ["resourceURI"]
    },
    {
        msg: i18n["import.resource.uri.too.long.length"],
        parameters: ["resourceURI", "maxURILength"]
    }
];

errorCodeToMessageMap["import.access.denied"] = [
    {
        msg: i18n["import.access.denied"],
        parameters: ["resourceURI"]
    }
];

errorCodeToMessageMap["import.resource.not.found"] = [
    {
        msg: i18n["import.resource.not.found"],
        parameters: ["resourceURI"]
    }
];

errorCodeToMessageMap["import.resource.different.type.already.exists"] = [
    {
        msg: i18n["import.resource.different.type.already.exists"],
        parameters: ["resourceURI"]
    }
];

errorCodeToMessageMap["import.resource.uri.not.valid"] = [
    {
        msg: i18n["import.resource.uri.not.valid"],
        parameters: ["resourceURI"]
    }
];

errorCodeToMessageMap["import.resource.data.missing"] = [
    {
        msg: i18n["import.resource.data.missing"],
        parameters: ["resourceURI"]
    }
];

errorCodeToMessageMap["import.reference.resource.not.found"] = [
    {
        msg: i18n["import.reference.resource.not.found"],
        parameters: ["resourceURI"]
    },
    {
        msg: i18n["import.reference.dependent.resource.not.found"],
        parameters: ["dependentResourceURI", "resourceURI"]
    }
];

errorCodeToMessageMap["import.resource.attached.not.exist.org"] = [
    {
        msg: i18n["import.resource.attached.not.exist.org"],
        parameters: ["resourceURI"]
    }
];

errorCodeToMessageMap["import.folder.attached.not.exist.org"] = [
    {
        msg: i18n["import.folder.attached.not.exist.org"],
        parameters: ["resourceURI"]
    }
];

errorCodeToMessageMap["import.multi.tenancy.not.supported"] = [
    {
        msg: i18n["import.multi.tenancy.not.supported"],
        parameters: ["organizationId"]
    }
];

errorCodeToMessageMap["import.skip.resource"] = [
    {
        msg: i18n["import.skip.resource"],
        parameters: ["resourceURI"]
    }
];

errorCodeToMessageMap["import.report.job.reference.resource.not.found"] = [
    {
        msg: i18n["import.report.job.reference.resource.not.found"],
        parameters: ["resourceURI"]
    },
    {
        msg: i18n["import.report.job.reference.dependent.resource.not.found"],
        parameters: ["dependentResourceURI", "resourceURI"]
    }
];

function getParamsObject(paramsNames, parameters) {
    var paramsObj = {};

    _.each(paramsNames, function(param, index) {
        paramsObj[param] = parameters[index];
    });

    return paramsObj;
}

export default function(warning) {
    var code = warning.code,
        parameters = warning.parameters,
        msgObj = errorCodeToMessageMap[code],
        msg;

    msg = _.template(msgObj[parameters.length - 1].msg)(getParamsObject(msgObj[parameters.length - 1].parameters, parameters));

    return msg;
}