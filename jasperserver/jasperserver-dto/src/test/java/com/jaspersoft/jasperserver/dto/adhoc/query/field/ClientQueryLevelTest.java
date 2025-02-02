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

package com.jaspersoft.jasperserver.dto.adhoc.query.field;

import com.jaspersoft.jasperserver.dto.adhoc.datasource.ClientDataSourceLevel;
import com.jaspersoft.jasperserver.dto.basetests.BaseDTOJSONPresentableTest;

import java.util.Arrays;
import java.util.List;

/**
 * @author Olexandr Dahno <odahno@tibco.com>
 */

class ClientQueryLevelTest extends BaseDTOJSONPresentableTest<ClientQueryLevel> {

    private static final String TEST_ID = "TEST_ID";
    private static final String TEST_ID_ALT = "TEST_ID_ALT";

    private static final String TEST_FIELD_NAME = "TEST_FILE_NAME";

    private static final String TEST_TYPE = "TEST_TYPE";

    private static final String TEST_DIMENSION = "TEST_DIMENSION";
    private static final String TEST_DIMENSION_ALT = "TEST_DIMENSION_ALT";

    private static final String TEST_HIERARCHY_NAME = "TEST_HIERARCHY_NAME";
    private static final String TEST_HIERARCHY_NAME_ALT = "TEST_HIERARCHY_NAME_ALT";

    // At the moment ClientDataSourceField and all its subclasses have measure = false;
    private static final ClientDataSourceLevel TEST_DATASOURCE_FIELD = new ClientDataSourceLevel()
            .setType(TEST_TYPE)
            .setName(TEST_FIELD_NAME)
            .setDimensionName(TEST_DIMENSION)
            .setHierarchyName(TEST_HIERARCHY_NAME);
    private static final ClientDataSourceLevel TEST_DATASOURCE_FIELD_ALT = new ClientDataSourceLevel()
            .setType(TEST_TYPE)
            .setName(TEST_FIELD_NAME);
    private static final ClientDataSourceLevel TEST_DATASOURCE_FIELD_ALT_1 = new ClientDataSourceLevel()
            .setType(TEST_TYPE)
            .setName(TEST_FIELD_NAME)
            .setDimensionName(TEST_DIMENSION);
    private static final ClientDataSourceLevel TEST_DATASOURCE_FIELD_ALT_2 = new ClientDataSourceLevel()
            .setType(TEST_TYPE)
            .setName(TEST_FIELD_NAME)
            .setDimensionName(TEST_DIMENSION)
            .setHierarchyName(TEST_HIERARCHY_NAME_ALT);
    private static final ClientDataSourceLevel TEST_DATASOURCE_FIELD_ALT_3 = new ClientDataSourceLevel()
            .setType(TEST_TYPE)
            .setName(TEST_FIELD_NAME)
            .setDimensionName(TEST_DIMENSION_ALT)
            .setHierarchyName(TEST_HIERARCHY_NAME_ALT);

    private static final String TEST_CATEGORIZER = "TEST_CATEGORIZER";
    private static final String TEST_CATEGORIZER_ALT = "TEST_CATEGORIZER_ALT";

    private static final Boolean TEST_INCLUDE_ALL = true;
    private static final Boolean TEST_INCLUDE_ALL_ALT = false;

    @Override
    protected List<ClientQueryLevel> prepareInstancesWithAlternativeParameters() {
        return Arrays.asList(
                createFullyConfiguredInstance().setId(TEST_ID_ALT),
                createFullyConfiguredInstance().setCategorizer(TEST_CATEGORIZER_ALT),
                createFullyConfiguredInstance().setDataSourceField(TEST_DATASOURCE_FIELD),
                createFullyConfiguredInstance().setDataSourceField(TEST_DATASOURCE_FIELD_ALT),
                createFullyConfiguredInstance().setDataSourceField(TEST_DATASOURCE_FIELD_ALT_1),
                createFullyConfiguredInstance().setDataSourceField(TEST_DATASOURCE_FIELD_ALT_2),
                createFullyConfiguredInstance().setDataSourceField(TEST_DATASOURCE_FIELD_ALT_3),
                createFullyConfiguredInstance().setIncludeAll(TEST_INCLUDE_ALL_ALT),
                createFullyConfiguredInstance().setId(null),
                createFullyConfiguredInstance().setFieldName(null),
                createFullyConfiguredInstance().setCategorizer(null),
                createFullyConfiguredInstance().setDataSourceField(null),
                createFullyConfiguredInstance().setIncludeAll(null)
        );
    }

    @Override
    protected ClientQueryLevel createFullyConfiguredInstance() {
        return new ClientQueryLevel()
                .setId(TEST_ID)
                .setCategorizer(TEST_CATEGORIZER)
                .setFieldName(TEST_FIELD_NAME)
                .setHierarchyName(TEST_HIERARCHY_NAME)
                .setDimension(TEST_DIMENSION)
                .setIncludeAll(TEST_INCLUDE_ALL);
    }

    @Override
    protected ClientQueryLevel createInstanceWithDefaultParameters() {
        return new ClientQueryLevel();
    }

    @Override
    protected ClientQueryLevel createInstanceFromOther(ClientQueryLevel other) {
        return new ClientQueryLevel(other);
    }
}