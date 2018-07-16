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
"           this.registerEvent()\r"+ 
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

module.exports = {
    scene : scene,
    layer : layer,
    unit : unit,
    loading : loading,
}