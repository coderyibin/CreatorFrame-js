module.exports = {
    ScrollView_To_Top : 'scroll-to-top',//滚动视图滚动到顶部边界事件
    ScrollView_To_Bottom : 'scroll-to-bottom',//滚动视图滚动到底部边界事件
    ScrollView_To_Left : 'scroll-to-left',//滚动视图滚动到左边界事件
    ScrollView_To_Right : 'scroll-to-right',//滚动视图滚动到右边界事件
    ScrollViewing : 'scrolling',//滚动视图正在滚动时发出的事件
    ScrollView_Bounce_Bottom : 'bounce-bottom',//滚动视图滚动到顶部边界并且开始回弹时发出的事件
    ScrollView_Bounce_Left : 'bounce-left',//滚动视图滚动到底部边界并且开始回弹时发出的事件
    ScrollView_Bounce_Right : 'bounce-right',//滚动视图滚动到左边界并且开始回弹时发出的事件
    ScrollView_Bounce_Top : 'bounce-top',//滚动视图滚动到右边界并且开始回弹时发出的事件
    ScrollView_End : 'scroll-ended',//滚动视图滚动结束的时候发出的事件
    ScrollView_Touch_End : 'touch-up',//当用户松手的时候会发出一个事件
    ScrollView_Touch_End_With_Threshold : 'scroll-ended-with-threshold',//滚动视图自动滚动快要结束的时候发出的事件
    ScrollView_Begin : 'scroll-began',//滚动视图滚动开始时发出的事件
    
    Touch_Begin : cc.Node.EventType.TOUCH_START, //按下时事件
    Touch_Move : cc.Node.EventType.TOUCH_MOVE, //按住移动后事件
    Touch_End : cc.Node.EventType.TOUCH_END, //按下后松开后事件
    Touch_Cancel : cc.Node.EventType.TOUCH_CANCEL, //按下取消事件
    
    Edit_Begin : 'editing-did-began', //开始输入事件
    Edit_End : 'editing-did-ended', //结束输入事件
    Editing : 'text-changed', //正在输入事件
    Edit_Return : 'editing-return', //返回输入事件
    
}