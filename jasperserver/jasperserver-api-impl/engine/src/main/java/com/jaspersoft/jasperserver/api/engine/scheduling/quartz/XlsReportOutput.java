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

package com.jaspersoft.jasperserver.api.engine.scheduling.quartz;

import java.io.IOException;
import java.io.OutputStream;
import java.util.Collections;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.jaspersoft.jasperserver.api.JSExceptionWrapper;
import com.jaspersoft.jasperserver.api.engine.jasperreports.common.XlsExportParametersBean;
import com.jaspersoft.jasperserver.api.engine.jasperreports.util.ExportUtil;
import com.jaspersoft.jasperserver.api.engine.scheduling.domain.ReportJob;
import com.jaspersoft.jasperserver.api.metadata.common.domain.ContentResource;
import com.jaspersoft.jasperserver.api.metadata.common.domain.DataContainer;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JRPropertiesHolder;
import net.sf.jasperreports.engine.JRPropertiesUtil;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.export.JRExporterContext;
import net.sf.jasperreports.engine.export.JRXlsAbstractExporter;
import net.sf.jasperreports.export.AbstractXlsExporterConfiguration;
import net.sf.jasperreports.export.AbstractXlsReportConfiguration;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleExporterInputItem;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;
import net.sf.jasperreports.export.SimpleXlsReportConfiguration;
import net.sf.jasperreports.export.XlsExporterConfiguration;
import net.sf.jasperreports.export.XlsReportConfiguration;


/**
 * @author sanda zaharia (shertage@users.sourceforge.net)
 * @version $Id$
 */
public class XlsReportOutput extends AbstractReportOutput
{

	private static final Log log = LogFactory.getLog(XlsReportOutput.class);

	private XlsExportParametersBean exportParams;
	public XlsReportOutput()
	{
	}

	@Override
	protected DataContainer export(ReportJobContext jobContext, 
			JasperPrint jasperPrint, Integer startPageIndex, Integer endPageIndex) {
		try {
			ExportUtil exportUtil = ExportUtil.getInstance(getJasperReportsContext());
			JRXlsAbstractExporter<? extends XlsReportConfiguration, ? extends XlsExporterConfiguration, ? extends JRExporterContext> exporter = exportUtil.createXlsExporter();
			SimpleXlsReportConfiguration reportConfiguration = new SimpleXlsReportConfiguration();
			reportConfiguration.setStartPageIndex(startPageIndex);
			reportConfiguration.setEndPageIndex(endPageIndex);
            exporter.setExporterInput(new SimpleExporterInput(Collections.singletonList(
            		new SimpleExporterInputItem(jasperPrint, reportConfiguration))));
			
			boolean close = false;
			DataContainer xlsData = jobContext.createDataContainer(this);
			OutputStream xlsDataOut = xlsData.getOutputStream();
			try {
	            SimpleOutputStreamExporterOutput exporterOutput = new SimpleOutputStreamExporterOutput(xlsDataOut);
	            exporter.setExporterOutput(exporterOutput);
	            
				if(exportParams != null)
				{
					AbstractXlsReportConfiguration configuration = exportUtil.createXlsReportConfiguration();
					configuration.setOnePagePerSheet(exportParams.getOnePagePerSheet());
					configuration.setDetectCellType(exportParams.getDetectCellType());
					configuration.setRemoveEmptySpaceBetweenRows(exportParams.getRemoveEmptySpaceBetweenRows());
					configuration.setRemoveEmptySpaceBetweenColumns(exportParams.getRemoveEmptySpaceBetweenColumns());
					configuration.setWhitePageBackground(exportParams.getWhitePageBackground());
					configuration.setIgnoreGraphics(exportParams.getIgnoreGraphics());
					configuration.setCollapseRowSpan(exportParams.getCollapseRowSpan());
					configuration.setIgnoreCellBorder(exportParams.getIgnoreCellBorder());
					configuration.setFontSizeFixEnabled(exportParams.getFontSizeFixEnabled());
					configuration.setMaxRowsPerSheet(exportParams.getMaximumRowsPerSheet());
					configuration.setFormatPatternsMap(exportParams.getXlsFormatPatternsMap());
					exportUtil.setConfiguration(exporter, configuration);
				}
				
	            AbstractXlsExporterConfiguration exporterConfiguration = exportUtil.createXlsExporterConfiguration();
	            exporterConfiguration.setCreateCustomPalette(Boolean.TRUE);
				exportUtil.setConfiguration(exporter, exporterConfiguration);
				
				exporter.exportReport();

				close = false;
				xlsDataOut.close();
				return xlsData;
			} catch (IOException e) {
				throw new JSExceptionWrapper(e);
			} finally {
				if (close) {
					try {
						xlsDataOut.close();
					} catch (IOException e) {
						log.error("Error closing stream", e);
					}
				}
			}
		} catch (JRException e) {
			throw new JSExceptionWrapper(e);
		}
	}

	@Override
	protected String getBaseFilename(ReportJobContext jobContext, ReportJob outputJobDetails) {
		String baseFilename = super.getBaseFilename(jobContext, outputJobDetails);
		if (isIgnorePagination() != null && isIgnorePagination()
				&& jobContext.hasOutput(ReportJob.OUTPUT_FORMAT_XLS))
		{
			//we have both paginated and unpaginated XLS outputs, we need a different name
			baseFilename += "_nopag";
		}
		return baseFilename;
	}

	/**
	 * @return Returns the exportParams.
	 */
	public XlsExportParametersBean getExportParams() {
		return exportParams;
	}

	/**
	 * @param exportParams The exportParams to set.
	 */
	public void setExportParams(XlsExportParametersBean exportParams) {
		this.exportParams = exportParams;
	}
	
	@Override
	public Boolean isPaginationPreferred(JRPropertiesHolder propertiesHolder){
		Boolean isPaginationPreferred = super.isPaginationPreferred(propertiesHolder);
		if (isPaginationPreferred == null)
		{
			if (propertiesHolder != null)
			{
				isPaginationPreferred = JRPropertiesUtil.getInstance(getJasperReportsContext()).getBooleanProperty(propertiesHolder.getPropertiesMap(), XlsExportParametersBean.PROPERTY_XLS_PAGINATED);
			}
		}
		return isPaginationPreferred;
	}
	
	@Override
	public String getFileExtension() {
		return "xls";
	}
	
	@Override
	public String getFileType() {
		return ContentResource.TYPE_XLS;
	}
}
