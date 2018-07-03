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

module.exports = {
    scene : scene,
    layer : layer,
    unit : unit,
}