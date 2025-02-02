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

import com.jaspersoft.jasperserver.api.common.domain.impl.ExecutionContextImpl;
import com.jaspersoft.jasperserver.api.metadata.jasperreports.domain.AwsReportDataSource;
import com.jaspersoft.jasperserver.api.metadata.jasperreports.domain.client.AwsReportDataSourceImpl;
import com.jaspersoft.jasperserver.dto.common.ClientTypeUtility;
import com.jaspersoft.jasperserver.dto.resources.ClientAwsDataSource;
import org.testng.annotations.Test;

import java.util.ArrayList;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertNull;
import static org.testng.Assert.assertSame;

/**
 * <p></p>
 *
 * @author Yaroslav.Kovalchyk
 * @version $Id$
 */
public class AwsDataSourceResourceConverterTest {
    private AwsDataSourceResourceConverter converter = new AwsDataSourceResourceConverter();

    @Test
    public void correctClientServerResourceType(){
        assertEquals(converter.getClientResourceType(), ClientTypeUtility.extractClientType(ClientAwsDataSource.class));
        assertEquals(converter.getServerResourceType(), AwsReportDataSource.class.getName());
    }

    @Test
    public void resourceSpecificFieldsToServer() throws Exception {
        final String expectedAccessKey = "textAccessKey";
        final String expectedSecretKey = "testSecretKey";
        final String expectedRoleArn = "testRoleArn";
        final String expectedRegion = "testRegion";
        final String expectedDbName = "testDbName";
        final String expectedDbInstanceIdentifier = "testDbInstanceIdentifier";
        final String expectedDbService = "testDbService";
        // check driverClass field of superclass to be sure, that superclass method is called
        final String expectedDriverClass = "testDriverClass";
        AwsReportDataSource serverObject = new AwsReportDataSourceImpl();
        ClientAwsDataSource clientObject = new ClientAwsDataSource();
        clientObject.setAccessKey(expectedAccessKey);
        clientObject.setDbInstanceIdentifier(expectedDbInstanceIdentifier);
        clientObject.setDbName(expectedDbName);
        clientObject.setDbService(expectedDbService);
        clientObject.setRegion(expectedRegion);
        clientObject.setRoleArn(expectedRoleArn);
        clientObject.setSecretKey(expectedSecretKey);
        clientObject.setDriverClass(expectedDriverClass);
        final AwsReportDataSource result = converter.resourceSpecificFieldsToServer(    ExecutionContextImpl.getRuntimeExecutionContext()
                , clientObject, serverObject, new ArrayList<Exception>(), null);
        assertSame(result, serverObject);
        assertEquals(result.getAWSSecretKey(), expectedSecretKey);
        assertEquals(result.getAWSAccessKey(), expectedAccessKey);
        assertEquals(result.getAWSRegion(), expectedRegion);
        assertEquals(result.getRoleARN(), expectedRoleArn);
        assertEquals(result.getDbInstanceIdentifier(), expectedDbInstanceIdentifier);
        assertEquals(result.getDbName(), expectedDbName);
        assertEquals(result.getDbService(), expectedDbService);
        assertEquals(result.getDriverClass(), expectedDriverClass);
    }

    @Test
    public void resourceSpecificFieldsToClient(){
        final String expectedAccessKey = "textAccessKey";
        final String expectedSecretKey = "testSecretKey";
        final String expectedRoleArn = "testRoleArn";
        final String expectedRegion = "testRegion";
        final String expectedDbName = "testDbName";
        final String expectedDbInstanceIdentifier = "testDbInstanceIdentifier";
        final String expectedDbService = "testDbService";
        // check driverClass field of superclass to be sure, that superclass method is called
        final String expectedDriverClass = "testDriverClass";
        AwsReportDataSource serverObject = new AwsReportDataSourceImpl();
        ClientAwsDataSource clientObject = new ClientAwsDataSource();
        serverObject.setAWSAccessKey(expectedAccessKey);
        serverObject.setDbInstanceIdentifier(expectedDbInstanceIdentifier);
        serverObject.setDbName(expectedDbName);
        serverObject.setDbService(expectedDbService);
        serverObject.setAWSRegion(expectedRegion);
        serverObject.setRoleARN(expectedRoleArn);
        serverObject.setAWSSecretKey(expectedSecretKey);
        serverObject.setDriverClass(expectedDriverClass);
        final ClientAwsDataSource result = converter.resourceSpecificFieldsToClient(clientObject, serverObject, null);
        assertSame(result, clientObject);
        assertNull(result.getSecretKey());
        assertEquals(result.getAccessKey(), expectedAccessKey);
        assertEquals(result.getRegion(), expectedRegion);
        assertEquals(result.getRoleArn(), expectedRoleArn);
        assertEquals(result.getDbInstanceIdentifier(), expectedDbInstanceIdentifier);
        assertEquals(result.getDbName(), expectedDbName);
        assertEquals(result.getDbService(), expectedDbService);
        assertEquals(result.getDriverClass(), expectedDriverClass);
    }

    @Test
    public void resourceSpecificFieldsToClient_secretKeyRemainUnchangedIfNullInClientObject(){
        final String expectedSecretKey = "testSecretKey";
        AwsReportDataSource serverObject = new AwsReportDataSourceImpl();
        serverObject.setAWSSecretKey(expectedSecretKey);
        ClientAwsDataSource clientObject = new ClientAwsDataSource();
        final ClientAwsDataSource result = converter.resourceSpecificFieldsToClient(clientObject, serverObject, null);
        assertSame(result, clientObject);
        assertNull(clientObject.getSecretKey());
        assertEquals(serverObject.getAWSSecretKey(), expectedSecretKey);
    }

    @Test
    public void resourceSpecificFieldsToServer_secretKeyChangedToValueInClientObjectIfAccessKeyNull(){
        AwsReportDataSource serverObject = new AwsReportDataSourceImpl();
        serverObject.setAWSSecretKey("Old Value");

        ClientAwsDataSource clientObject = new ClientAwsDataSource();

        final AwsReportDataSource result = converter.resourceSpecificFieldsToServer(    ExecutionContextImpl.getRuntimeExecutionContext()
                , clientObject, serverObject, new ArrayList<Exception>(), null);
        assertNull(result.getAWSSecretKey());
    }

    @Test
    public void resourceSecureFieldsToClient_resultContainsSecretKey(){
        final String expectedSecretKey = "testSecretKey";
        final String expectedPassword = "testPassword";
        AwsReportDataSource serverObject = new AwsReportDataSourceImpl();
        serverObject.setAWSSecretKey(expectedSecretKey);
        serverObject.setPassword(expectedPassword);
        ClientAwsDataSource clientObject = new ClientAwsDataSource();

        converter.resourceSecureFieldsToClient(clientObject, serverObject, null);

        assertEquals(clientObject.getSecretKey(), expectedSecretKey);
        assertEquals(clientObject.getPassword(), expectedPassword);
    }

}
