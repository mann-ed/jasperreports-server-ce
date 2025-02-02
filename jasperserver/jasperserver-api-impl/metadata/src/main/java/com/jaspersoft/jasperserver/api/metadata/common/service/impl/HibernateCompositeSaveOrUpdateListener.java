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
package com.jaspersoft.jasperserver.api.metadata.common.service.impl;

import java.util.Iterator;
import java.util.List;

import org.hibernate.HibernateException;
import org.hibernate.event.spi.SaveOrUpdateEvent;
import org.hibernate.event.internal.DefaultSaveOrUpdateEventListener;

/**
 * @author Lucian Chirita (lucianc@users.sourceforge.net)
 * @version $Id$
 */
public class HibernateCompositeSaveOrUpdateListener extends DefaultSaveOrUpdateEventListener {
	
	private List listeners;

	public List getListeners() {
		return listeners;
	}

	public void setListeners(List listeners) {
		this.listeners = listeners;
	}

	public void onSaveOrUpdate(final SaveOrUpdateEvent event) throws HibernateException {
		visitListeners(new ListenerVisitor() {
			public void visit(HibernateSaveOrUpdateListener listener) {
				listener.beforeSaveOrUpdate(event);
			}
		});
		
		super.onSaveOrUpdate(event);
		
		visitListeners(new ListenerVisitor() {
			public void visit(HibernateSaveOrUpdateListener listener) {
				listener.afterSaveOrUpdate(event);
			}
		});
	}

	protected static interface ListenerVisitor {
		void visit(HibernateSaveOrUpdateListener listener);
	}
	
	protected void visitListeners(ListenerVisitor visitor) {
		if (listeners != null && !listeners.isEmpty()) {
			for (Iterator it = listeners.iterator(); it.hasNext();) {
				HibernateSaveOrUpdateListener listener = (HibernateSaveOrUpdateListener) it.next();
				visitor.visit(listener);
			}
		}
	}

}
