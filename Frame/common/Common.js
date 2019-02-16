var Common = {
    /**
     * 是否调试模式
     */
    IsDebug : true,
    //是否显示fps
    IsShowFPS : false,
    //是否显示碰撞区域
    IsShowCollision : false,
    //是否开启多语言
    OpenLanguage : true,
    //是否热更新
    IsHotUpdate : false,
    //语言
    Language : {
        Chinese : 'Chinese',
        English : 'English',
        ChineseChara : 'ChineseChara',
    },
    //默认语言Chinese/English
    DefaultLanguage : 'Chinese',
    //本地数据key
    LocalKey : {
        // Audio : 'Audio'
    },
    //场景名称--也可以用配置文件来代替
    SceneName : {
        SceneLoading : 'Scene_Loading',
        SceneLogin : 'Scene_Login',
        SceneGame : 'Scene_Game',
        SceneMain : 'Scene_Main',
        SceneMenu : 'Scene_Menu',

        LayerMap : 'Layer_Map',
        LayerMenu : 'Layer_Menu',
        TipMenu : 'Tip_Menu',
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
        UnitNeedle : "Unit_Needle",
        UnitCircle : "Unit_CircleNeedle",
        UnitBullet : "Unit_Bullet",
        UnitMonster : "Unit_Monster",

        Msg_Window : "Msg_Window",
    },
    //路由
    Routes : {
        PomeloInit : 'gate.gateHandler.entry',
        Login : 'connector.entryHandler.login',
        Register : 'connector.entryHandler.register',
        SynchroUser: 'connector.entryHandler.synchroInfo',
        CreateRoom : 'connector.entryHandler.createRoom',
        JoinRoom : 'connector.entryHandler.JoinRoom',
        LeaveRoom : "connector.entryHandler.leaveRoom",
        DealCard : 'fight.fightHandler.deal',
        RequestMain : 'fight.fightHandler.requestMain',
        Main : 'fight.fightHandler.robLandlord',
        OutCard : 'fight.fightHandler.outCard',
        PassCard : 'fight.fightHandler.pass',
        NotRob : 'fight.fightHandler.notRob',
        Again : 'fight.fightHandler.again',
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