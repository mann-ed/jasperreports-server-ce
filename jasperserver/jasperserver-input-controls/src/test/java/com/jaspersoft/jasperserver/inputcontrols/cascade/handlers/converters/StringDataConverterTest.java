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

import org.junit.Before;
import org.junit.Test;

import static com.jaspersoft.jasperserver.inputcontrols.cascade.handlers.InputControlHandler.NULL_SUBSTITUTION_VALUE;
import static org.hamcrest.core.Is.is;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;

public class StringDataConverterTest {
    StringDataConverter stringDataConverter;
    @Before
    public void setup() {
        stringDataConverter = new StringDataConverter();
    }
    @Test
    public void stringToValue() {
        assertEquals(stringDataConverter.stringToValue(NULL_SUBSTITUTION_VALUE), null);

        String expected = "value";
        String actual = stringDataConverter.stringToValue("value");
        assertThat(expected, is(actual));
    }

    @Test
    public void valueToString() {
        assertEquals(stringDataConverter.valueToString(null), NULL_SUBSTITUTION_VALUE);

        String expected = "value";
        String actual = stringDataConverter.valueToString("value");
        assertThat(expected, is(actual));
    }
}
