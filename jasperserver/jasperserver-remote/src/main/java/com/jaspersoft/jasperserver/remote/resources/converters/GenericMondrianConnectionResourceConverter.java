/*
 * Copyright (C) 2005-2023. Cloud Software Group, Inc. All Rights Reserved.
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
package com.jaspersoft.jasperserver.remote.resources.converters;

import com.jaspersoft.jasperserver.api.common.domain.ExecutionContext;
import com.jaspersoft.jasperserver.api.metadata.common.domain.ResourceReference;
import com.jaspersoft.jasperserver.api.metadata.common.domain.util.ToClientConversionOptions;
import com.jaspersoft.jasperserver.api.metadata.olap.domain.MondrianConnection;
import com.jaspersoft.jasperserver.dto.resources.AbstractClientMondrianConnection;
import com.jaspersoft.jasperserver.dto.resources.ClientFile;
import com.jaspersoft.jasperserver.dto.resources.ClientReferenceableFile;
import com.jaspersoft.jasperserver.remote.exception.IllegalParameterValueException;
import com.jaspersoft.jasperserver.remote.exception.MandatoryParameterNotFoundException;

import java.util.List;

/**
 * <p></p>
 *
 * @author Yaroslav.Kovalchyk
 * @version $Id$
 */
public class GenericMondrianConnectionResourceConverter
        <MondrianConnectionServerSubType extends MondrianConnection,MondrianConnectionClientSubType extends AbstractClientMondrianConnection<MondrianConnectionClientSubType>>
        extends  DataSourceHolderResourceConverter<MondrianConnectionServerSubType, MondrianConnectionClientSubType>{
    @Override
    protected void setDataSourceToResource(ResourceReference dataSourceReference, MondrianConnectionServerSubType resource) {
        resource.setDataSource(dataSourceReference);
    }

    @Override
    protected ResourceReference getDataSourceFromResource(MondrianConnection resource) {
        return resource.getDataSource();
    }

    @Override
    protected MondrianConnectionServerSubType resourceSpecificFieldsToServer(ExecutionContext ctx, MondrianConnectionClientSubType clientObject, MondrianConnectionServerSubType resultToUpdate, List<Exception> exceptions, ToServerConversionOptions options) throws IllegalParameterValueException, MandatoryParameterNotFoundException {
        resultToUpdate.setSchema(resourceReferenceConverterProvider.getConverterForType(ClientReferenceableFile.class)
                .addReferenceRestriction(new ResourceReferenceConverter.FileTypeRestriction(ClientFile.FileType.olapMondrianSchema))
                .toServer(ctx, clientObject.getSchema(), resultToUpdate.getSchema(), options));
        return resultToUpdate;
    }

    @Override
    protected MondrianConnectionClientSubType resourceSpecificFieldsToClient(MondrianConnectionClientSubType client, MondrianConnectionServerSubType serverObject, ToClientConversionOptions options) {
        client.setSchema(resourceReferenceConverterProvider.getConverterForType(ClientReferenceableFile.class)
                .toClient(serverObject.getSchema(), options));
        return client;
    }
}
