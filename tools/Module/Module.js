var layer = "var BaseLayer = require(\"BaseLayer\")\r" +
"\rcc.Class({\r" +
"       extends : BaseLayer,\r\r" +
"       properties : {\r" +
"       },\r\r" +
"       onLoad () {\r"+
"            this._super()  \r" +
"       },\r\r"+
"       OnInit () {\r\r"+
"       },\r\r"+
"       _initValue () {\r"+ 
"           this._registerEvent()\r" +
"       },\r\r"+
"       _initUi () {\r\r"+
"       },\r\r"+
"       _registerEvent () {\r\r"+
"           this.registerEvent('%s')\r" +
"       },\r\r"+
"" +
"})";

var scene = "var BaseScene = require(\"BaseScene\")\r" +
"\rcc.Class({\r" +
"       extends : BaseScene,\r\r" +
"       properties : {\r" +
"       },\r\r" +
"       onLoad () {\r"+
"            this._super()  \r" +
"       },\r\r"+
"       OnInit () {\r\r"+
"           //这里可以更改父类属性初始化的值\r" +
"       },\r\r"+
"       OnInitValue () {\r"+ 
"           this.registerEvent(\"%s\")\r"+ 
"       },\r\r"+
"       OnInitUi () {\r\r"+
"       },\r\r"+
"" +
"})"; 

var unit = "var BaseUnit = require(\"BaseUnit\")\r" +
"cc.Class({\r" +
"    extends : BaseUnit,\r\r" +
"    statics : {\r" +
"    },\r\r" +
"    properties : {\r" +      
"    },\r\r" +
"    onLoad () {\r" +
"       this._super()\r" +
"    },\r\r" +
"    _initValue () {\r" +
"    },\r\r" +
"    _initUI () {\r" +
"       this._super()\r"+
"    },\r\r" +
"\r" +
"})\r";

var loading = '' +
'var BaseLoading = require(\'BaseLoading\')\n\n' +
'var Common = require(\'Common\')\n\n' +
'cc.Class({\n\n' +
'    extends : BaseLoading,\n\n' +
'    onLoad () {\n' +
'        this._super()\n' +
'    },\n\n' +
'    OnInit () {\n' +
'        //不重设这句话的话，默认跳转的场景是Scene_Login\n' +
'        //this._gameScene = Common.SceneName.SceneGame\n' +
'    },\n\n' +
'    progress (index, len, res) {\n' + 
'        let s = index / len \n' +
'        s *= 100\n' +
'        this.setProgressValue(\'progress\', s) \n' +
'    },\n\n' +
'})\n' 

var ctrl = '' +
'var BaseCtrl = require(\'BaseCtrl\')\n\n' +
'class %s extends BaseCtrl {\n\n'+
'   constructor () {\n'+
'       super(\'%s\')\n'+
'   }\n'+
'   static _fctor\n'+
'   static getInstance () {\n'+
'       if (! this._fctor) {\n'+
'           this._fctor = new %s()\n'+
'       } return this._fctor\n'+
'   }\n'+
'}\n\n'+
'module.exports = %s\n'+
'\n'
var tip = ""+
"cc.Class({\n"+
"   extends : require('BaseTip'),\n"+
"   properties : {\n"+
"   },\n"+
"   onLoad () {\n"+
"       this._super()\n"+
"   },\n"+
"   _initValue () {\n"+
"       //this._arrEmit.push(xxx)\n"+
"       this.registerEvent(this._script)\n"+
"   },\n"+
"   _initUi () {\n"+
"   },\n"+
"})\n"

var data = ""+
"var BaseData = require(\'BaseData\')\n\n"+
'class %s extends BaseData {\n'+
'   constructor () {\n'+
'       super()\n'+
'   }\n'+
'}\n'+
"\n"+
'module.exports = %s\n'+
""

var msg = ""+
'var Msg = require(\'../../../Frame/view/BaseMsg\')\n'+
'cc.Class({\n'+
'    extends : Msg,\n'+
'    properties : {\n'+
'    },\n'+
'    onLoad () {\n'+
'        this._super()\n'+
'    },\n'+
'    _initValue () {\n'+
'    },\n'+
'    _initUi () { \n'+
'    },\n'+
'})'+
""

module.exports = {
    scene : scene,
    layer : layer,
    unit : unit,
    loading : loading,
    ctrl : data + ctrl,
    data : data,
    msg : msg,
    tip : tip
}