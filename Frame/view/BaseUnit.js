var Analysis = require('Analysis')

var BaseUnit = cc.Class({
    extends : cc.Component,

    statics : {
    },

    properties : {
        UsedragonBones : {
            tooltip : "是否使用龙骨动画",
            type : cc.Enum({
                'false' : 0,
                'true' : 1
            }),
            default : 0,
        },

        _data : null,
        _index : null,
        _dragonBones : null,
        _armature : null,
        _nodes : null,
    },

    onLoad () {
        let analysis = new Analysis()
        analysis.startAnalysis(this.node, this)
        this._nodes = analysis.GetAllNode()
    },

    start () {
        this._initValue()
        this._initUI()
    },

    _initValue () {

    },

    _initUI () {
        if (this.UsedragonBones == 1) {
            this._dragonBones = this.node.getComponent(dragonBones.ArmatureDisplay)
            this._armature = this._dragonBones.armature()
            dragonBones.WorldClock.clock.add(this._armature);
        }
    },

    //获取骨骼动画插槽
    GetSlots (name) {
        let array = this._armature.getSlots()
        for (let i in array) {
            let slot = array[i]
            let _name = slot.name
            if (name == _name) {
                return slot
            }
        }
    },

    //获取节点
    getNode (name) {
        return this._nodes[name]
    },
    //显示节点
    ShowNode (name) {
        let node = this._nodes[name]
        if (node) {
            node.active = true
        }
    },
    //隐藏节点
    HideNode (name) {
        let node = this._nodes[name]
        if (node) {
            node.active = false
        }
    },
    //隐藏骨骼部分
    HideDragon (slot) {
        slot.parent.visible = false
    },
    //显示骨骼部分
    ShowDragon (slot) {
        slot.parent.visible = true
    },

    Remove () {
        this.node.removeFromParent()
    },

    Hide () {
        this.node.active = false
    },

    /**
     * 当碰撞产生的时候调用,需要开启碰撞Common.IsOpenCollision
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function (other, self) {
        // console.log('on collision enter');

        if (this['onCollisionStart']) {
            this['onCollisionStart'](self, other)
        }

        // // 碰撞系统会计算出碰撞组件在世界坐标系下的相关的值，并放到 world 这个属性里面
        // var world = self.world;

        // // 碰撞组件的 aabb 碰撞框
        // var aabb = world.aabb;

        // // 上一次计算的碰撞组件的 aabb 碰撞框
        // var preAabb = world.preAabb;

        // // 碰撞框的世界矩阵
        // var t = world.transform;

        // // 以下属性为圆形碰撞组件特有属性
        // var r = world.radius;
        // var p = world.position;

        // // 以下属性为 矩形 和 多边形 碰撞组件特有属性
        // var ps = world.points;
    },

    /**
     * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionStay: function (other, self) {
        // console.log('on collision stay');
    },

    /**
     * 当碰撞结束后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionExit: function (other, self) {
        // console.log('on collision exit');
    },

    Set (index, data) {
        this._data = data
        this._index = index
    }
})