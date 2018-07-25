var Common = {
    /**
     * 是否调试模式
     */
    IsDebug : true,
    //是否显示fps
    IsShowFPS : false,
    //是否显示碰撞区域
    IsShowCollision : true,
    //是否开启多语言
    OpenLanguage : true,
    //是否热更新
    IsHotUpdate : false,
    //默认语言Chinese/Englist
    DefaultLanguage : 'Chinese',
    //本地数据key
    LocalKey : {
        Audio : 'Audio'
    },
    //场景名称
    SceneName : {
        SceneLogin : 'Scene_Login',
        SceneGame : 'Scene_Game',
        SceneMenu : 'Scene_Menu',

        LayerMenu : 'Layer_Menu',
        LayerPause : 'Layer_Pause',
        LayerMap : 'Layer_Map',
        LayerTiledMap : 'Layer_TiledMap',
        LayerGame : 'Layer_Game',
        LayerOver : 'Layer_Over',
        LayerMsg : 'Layer_Msg',
        LayerNet : 'Layer_NetLoading',
        LayerHouse : 'Layer_House',
        LayerPetList : 'Layer_PetList',
        LayerCtrl : 'Layer_Ctrl',
        LayerMap1 : 'Layer_Map(1)',
        LayerMap2 : 'Layer_Map(2)',
        LayerMap3 : 'Layer_Map(3)',
        LayerMap4 : 'Layer_Map(4)',
        LayerMap5 : 'Layer_Map(5)',
        LayerMap6 : 'Layer_Map(6)',
        LayerMap7 : 'Layer_Map(7)',
        LayerMap8 : 'Layer_Map(8)',
        LayerMap9 : 'Layer_Map(9)',
        LayerMap10 : 'Layer_Map(10)',

        UnitTile : "Unit_Tile",
        UnitHero1 : "Unit_Hero1",
        UnitHero2 : "Unit_Hero2",
        UnitHero3 : "Unit_Hero3",
        UnitHero4 : "Unit_Hero4",
        UnitHero5 : "Unit_Hero5",
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