
//==============================================================================
//ExtComPlugin
//==============================================================================

//==============================================================================
//nexacro.Event.ExtComPluginEventInfo
//ExtComPlugin에 요청된 작업이 성공했을 때 발생되는 이벤트에서 사용되는 EventInfo Object
//==============================================================================

if(!nexacro.Event.ExtComPluginEventInfo)
{
    nexacro.Event.ExtComPluginEventInfo = function (strEventId, strSvcId, intReason, strReturnValue)
    {
        this.eventid = strEventId;                                              // 이벤트ID
        this.svcid = strSvcId;                                                  // 이벤트 서비스 ID
        this.reason = intReason;                                                // 이벤트 발생분류 코드
        this.returnvalue = strReturnValue;                                      // 이벤트 수행결과 (type:Variant)
    }
    _pExtComPluginEventInfo = nexacro.Event.ExtComPluginEventInfo.prototype = nexacro._createPrototype(nexacro.Event);
    _pExtComPluginEventInfo._type = "nexacroExtComPluginEventInfo";
    _pExtComPluginEventInfo._type_name = "ExtComPluginEventInfo";
    _pExtComPluginEventInfo = null;
}

//==============================================================================
//nexacro.Event.ExtComPluginErrorEventInfo
//ExtComPlugin에 요청된 작업이 실패했을 때 발생되는 이벤트에서 사용되는 EventInfo Object
//==============================================================================
if(!nexacro.Event.ExtComPluginErrorEventInfo)
{
    nexacro.Event.ExtComPluginErrorEventInfo = function (strEventId, strSvcId, intReason, intErrorCode, strErrorMsg)
    {
        this.eventid = strEventId;                                              // 이벤트ID
        this.svcid = strSvcId;                                                  // 이벤트 서비스 ID
        this.reason = intReason;
        this.errorcode = intErrorCode;
        this.errormsg = strErrorMsg;

    }
    _pExtComPluginErrorEventInfo = nexacro.Event.ExtComPluginErrorEventInfo.prototype = nexacro._createPrototype(nexacro.Event);
    _pExtComPluginErrorEventInfo._type = "nexacroExtComPluginErrorEventInfo";
    _pExtComPluginErrorEventInfo._type_name = "ExtComPluginErrorEventInfo";
    _pExtComPluginErrorEventInfo = null;
}

//==============================================================================
//nexacro.ExtComPlugin
//ExtComPlugin를 연동하기 위해 사용한다.
//==============================================================================
if (!nexacro.ExtComPlugin)
{
    nexacro.ExtComPlugin = function(name, obj)
    {
        this._id = nexacro.Device.makeID();
        nexacro.Device._userCreatedObj[this._id] = this;
        this.name = name || "";

        this.enableevent = true;

        this.timeout = 10;

        this._clsnm = ["ExtComPlugin"];
        this._reasoncode = {
            constructor : {ifcls: 0, fn: "constructor"},
            destroy     : {ifcls: 0, fn: "destroy"},

            callMethod  : {ifcls: 0, fn: "callMethod"},
        };

        this._event_list = {
            "on_callback": 1,
            "on_resume": 1,
            "on_permission_result": 1,
        };

        // native constructor
        var params = {} ;
        var fninfo = this._reasoncode.constructor;
        this._execFn(fninfo, params);
    };

    var _pExtComPlugin = nexacro.ExtComPlugin.prototype = nexacro._createPrototype(nexacro._EventSinkObject);

    _pExtComPlugin._type = "nexacroExtComPlugin";
    _pExtComPlugin._type_name = "ExtComPlugin";

    _pExtComPlugin.destroy = function()
    {
        var params = {};
        var jsonstr;

        delete nexacro.Device._userCreatedObj[this._id];

        var fninfo = this._reasoncode.destroy;
        this._execFn(fninfo, params);
        return true;
    };

    //===================User Method=========================//
    _pExtComPlugin.callMethod = function(methodid, param)
    {
        var fninfo = this._reasoncode.callMethod;
		
        var params = {};

        params.serviceid =  methodid;
        params.param     =  param;

        this._execFn(fninfo, params);
    };

    //===================Native Call=========================//
    _pExtComPlugin._execFn = function(_obj, _param)
    {
        if(nexacro.Device.curDevice == 0)
        {
            var jsonstr = this._getJSONStr(_obj, _param);
            this._log(jsonstr);
            nexacro.Device.exec(jsonstr);
        }
        else
        {
            var jsonstr = this._getJSONStr(_obj, _param);
            this._log(jsonstr);
            nexacro.Device.exec(jsonstr);
        }
    }

    _pExtComPlugin._getJSONStr = function(_obj, _param)
    {
        var _id = this._id;
        var _clsnm = this._clsnm[_obj.ifcls];
        var _fnnm = _obj.fn;
        var value = {};
        value.id = _id;
        value.div = _clsnm;
        value.method = _fnnm;
        value.params = _param;

        return  JSON.stringify(value);
    }

    _pExtComPlugin._log = function(arg)
    {
        if(trace) {
            trace(arg);
        }
    }


    //===================EVENT=========================//
    _pExtComPlugin._oncallback = function(objData) {
        var e = new nexacro.Event.ExtComPluginEventInfo("on_callback", objData.svcid, objData.reason, objData.returnvalue);
        this.$fire_oncallback(this, e);
    };
    _pExtComPlugin.$fire_oncallback = function (objExtComPlugin, eExtComPluginEventInfo) {
        if (this.on_callback && this.on_callback._has_handlers) {
            return this.on_callback._fireEvent(this, eExtComPluginEventInfo);
        }
        return true;
    };

    _pExtComPlugin._onresume = function(objData) {
        var e = new nexacro.Event.ExtComPluginEventInfo("on_resume", objData.svcid, objData.reason, objData.returnvalue);
        this.$fire_onresume(this, e);
    };
    _pExtComPlugin.$fire_onresume = function (objExtComPlugin, eExtComPluginEventInfo) {
        if (this.on_resume && this.on_resume._has_handlers) {
            return this.on_resume._fireEvent(this, eExtComPluginEventInfo);
        }
        return true;
    };

    _pExtComPlugin._onpermissionresult = function(objData) {
        var e = new nexacro.Event.ExtComPluginEventInfo("on_permission_result", objData.svcid, objData.reason, objData.returnvalue);
        this.$fire_onpermissionresult(this, e);
    };
    _pExtComPlugin.$fire_onpermissionresult = function (objExtComPlugin, eExtComPluginEventInfo) {
        if (this.on_permission_result && this.on_permission_result._has_handlers) {
            return this.on_permission_result._fireEvent(this, eExtComPluginEventInfo);
        }
        return true;
    };

    delete _pExtComPlugin;
}



