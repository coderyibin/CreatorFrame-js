module.exports = {
    Version : cc.ENGINE_VERSION,//creator 版本号
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

    Touch_Toggle : "toggle",//复选框事件

    Game_Hide : "game_on_hide",//游戏退到后台事件
    Game_Show : "game_on_show",//游戏返回前台事件

    Dragon_Start : "start",//龙骨动画开始播放
    Dragon_LoopComp : "loopComplete",//龙骨动画循环一次完成
    Dragon_Complete : "complete",//龙骨动画播放结束
    Dragon_FadeIn : "fadeIn",//龙骨动画开始淡入
    Dragon_FadeInComp : "fadeInComplete",//龙骨动画淡入完成
    Dragon_FadeOut : "fadeOut",//龙骨动画淡出开始
    Dragon_FadeOutComp : "fadeOutComplete",//龙骨动画淡出完成
    Dragon_FrameEvent : "frameEvent",//龙骨动画帧事件
    Dragon_SoundEvent : "soundEvent",//龙骨动画声音事件

    Layout_None : cc.Layout.Type.NONE,//取消布局
    Layout_Horizonal : cc.Layout.Type.HORIZONTAL,//水平布局
    Layout_Vertical : cc.Layout.Type.VERTICAL,//垂直布局
    Layout_Grid : cc.Layout.Type.GRID,//网格布局
    
    //布局轴向-垂直-仅限于网格布局使用
    Layout_AxisDirection_HORIZONTAL : cc.Layout.AxisDirection.HORIZONTAL,
    //布局轴向-水平-仅限于网格布局使用
    Layout_AxisDirection_VERTICAL : cc.Layout.AxisDirection.VERTICAL,

    /**********************新版接口******************************* */
    //Layout
    Layout : {
        //布局模式
        Type : {
            //取消布局
            None : cc.Layout.Type.NONE,
            //水平布局
            Horizonal : cc.Layout.Type.HORIZONTAL,
            //垂直布局
            Vertical : cc.Layout.Type.VERTICAL,
            //网格布局
            Grid : cc.Layout.Type.GRID,
        },
        //起始轴方向
        AxisDirection : {
            //布局轴向-垂直-仅限于网格布局使用
            Horizonal : cc.Layout.AxisDirection.HORIZONTAL,
            //布局轴向-水平-仅限于网格布局使用
            Vertical : cc.Layout.AxisDirection.VERTICAL,
        },
        //缩放模式
        ResizeMode : {
            //取消布局
            None : cc.Layout.ResizeMode.NONE,
            //容器的大小会根据子节点的大小自动缩放。
            Container : cc.Layout.ResizeMode.CONTAINER,
            //子节点的大小会随着容器的大小自动缩放。
            Children : cc.Layout.ResizeMode.CHILDREN,
        }
    },

    /**
     * 平台判断
     */
    Platform : {
        OS : cc.sys.os,//平台判断
        IOS : cc.sys.OS_IOS,//ios
        ANDROID : cc.sys.OS_ANDROID,//android
        WINDOWS : cc.sys.OS_WINDOWS,//win
        ISNATIVE : cc.sys.isNative,//is native
    },

    /**
     * 是否是微信小游戏
     */
    IsWeChatGame : cc.sys.platform === cc.sys.WECHAT_GAME
}