//==============================================================================
//
//  TOBESOFT Co., Ltd.
//  Copyright 2017 TOBESOFT Co., Ltd.
//  All Rights Reserved.
//
//  NOTICE: TOBESOFT permits you to use, modify, and distribute this file 
//          in accordance with the terms of the license agreement accompanying it.
//
//  Readme URL: http://www.nexacro.co.kr/legal/nexacro17-public-license-readme-1.1.html
//
//==============================================================================

if (nexacro.ChartJS) {
	var _pChartJS = nexacro.ChartJS.prototype;

	_pChartJS.on_apply_text = function (text) {
		var cellElem = this._cell_elem;
		if (cellElem) {
			if (this.usedecorate) {
				cellElem.setElementDecorateText(text);
			}
			else {
				cellElem.setElementText(text);
			}
		}
	};

	_pChartJS.createCssDesignContents = function () {
		this.set_text();
	};

	delete _pChartJS;
}
