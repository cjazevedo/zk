/* AreaRenderer.java

{{IS_NOTE
	Purpose:
		
	Description:
		
	History:
		Tue Aug 1 14:04:21     2006, Created by henrichen@potix.com
}}IS_NOTE

Copyright (C) 2006 Potix Corporation. All Rights Reserved.

{{IS_RIGHT
	This program is distributed under GPL Version 2.0 in the hope that
	it will be useful, but WITHOUT ANY WARRANTY.
}}IS_RIGHT
*/
package com.potix.zul.html;

/**
 * Identifies area inside a chart that can be customized.
 *
 * @author <a href="mailto:henri@potix.com">henri@potix.com</a>
 * @see Chart
 */
public interface AreaRenderer {
	/** Renders the data to the specified area. When this method is called, the 
	 * area has been initiated with its default value already. Each time the 
	 * chart is repainted, the area is new created.
	 *
	 * @param area the area to render the result.
	 * Note: when this method is called, the area has been initiated with
	 * its default value already.
	 * @param data generic data used to pass data from {@link ChartEngine}.
	 */
	public void render(Area area, Object data) throws Exception;
}
