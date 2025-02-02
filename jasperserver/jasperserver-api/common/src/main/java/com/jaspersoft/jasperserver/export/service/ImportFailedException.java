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
package com.jaspersoft.jasperserver.export.service;

/*
*  @author inesterenko
*/
public class ImportFailedException extends Exception {

    private String errorCode;
    private String[] parameters;

    public ImportFailedException(String message) {
        super(message);

        errorCode = message;
    }

    public ImportFailedException(String message, String errorCode, String[] parameters) {
        super(message);

        this.errorCode = errorCode;
        this.parameters = parameters;
    }

    public ImportFailedException(String errorCode, String[] parameters) {
        super(errorCode);

        this.errorCode = errorCode;
        this.parameters = parameters;
    }

    @Override
    public String getMessage() {
        return super.getMessage() == null ? errorCode : super.getMessage();
    }

    public String getErrorCode() {
        return errorCode == null ? super.getMessage() : errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public String[] getParameters() {
        return parameters;
    }

    public void setParameters(String[] parameters) {
        this.parameters = parameters;
    }
}
