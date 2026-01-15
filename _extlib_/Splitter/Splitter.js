//==============================================================================
//
//  TOBESOFT Co., Ltd.
//  Copyright 2017 TOBESOFT Co., Ltd.
//  All Rights Reserved.
//
//  NOTICE: TOBESOFT permits you to use, modify, and distribute this file 
//          in accordance with the terms of the license agreement accompanying it.
//
//  Readme URL: http://www.nexacro.co.kr/legal/nexacro17-public-license-readme-1.0.html	
//
//==============================================================================
//==============================================================================
// Object : nexacro.Splitter
// Group : Component
//==============================================================================
if (!nexacro.Splitter)
{
    //==============================================================================
    // nexacro.Splitter
    //==============================================================================
    nexacro.Splitter = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Div.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pSplitter = nexacro._createPrototype(nexacro.Div, nexacro.Splitter);
    nexacro.Splitter.prototype = _pSplitter;
    _pSplitter._type_name = "Splitter";

	 // Property		     
	_pSplitter.items = [];
	_pSplitter.type  = "horizontal";
	_pSplitter.min   = -1;
	_pSplitter.max   = -1;
		
	// 필요한 이벤트 추가!!!
	_pSplitter._event_list = {
		"onmove": 1, "ondrag": 1,
		"onlbuttondown":1,"onlbuttonup":1,
		"onsplitterbeginmove": 1, "onsplitterendmove": 1,
		"cansplittermove": 1, "onsplittermoved": 1
	}
	
  /* accessibility */
  _pSplitter.accessibilityrole = "button";
   	

  //===============================================================
  // nexacro.Splitter : Create & Destroy & Update
  //===============================================================
	
	/*
	 Description : createComponent 실행시 nexacro.ControlElement 를 생성 후 호출됨
	 Todo :
	 control이 있다면 create() & createComponent() 호출
	 return : 없음
	*/
  _pSplitter.on_create_contents = function ()
	{		
		nexacro.Div.prototype.on_create_contents.call(this);

		this._setEventHandler("onmove", this.on_notify_splitter_onmove, this);

		//splitter resizing 추가
		this._setEventHandler("onlbuttondown", this.on_notify_splitter_onlbuttondown, this);
		this._setEventHandler("onlbuttonup", this.on_notify_splitter_onlbuttonup, this);

		var refForm = this._refform;
		if (refForm)
		{
			refForm._setEventHandler("ondragmove", this.on_notify_splitter_ondragmove, this);
		}
		this.items = [];		
	};
	
	/*
	 Description : on_created 실행시 호출됨
	               on_created() 는 component의 Element를 Node를 생성하여 실체화한다 
				   동적으로 component를 생성하면 호출됨
	 Todo :
	 control property 설정 및 control.on_created() 호출한다.
	 parameter : win (component 가 속한 nexacro._Window)
	 return : 없음
	 */
  _pSplitter.on_created_contents = function (win)
	{		 		
		this.form.on_created(win);
	};
	
	/*
	 Description : destroy 될때 호출되는 됨
	 Todo :
	 control 의 destroy() 함수를 호출해 
	 return : 없음
	 */
  _pSplitter.on_destroy_contents = function ()
	{		
		var refForm = this._refform;
		if (refForm)
		{
			refForm._removeEventHandler("ondragmove", this.on_notify_splitter_ondragmove, this);
		}
	};
	
  var dragObj = null;
  var nLeftStartValue, nRightStartValue, nTopStartValue, nBottomStartValue, nHeightStartValue, nWidthStartValue;
  
  // ==============================================================================
  // nexacro.Splitter : Properties
  // ==============================================================================
  // Property 로직 추가!!!
  _pSplitter.set_max = function (v)
  {
  	if (v != this.max)
  	{
  		this.max = v;
  		this.on_apply_max();
  	}
  };
  
  _pSplitter.on_apply_max = function ()
  {
  
  };
		
  _pSplitter.set_min = function (v)
  {
      if (v != this.min)
      {
          this.min = v;
          this.on_apply_min();
      }
  };
  
  _pSplitter.on_apply_min = function ()
  {
  
  };
  
  _pSplitter.set_type = function (v)
  {
      if (v != this.type)
      {
          this.type = v;
          this.on_apply_type();
      }
  };
  
  _pSplitter.on_apply_type = function ()
  {
  
  };
  
  //onsize와 reload시 틀어짐을 막기위해 move이벤트를 발생
  _pSplitter.resetMove = function() 
  {
      //move_flag = false;
      var evt = new nexacro.MoveEventInfo(this, "onmove", this.getOffsetLeft(), this.getOffsetTop());
      this.on_notify_splitter_onmove(this, evt);
  };
     
  // ==============================================================================
  // nexacro.Splitter : Methods
  // ==============================================================================
  // method 로직 추가!!!
  _pSplitter.addItem = function (arr)
  {	
  	for (var i=0; i<arr.length; i++)
  	{
  		var v = arr[i];
  		
  		if (typeof(v.componentid) == "string") {
  			var item = this._refform.components[v.componentid];
  		} else {
  			var item = this._refform = v.componentid;
  			v.componentid = v.componentid.name;
  		}
  		v.orgLeft   = item.left;
  		v.orgTop    = item.top;
  		v.orgRight  = item.right;
  		v.orgBottom = item.bottom;
  		v.orgWidth  = item.width;
  		v.orgHeight = item.height;

  		this.items.push(v);
  	}
  	this.resetMove();

  	this._vComp = {};
  	this._hComp = {};  
	    	
  	//cursor 적용
  	if(this.type == "vertical") {
  		this.set_cursor("s-resize");
  	}
  	else {
  		this.set_cursor("e-resize");		
  	}  
  };
	
  _pSplitter.addSplitter = function (topComp, lowerComp, leftComp, rightComp)
  {	  
    if (this.type == "vertical")
    {
      if (this.isNull(topComp) == false)   this._vComp["topComp"]   = topComp;
      if (this.isNull(lowerComp) == false) this._vComp["lowerComp"] = lowerComp;
    } 
    else if (this.type == "horizontal") {
      if (this.isNull(leftComp) == false)  this._hComp["leftComp"]  = leftComp;
      if (this.isNull(rightComp) == false) this._hComp["rightComp"] = rightComp;
    }
  };
	
	_pSplitter.isNull = function (value)
	{
		if(value == null || value == "") return true;		
		return false;
	}
    
  // ==============================================================================
  // nexacro.Splitter : Event Handlers
  // ==============================================================================
  // 나머지 추가한 이벤트 처리 추가!!!
  _pSplitter.on_fire_onsplitterbeginmove = function (obj, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp)
  {    
    if (this.onsplitterbeginmove && this.onsplitterbeginmove._has_handlers)
    {
        var evt = new nexacro.MouseEventInfo(obj, "onsplitterbeginmove", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp);
        this.onsplitterbeginmove._fireEvent(this, evt);
    }
  };
  
  _pSplitter.on_fire_onsplitterendmove = function (obj, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp)
  {    
    if (this.onsplitterendmove && this.onsplitterendmove._has_handlers)
    {
        var evt = new nexacro.MouseEventInfo(obj, "onsplitterendmove", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp);
        this.onsplitterendmove._fireEvent(this, evt);
    }
  };
  
  _pSplitter.on_fire_cansplittermove = function (obj, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp)
  {    
    if (this.cansplittermove && this.cansplittermove._has_handlers)
    {
        var evt = new nexacro.MouseEventInfo(obj, "cansplittermove", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp);
        this.cansplittermove._fireEvent(this, evt);
    }
  };
  
  
  _pSplitter.on_fire_onsplittermoved = function (obj, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp)
  {    
  if (this.onsplittermoved && this.onsplittermoved._has_handlers)
  {
  	var evt = new nexacro.MouseEventInfo(obj, "onsplittermoved", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp);
  	this.onsplittermoved._fireEvent(this, evt);
  }
  };
    
  // on_fire_user_ondrag 재정의!!!
  _pSplitter.on_fire_user_ondrag = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, refer_comp, self_refer_comp)
  {
  	// 추가한 이벤트별로 적당한 위치에 fire처리 추가
  	this.on_fire_onsplitterbeginmove(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, refer_comp);
  	this.on_fire_onsplitterendmove(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, refer_comp);
  	this.on_fire_cansplittermove(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, refer_comp);
  	this.on_fire_onsplittermoved(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, refer_comp);
  	
  	var dragData = this._getDragData();
  	var evt = new nexacro.DragEventInfo(this, "ondrag", dragData, null, this, self_refer_comp, from_comp, refer_comp,
  		                                button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY);
  	// true로 리턴!!!
  	return [true, this, self_refer_comp, dragData, evt.userdata];
  };
	
  _pSplitter.on_notify_splitter_onmove = function(obj, e) 
  {			
    var position, offset,item, nLeft = 0, nTop = 0, nWidth = 0, nHeight = 0;    			
    var orgLeft = 0, orgTop = 0, orgWidth = 0, orgHeight = 0, orgRight = 0, orgBottom = 0;
  				
  	for (var i = 0; i < this.items.length; i++)
  	{
  		position = this.items[i].position;
  		offset = this.items[i].offset;
  		item = this._refform.components[this.items[i].componentid];
  
  		orgLeft   = item.getOffsetLeft();
  		orgTop    = item.getOffsetTop();
  		orgWidth  = item.getOffsetWidth();
  		orgHeight = item.getOffsetHeight();
  		orgRight  = item.getOffsetRight();
  		orgBottom = item.getOffsetBottom();
  
  		if (this.type == "horizontal")
  		{
  			nTop = orgTop;
  			nHeight = orgHeight;
  				
  			if (position == "left")
  			{
  				nLeft = orgLeft;
  				nWidth = (e.x - offset) - nLeft;

  				item.move(nLeft, this.items[i].orgTop, nWidth, nHeight, this.items[i].orgRight, this.items[i].orgBottom);
  			}
  			else if (position == "right")
  			{
  				nLeft = e.x + this.getOffsetWidth() + offset;
  				nWidth = orgRight - nLeft;

  				item.move(nLeft, this.items[i].orgTop, nWidth, nHeight, this.items[i].orgRight, this.items[i].orgBottom);
  
  				if(this.items[i].orgWidth == null) item.width = null;
            
  				if(this.items[i].orgRight != null) item.right = this.items[i].orgRight;
  			}
  			else if (position == "moveRight")
  			{
  				nLeft = e.x + this.getOffsetWidth() + offset;
  				nWidth = orgWidth;
  
  				item.move(nLeft, this.items[i].orgTop, nWidth, nHeight, this.items[i].orgRight, this.items[i].orgBottom);
  				
  				if(this.items[i].orgWidth == null) item.width = null;
            
  				if(this.items[i].orgRight != null){
  					item.right = this.items[i].orgRight;            		
  				}
  			}
  			else if (position == "moveLeft")
  			{
  				nLeft = (e.x - offset) - orgWidth;
  				nWidth = orgWidth;
  				item.move(nLeft, nTop, nWidth, nHeight);
  			}
  			
  			if(this.items[i].orgHeight == null) item.height = null;              
  			if(this.items[i].orgBottom != null) item.bottom = this.items[i].orgBottom;
  		}
  		else if(this.type == "vertical")
  		{
  			nWidth = orgWidth;
  			nLeft = item.left;

  			if (position == "top")
  			{
  				nTop = orgTop;
  				nHeight = (e.y - offset) - nTop;

  			    item.move(nLeft, nTop, nWidth, nHeight);
  			}
  			else if (position == "bottom")
  			{
  				nTop = e.y + this.getOffsetHeight() + offset;
  				nHeight = orgBottom - nTop;				
  				 
  				item.move(nLeft, nTop, nWidth, nHeight);
  
  				if(this.items[i].orgHeight == null) item.height = null;
            
  				if(this.items[i].orgBottom != null){
  					item.bottom = this.items[i].orgBottom;
  				}
  			}
  			else if (position == "moveBottom") 
  			{
  				nTop = e.y + this.getOffsetHeight() + offset;
  				
  				item.move(nLeft, nTop, nWidth, orgHeight);
  			}
  			else if (position == "moveTop")
  			{
  				nTop = e.y - offset - orgHeight;
  				
  				item.move(nLeft, nTop, nWidth, orgHeight);
  			}
  		
  			if(this.items[i].orgWidth == null) item.width = null;
  
  			if(this.items[i].orgRight != null ) item.right = this.items[i].orgRight;
  		}
  	}	
  };
    
  _pSplitter.on_notify_splitter_onlbuttondown = function (obj, e)
  {   	
		//splitter 기본 정보
		nLeftStartValue   = this.left;
		nRightStartValue  = this.right;
		nTopStartValue    = this.top;
		nBottomStartValue = this.bottom;
		nHeightStartValue = this.height;
		nWidthStartValue  = this.width;
  };
    
	_pSplitter.on_notify_splitter_onlbuttonup = function (obj, e)
	{  
		//splitter 이동          
		if (nHeightStartValue == null) this.height = null;
		if (nWidthStartValue == null)  this.width = null;          
		if (nLeftStartValue == null)   this.left = null;
		if (nRightStartValue == null)  this.right = null;          
		if (nTopStartValue == null)    this.top = null;
		if (nHeightStartValue == null) this.height = null;          
          
		if(this.type == "horizontal") {
			this.top = nTopStartValue;
			this.bottom = nBottomStartValue;
                    	
			if (nRightStartValue != null) {
				if(nRightStartValue.toString().charAt(nRightStartValue.length - 1) == "%") {
					this.right = (parseInt((1 - (this.getOffsetRight() / this.parent.getOffsetWidth())) * 1000) / 10) + "%";
				} 
				else {
					this.right = this.parent.getOffsetWidth() - this.getOffsetRight();
				}
			}
			else if (nLeftStartValue.toString().charAt(nLeftStartValue.length - 1) == "%"){
				this.left = (parseInt((this.getOffsetLeft() / this.parent.getOffsetWidth()) * 1000) / 10) + "%";
			}
	 	} 
	 	else if(this.type == "vertical") {
			this.left = nLeftStartValue;
			this.right = nRightStartValue;
			
			if (nBottomStartValue != null) {
				if(nBottomStartValue.toString().charAt(nBottomStartValue.length - 1) == "%") {
					this.bottom = (parseInt((1 - (this.getOffsetBottom() / this.parent.getOffsetHeight())) * 1000) / 10) + "%";
				} 
				else {		            
					this.bottom = this.parent.getOffsetHeight() - this.getOffsetBottom();
				}
			} 
			else if(nTopStartValue.toString().charAt(nTopStartValue.length - 1) == "%"){
				this.top = (parseInt((this.getOffsetTop() / this.parent.getOffsetHeight()) * 1000) / 10) + "%";   						
			}
	 	}
  };
       
	_pSplitter.on_notify_splitter_ondragmove = function(obj, e) 
	{	  
		dragObj = e.sourceobject;
		if(dragObj != this) return;
		
		var nLeft = this.left;
		var nTop  = this.top;
	  		
		if(this.type == "horizontal")
		{
			nLeft = e.clientx - this.getOffsetWidth() / 2;
	
			if (this.min != -1 && nLeft < this.min) nLeft = parseInt(this.min);
			
			if (this.isNull(this._hComp["leftComp"]) == false)
			{
				if (parseInt(this._hComp["leftComp"].getOffsetRight()) + 10 >  nLeft ) nLeft = parseInt(this._hComp["leftComp"].getOffsetRight()) + 10;					
			}
			
			if (this.max != -1 && nLeft > this.max)	nLeft = parseInt(this.max);
	
			if (this.isNull(this._hComp["rightComp"]) == false)
			{
				if (parseInt(this._hComp["rightComp"].getOffsetLeft()) - 25 <  nLeft ) nLeft = parseInt(this._hComp["rightComp"].getOffsetLeft()) - 25;					
			}
			
			if (nLeft < 0) nLeft = 0;
			
			if (nLeft + parseInt(this.getOffsetWidth()) > parseInt(this._refform.getOffsetWidth())) {
			    nLeft = parseInt(this._refform.getOffsetWidth()) - parseInt(this.getOffsetWidth());
			}
		}
		else if(this.type == "vertical")
		{
			var nTop = e.clienty - this.getOffsetHeight() / 2;
			
			if (this.min != -1 && nTop < this.min) nTop = parseInt(this.min);
			
			if (this.isNull(this._vComp["topComp"]) == false)
			{
				if (parseInt(this._vComp["topComp"].getOffsetBottom()) + 10 >  nTop ) nTop = parseInt(this._vComp["topComp"].getOffsetBottom()) + 10;					
			}
			
			if (this.max != -1 && nTop > this.max) nTop = parseInt(this.max);
	
			if (this.isNull(this._vComp["lowerComp"]) == false)
			{
				if (parseInt(this._vComp["lowerComp"].getOffsetTop()) - 25 <  nTop ) nTop = parseInt(this._vComp["lowerComp"].getOffsetTop()) - 25;					
			}
			
			if (nTop < 0) nTop = 0;
			
			if (nTop + parseInt(this.getOffsetHeight()) > parseInt(this._refform.getOffsetHeight())) {
			    nTop = parseInt(this._refform.getOffsetHeight()) - parseInt(this.getOffsetHeight());
			}
		}

		this.move(nLeft, nTop, nWidthStartValue, nHeightStartValue, nRightStartValue, nBottomStartValue);
		this._refform.resetScroll();
		return true;
	};

  delete _pSplitter;
};