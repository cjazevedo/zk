/* pg.js

{{IS_NOTE
	Purpose:
		
	Description:
		
	History:
		Fri May 30 14:17:08 TST 2008, Created by gracelin
}}IS_NOTE

Copyright (C) 2008 Potix Corporation. All Rights Reserved.

{{IS_RIGHT
}}IS_RIGHT
*/

zk.load("zul.widget");


//Paging//
zkPg = {
	down_btn: null,
	
	init: function (cmp) {
		cmp.actpg = $int(getZKAttr(cmp, "actpg"));
		cmp.npg = $int(getZKAttr(cmp, "numpg"));
		
		var inputs = $es(cmp.id + "!real");
		for (var i = inputs.length; --i>=0;)
			zkTxbox.init(inputs[i]);
			
		//event for input
		for (var i = inputs.length; --i>=0;) {
			zk.listen(inputs[i], "keypress", zkPg.onkeypress);
			zk.listen(inputs[i], "keydown", zkPg.inpkeydown);
			zk.listen(inputs[i], "blur", zkPg.inpblur);
		}
		
		var tb_first = $es(cmp.id+"!tb_f");
		var tb_prev = $es(cmp.id+"!tb_p");
		var tb_next = $es(cmp.id+"!tb_n");
		var tb_last = $es(cmp.id+"!tb_l");
		
		for (var i = tb_first.length; --i>=0;) {
			zk.listen(tb_first[i], "click", zkPg.onclick_first);
			zk.listen(tb_prev[i], "click", zkPg.onclick_prev);
			zk.listen(tb_next[i], "click", zkPg.onclick_next);
			zk.listen(tb_last[i], "click", zkPg.onclick_last);
						
			if (cmp.npg == 1) {
				zk.addClass(tb_first[i], "z-item-disd");
				zk.addClass(tb_prev[i], "z-item-disd");
				zk.addClass(tb_next[i], "z-item-disd");
				zk.addClass(tb_last[i], "z-item-disd");
			} else {
				if (cmp.actpg == 0) {
					zk.addClass(tb_first[i], "z-item-disd");
					zk.addClass(tb_prev[i], "z-item-disd");
				}
				else if (cmp.actpg == cmp.npg - 1) {
					zk.addClass(tb_next[i], "z-item-disd");
					zk.addClass(tb_last[i], "z-item-disd");
				}
			}
		}		
		
		for (var btns = ["!tb_f", "!tb_p", "!tb_n", "!tb_l"], i = btns.length; --i >= 0;){
			var btn = $es(cmp.id + btns[i]);
			for (var j = btn.length; --j>=0;) {
				zk.listen(btn[j], "mouseover", zkPg.onover);
				zk.listen(btn[j], "mouseout", zkPg.onout);
				zk.listen(btn[j], "mousedown", zkPg.ondown);
				zk.listen(btn[j], "focus", zkPg.onfocus);
				zk.listen(btn[j], "blur", zkPg.onblur);
			}
		}
	},
	
	go: function (anc, pgno) {
		var cmp = $parentByType(anc, "Pg");
		if (cmp)
			zkau.send({uuid: cmp.id, cmd: "onPaging", data: [pgno]});
	},
	
	onkeypress: function (evt) {
		zkInpEl.ignoreKeys(evt, "0123456789");
	},
	
	inpblur: function (evt) {
		if (!evt) evt = window.event;
		var inp = Event.element(evt),
			cmp = $outer(inp);
		if (inp.disabled || inp.readOnly)
			return;
		
		zkPg.checkValue(inp);
		zkPg.go(cmp, inp.value-1);
		Event.stop(evt);
	},
	
	inpkeydown: function(evt){
		if (!evt) evt = window.event;
		var inp = Event.element(evt),
			cmp = $outer(inp);
		if (inp.disabled || inp.readOnly)
			return;
	
		var code =Event.keyCode(evt);
		switch(code){
		case 48:case 96://0
		case 49:case 97://1
		case 50:case 98://2
		case 51:case 99://3	
		case 52:case 100://4
		case 53:case 101://5
		case 54:case 102://6
		case 55:case 103://7
		case 56:case 104://8
		case 57:case 105://9
			break;		
		case 37://left
			break;		
		case 38: case 33: //up, PageUp
			zkPg.increase(inp,true);
			Event.stop(evt);
			break;
		case 39://right
			break;		
		case 40: case 34: //down, PageDown
			zkPg.increase(inp,false);
			Event.stop(evt);
			break;
		case 36://home
			zkPg.go(cmp,0);
			Event.stop(evt);
			break;
		case 35://end
			zkPg.go(cmp, cmp.npg - 1);
			Event.stop(evt);
			break;
		case 9: case 8: case 46: //tab, backspace, delete 
			break;
		case 13: //enter
			zkPg.checkValue(inp);
			zkPg.go(cmp, inp.value-1);
			Event.stop(evt);
			break;
		default:
			if (!(code >= 112 && code <= 123) //F1-F12
			&& !evt.ctrlKey && !evt.altKey)
				Event.stop(evt);
		}
	},
	
	checkValue: function(inp){
		var	cmp = $outer(inp);
		var value = $int(inp.value);
		
		if (value < 1)
			value = 1;
		else if (value > cmp.npg)
			value = cmp.npg;
			
		inp.value = value;
	},
	
	increase: function (inp,is_add){
		var	cmp = $outer(inp);
		var value = $int(inp.value);
		if(is_add){
			value = value + 1;
		}else{
			value = value - 1;
		}
		if (value < 1) value = 1;
		else if (value > cmp.npg) value = cmp.npg;
		
		inp.value = value;
	},
	
	onclick_first: function(evt){
		if (!evt) evt = window.event;
		var cmp = $outer(Event.element(evt));
		
		if (cmp.actpg != 0)
			zkPg.go(cmp,0);
	},
	
	onclick_last: function(evt){
		if (!evt) evt = window.event;
		var cmp = $outer(Event.element(evt));
		
		if (cmp.actpg != cmp.npg - 1)
			zkPg.go(cmp, cmp.npg-1);
	},
	
	onclick_prev: function(evt){
		if (!evt) evt = window.event;
		var cmp = $outer(Event.element(evt));
		
		if (cmp.actpg > 0)
			zkPg.go(cmp, cmp.actpg - 1);
	},
	
	onclick_next: function(evt){
		if (!evt) evt = window.event;
		var cmp = $outer(Event.element(evt));
		
		if (cmp.actpg < cmp.npg - 1)
			zkPg.go(cmp, cmp.actpg + 1);
	},
	
	onover: function (evt) {
		if (!evt) evt = window.event;
		var table = $parentByTag(Event.element(evt), "TABLE");
		
		if (table.className.indexOf("z-item-disd") == -1) 
			zk.addClass(table, "z-btn-over");
	},
	
	onout: function (evt) {
		if (!evt) evt = window.event;
		var table = $parentByTag(Event.element(evt), "TABLE");
		zk.rmClass(table, "z-btn-over");
	},
	
	ondown: function (evt) {
		if (!evt) evt = window.event;
		var table = $parentByTag(Event.element(evt), "TABLE");

		if (table.className.indexOf("z-item-disd") != -1)  return;
		
		zk.addClass(table, "z-btn-click");
		zkPg.down_btn = table;
		zk.listen(document.body, "mouseup", zkPg.onup);
	},
	
	onup: function (evt) {
		if (!evt) evt = window.event;
		zk.rmClass(zkPg.down_btn, "z-btn-click");
		zkPg.down_btn = null;
		zk.unlisten(document.body, "mouseup", zkPg.onup);
	},
	
	onfocus: function (evt) {
		if (!evt) evt = window.event;
		var table = $parentByTag(Event.element(evt), "TABLE");
		zk.addClass(table, "z-btn-focus");
	},
	
	onblur: function (evt) {
		if (!evt) evt = window.event;
		var table = $parentByTag(Event.element(evt), "TABLE");
		zk.rmClass(table, "z-btn-focus");
	}
};