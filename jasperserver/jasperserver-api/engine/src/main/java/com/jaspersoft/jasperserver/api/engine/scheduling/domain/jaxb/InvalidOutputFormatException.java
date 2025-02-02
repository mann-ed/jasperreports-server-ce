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
package com.jaspersoft.jasperserver.api.engine.scheduling.domain.jaxb;

import java.util.Collections;

import com.jaspersoft.jasperserver.api.ErrorDescriptorException;
import com.jaspersoft.jasperserver.dto.common.ErrorDescriptor;
import com.jaspersoft.jasperserver.dto.resources.ClientProperty;

/**
 * 
 * @author Lucian Chirita (lucianc@users.sourceforge.net)
 */
public class InvalidOutputFormatException extends ErrorDescriptorException {

	private static final long serialVersionUID = 1L;
	
	public static final String ERROR_CODE_INVALID_EXPORT_FORMAT = "scheduling.invalid.output.format";

	private static ErrorDescriptor errorDescriptor(String outputFormat) {
		return new ErrorDescriptor().setErrorCode(ERROR_CODE_INVALID_EXPORT_FORMAT)
				.setProperties(Collections.singletonList(new ClientProperty("outputFormat", outputFormat)))
				.setMessage("Output format " + outputFormat + " is invalid.");
	}
	
	public InvalidOutputFormatException(String outputFormat) {
		super(errorDescriptor(outputFormat));
	}
	
}
