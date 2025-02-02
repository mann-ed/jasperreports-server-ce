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
package com.jaspersoft.jasperserver.dto.connection.datadiscovery;

import org.junit.Assert;
import org.junit.Test;

/**
 * <p></p>
 *
 * @author yaroslav.kovalchyk
 * @version $Id$
 */
public class DotByTildaEscapeUtilTest {
    private DotByTildaEscapeUtil util = new DotByTildaEscapeUtil();
    @Test
    public void escapeDot(){
        Assert.assertEquals("blah~.blah~~~.~~~~~.blah~~blah~~~~", util.escapeDot("blah.blah~.~~.blah~blah~~"));
    }
    
    @Test
    public void unEscapeDot(){
        Assert.assertEquals("blah.blah~.~~.blah~blah~~", util.unEscapeDot("blah~.blah~~~.~~~~~.blah~~blah~~~~"));
    }

    @Test
    public void splitByDotUnEscapeTokens(){
        final String[] strings = util.splitByDotUnEscapeTokens("blah~.blah~~~.~~~~~.blah~~blah~~~~" +
                "." +
                "blah~.blah~~~.~~~~~.blah~~blah~~~~" +
                "." +
                "blah~.blah~~~.~~~~~.blah~~blah~~~~");
        Assert.assertNotNull(strings);
        Assert.assertEquals(3, strings.length);
        for (String string : strings) {
            Assert.assertEquals("blah.blah~.~~.blah~blah~~", string);
        }
    }
    
    @Test
    public void toDotQualifiedString(){
        final String path = util.toDotQualifiedString(new String[]{
                "blah.blah~.~~.blah~blah~~",
                "blah.blah~.~~.blah~blah~~",
                "blah.blah~.~~.blah~blah~~"});
        Assert.assertEquals("blah~.blah~~~.~~~~~.blah~~blah~~~~" +
                "." +
                "blah~.blah~~~.~~~~~.blah~~blah~~~~" +
                "." +
                "blah~.blah~~~.~~~~~.blah~~blah~~~~", path);

    }
}
