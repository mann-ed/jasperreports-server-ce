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

package com.jaspersoft.jasperserver.api.metadata.common.service.impl.hibernate.util;

import org.hibernate.criterion.LikeExpression;
import org.hibernate.criterion.MatchMode;

import static com.jaspersoft.jasperserver.api.metadata.common.service.impl.hibernate.util.LikeEscapeAwareExpression.checkEscapeChar;
import static com.jaspersoft.jasperserver.api.metadata.common.util.DatabaseCharactersEscapeResolver.ESCAPE_CHAR;

/**
 * A criterion representing a case-insensitive "like" expression
 * that explicitly specifies escape character.
 *
 * @author Vladimir Tsukur
 */
public class IlikeEscapeAwareExpression extends LikeExpression {

    /**
     * Constructs new instance with specified property name, value and match mode.
     *
     * @param propertyName name of the property to match value of.
     * @param value value of the property to match.
     * @param matchMode match mode.
     */
    public IlikeEscapeAwareExpression(String propertyName, String value, MatchMode matchMode) {
        super(propertyName, value, matchMode, ESCAPE_CHAR, true);
    }

    public IlikeEscapeAwareExpression(String propertyName, String value, MatchMode matchMode, Character escapeChar) {
        super(propertyName, value, matchMode, escapeChar, true);

        checkEscapeChar(escapeChar);
    }

    public IlikeEscapeAwareExpression(String propertyName, String value, Character escapeChar) {
        super(propertyName, value, escapeChar, true);

        checkEscapeChar(escapeChar);
    }
}
