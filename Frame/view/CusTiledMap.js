var CusTiledMap = cc.Class({
    extends : cc.Class,

    properties : {
        _mapTiled : null,
    },   
    
    ctor () {

    },

    /**
     * 初始化地图组件
     * @param {component} comp 
     */
    InitTiledMap (comp) {
        this._mapTiled = comp
    },

    /**
     * tiled获取地图的图层
     * @param name 层级名称
     * @return 层级对象
     */
    GetMapLayer (name) {
        let layer = this._mapTiled.getLayer(name)
        if (layer) {
            return layer
        } Com.error('在地图中没有找到层级->', name)
    },
})

window['CusTiledMap'] = new CusTiledMap()