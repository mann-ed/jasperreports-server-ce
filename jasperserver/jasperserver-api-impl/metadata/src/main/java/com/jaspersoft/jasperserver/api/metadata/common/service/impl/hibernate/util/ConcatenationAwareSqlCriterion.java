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

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.Criteria;
import org.hibernate.HibernateException;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.CriteriaQuery;
import org.hibernate.criterion.SQLCriterion;
import org.hibernate.dialect.DB2Dialect;
import org.hibernate.dialect.Dialect;
import org.hibernate.dialect.Oracle8iDialect;
import org.hibernate.dialect.SQLServerDialect;
import org.hibernate.engine.jdbc.spi.JdbcServices;
import org.hibernate.engine.spi.SessionFactoryImplementor;
import org.hibernate.type.Type;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;


import org.hibernate.internal.util.collections.ArrayHelper;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * <p>Solves inconsistency with concatenation between different databases</p>
 *
 * @author Zakhar Tomchenko
 * @version $Id: $
 */
public class ConcatenationAwareSqlCriterion extends SQLCriterion {
    private static final Pattern CONCAT_EXPR = Pattern.compile("CONCAT\\s*\\([^()]*\\)");
    
    @Autowired
    @Qualifier("sessionFactory") SessionFactory sessionFactory; 

	private static final Log log = LogFactory.getLog(ConcatenationAwareSqlCriterion.class);

    ConcatenationAwareSqlCriterion(String sql, Object[] values, Type[] types) {
        super(sql, values, types);
    }

    ConcatenationAwareSqlCriterion(String sql) {
        super(sql, ArrayHelper.EMPTY_OBJECT_ARRAY, ArrayHelper.EMPTY_TYPE_ARRAY);
    }

    @Override
    public String toSqlString(Criteria criteria, CriteriaQuery criteriaQuery) throws HibernateException {
        String sql = super.toSqlString(criteria, criteriaQuery);
        
        if(sessionFactory==null){
        	log.error("ConcatenationAware: NO SESSION FACTORY!!!");
        	return sql;
        }
        
        log.error("ConcatenationAware: getting dialect from " + sessionFactory.toString());
        
        Dialect dialect = ((SessionFactoryImplementor)sessionFactory)
        	.getServiceRegistry()
        	.getService(JdbcServices.class)
        		.getDialect();
        
        log.error("ConcatenationAware: dialect=" + dialect + "\ntransforming: " + sql);
        
        if (dialect instanceof SQLServerDialect){
            sql = replaceToOperator(sql, "+");
        }

        if (dialect instanceof Oracle8iDialect){
            sql = replaceToOperator(sql, "||");
        }

        if (dialect instanceof DB2Dialect){
            sql = replaceToOperator(sql, null);
        }

        String ret = replaceToOperator(sql, null);
    
        log.error("ConcatenationAware: final result: " + ret);
        return ret;
    }

    private String replaceToOperator(String sql, String operator){
        Matcher matcher = CONCAT_EXPR.matcher(sql);

        if (matcher.find()){
            String[] exprParts = CONCAT_EXPR.split(sql);
            List<String> funcs = new ArrayList<String>();
            funcs.add(matcher.group());

            while (matcher.find(matcher.end())){
                funcs.add(matcher.group());
            }

            StringBuilder newSql = new StringBuilder();
            for (int i = 0; i< Math.max(exprParts.length, funcs.size()); i++){
                if (i < exprParts.length){
                    newSql.append(exprParts[i]);
                }

                if (i < funcs.size()){
                    newSql.append(replaceFunctionToOperator(funcs.get(i), operator));
                }
            }
            sql = newSql.toString();
        }

        return sql;
    }

    private String replaceFunctionToOperator(String group, String operator) {
        String part = group.substring(group.indexOf('(') + 1, group.lastIndexOf(')'));

        if (operator == null){
            String [] exprs = part.split(",");

            for (int i = exprs.length - 1; i > 0; i--){
                exprs[i-1] = "CONCAT( " + exprs[i-1] + " , " + exprs[i] + " )";
            }

            return exprs[0];
        }

        return part.replace(",", operator);
    }
}