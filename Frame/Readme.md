该框架是在CreatorFrame框架上的一个改革的封装，基本上继承CreatorFrame的一个改善版本，实现的思想可以运用在cocos-js项目中，
添加一些es6的一些标准
<br>
框架已经自动注册完所有的节点出发事件，脚本需要继承BaseComponent.js，然后在脚本中实现
'_tap_脚本名称'，即可完成点击事件的响应函数，所有节点都默认注册点击事件 
<br>
1.继承'BaseComponent.js':
<br>
//获取文本值
this.getLabelValue()
<br>
//设置文本值
this.setLabelValue(节点名称,值,需要替换%s的值(没有则不填)...)
<br>
//日志输出
<br>
this.Log(函数名称, 不定参数值)
<br>
//获取场景Canvas节点
<br>
this.getCanvas()
<br>
2.Common.js
<br>
IsDebug//是否开启调试模式
<br>
OpenLanguage//是否开启开启多语言
<br>
3.Global.js
<br>
全局的函数
<br>
4.日志打印<br>
Com.info(打印的信息)<br>
Com.warn(打印的信息)<br>
Com.error(打印的信息)<br>
<br>
5.添加通知弹窗
this.onMsg({content : '', title : '', select = true || false})
注意的：
<br>
    绑定的脚本名称需要和要绑定的节点（场景）名称一致
    比如：Scene_Login->Scene_Login.js
    <br>
    新项目，先创建resources文件夹，然后创建resources.json文件，管理动态加载的资源
    关于多语言和一些游戏的基础配置，在Common.js脚本中



<br>
更多框架说明：http://frame.tianyaso.com