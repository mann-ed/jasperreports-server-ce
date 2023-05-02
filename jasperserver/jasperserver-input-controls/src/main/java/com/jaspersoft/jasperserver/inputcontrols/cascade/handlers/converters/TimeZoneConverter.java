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
package com.jaspersoft.jasperserver.inputcontrols.cascade.handlers.converters;

import com.jaspersoft.jasperserver.api.JSValidationException;
import com.jaspersoft.jasperserver.core.util.type.MultipleTypeProcessor;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.TimeZone;

@Service
public class TimeZoneConverter implements DataConverter<TimeZone>, MultipleTypeProcessor {
    @Override
    public TimeZone stringToValue(String rawData) throws JSValidationException {
        return StringUtils.isNotEmpty(rawData) ? TimeZone.getTimeZone(rawData) : null;
    }

    @Override
    public String valueToString(TimeZone value) {
        return value.getID();
    }

    @Override
    public List<Class<?>> getProcessableTypes(Class<?> processorClass) {
        List<Class<?>> types = new ArrayList<>();
        types.add(TimeZone.class);
        // Get JVM specific implementation
        types.add( TimeZone.getDefault().getClass() );
        return types;
    }
}
