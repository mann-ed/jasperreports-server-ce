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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class MultiPartName {
    private List<String> parts;

    public MultiPartName(String... parts) {
        this.parts = Arrays.asList(parts);
    }
    public MultiPartName(List<String> parts) {
        this.parts = new ArrayList<>(parts);
    }

    public List<String> getParts() {
        return Collections.unmodifiableList(parts);
    }

    public boolean equals(Object o) {
        return o instanceof MultiPartName && ((MultiPartName) o).parts.equals(parts);
    }

    public int hashCode() {
        return parts.hashCode();
    }
}

