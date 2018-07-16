var Common = {
    /**
     * 是否调试模式
     */
    IsDebug : true,
    //是否显示fps
    IsShowFPS : false,
    //是否开启多语言
    OpenLanguage : true,
    //是否热更新
    IsHotUpdate : false,
    //默认语言Chinese/Englist
    DefaultLanguage : 'Chinese',
    //场景名称
    SceneName : {
        SceneLogin : 'Scene_Login',
        SceneGame : 'Scene_Game',
        SceneMenu : 'Scene_Menu',

        LayerMenu : 'Layer_Menu',
        LayerMsg : 'Layer_Msg',
        LayerNet : 'Layer_NetLoading',
        LayerHouse : 'Layer_House',
        LayerPetList : 'Layer_PetList',
    },
    //路由
    Routes : {
        PomeloInit : 'gate.gateHandler.entry',
        Login : 'connector.entryHandler.login',
        Register : 'connector.entryHandler.register',
        SynchroUser: 'connector.entryHandler.synchroInfo',
    },
    //http请求
    Http : {
        GetPetList : 'users/getUserPetList',//获取玩家所有的宠物list
    },
    //服务端推送key
    PushKey : {
        FirstPet : 'FirstPet',
        UserInfo : 'UserInfo',
    },
}

module.exports = Common