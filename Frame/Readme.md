框架已经自动注册完所有的节点出发事件，脚本需要继承BaseComponent.js，然后在脚本中实现
'_tap_脚本名称'，即可完成点击事件的响应函数，所有节点都默认注册点击事件


1.继承'BaseComponent.js':
//获取节点文本组件
this._getLabel(文本脚本的节点名称)
//获取节点按钮对象
this._getButton(按钮脚本的节点名称)
//日志输出
this.Log(函数名称, 不定参数值)
//获取场景Canvas节点
this.getCanvas()


注意的：
    绑定的脚本名称需要和要绑定的节点（场景）名称一致
    比如：Scene_Login->Scene_Login.js

