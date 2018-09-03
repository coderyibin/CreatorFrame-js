var Sys = require('../../Frame/common/Sys')
var CusEvent = require('CusEvent')
var UIMgr = require('../../Frame/view/UIMgr')

var BaseUnit = cc.Class({
    extends : UIMgr,

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
        dragonBones : {
            tooltip : "龙骨动画组件",
            type : dragonBones.ArmatureDisplay,
            default : null,
        },


        _data : null,
        _index : null,
        _dragonBones : null,
        _armature : null,
        _nodes : null,
        _dragonAnimations : null,
        _event : null,
    },

    onLoad () {
        this._super()
        this.InitUI()
        this._initUnit()
    },

    _initUnit() {
        this._event = CusEvent.getInstance()
        
        //注册自己
        this._registerSelf()
    },

    start () {
        this._initValue()
        this._initUI()
    },

    _initValue () {
        this._dragonAnimations = {}
    },

    _initUI () {
        if (this.UsedragonBones == 1) {//龙骨动画
            this._dragonBones = this.dragonBones//this.node.getComponent(dragonBones.ArmatureDisplay)
            if (! this._dragonBones) {
                Com.error('龙骨动画节点不能是空的')
                return
            }
            this._armature = this._dragonBones.armature()
            dragonBones.WorldClock.clock.add(this._armature);
        }
        this._initProperty()
    },

    /**
     * 初始化节点的一些属性
     */
    _initProperty () {
        if (this._data) {
            if (this._data['pos']) this.node.position = this._data['pos'] 
            if (this._data['rotation']) this.node.rotation = this._data['rotation']
            if (this._data['size']) this.node.setContentSize(cc.size(this._data['size'].width, this._data['size'].height))
        }
    },

    /**
     * 获取对象的Index
     */
    GetIndex () {
        return this._index
    },

    /**
     * 发送订阅
     * @param name 订阅名称
     * @param data 参数
     */
    Emit (name, data) {
        this._event.emit(name, data)
    },

    /**
     * 播放指定龙骨动画
     * @param name 龙骨动画名称
     * @param call 龙骨动画播放结束回调 或者播放一帧结束回调
     * @param call 龙骨动画播放几次
     */
    PlayAnimation (name, call, count=-1) {
        if (! this._armature) {
            return
        }
        this._armature.animation.stop(name)
        this._armature.animation.play(name, count)
        if (call) {
            this.dragonBones.addEventListener(Sys.Dragon_Complete, call, this)
        }
    },

    //获取骨骼动画插槽
    GetSlots (name) {
        if (! this._armature) return
        let array = this._armature.getSlots()
        for (let i in array) {
            let slot = array[i]
            let _name = slot.name
            if (name == _name) {
                return slot
            }
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

    /**
     * 当碰撞产生的时候调用,需要开启碰撞Common.IsOpenCollision
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function (other, self) {
        // console.log('on collision enter');

        if (this['onCollisionStart']) {
            //碰撞组件自己 别人的碰撞组建 自己的节点 别人的节点
            this['onCollisionStart'](self, other, self.node, other.node)
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
        if (this['onCollisionIng']) {
            //碰撞组件自己 别人的碰撞组建 自己的节点 别人的节点
            this['onCollisionIng'](self, other, self.node, other.node)
        }
    },

    /**
     * 当碰撞结束后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionExit: function (other, self) {
        // console.log('on collision exit');
        if (this['onCollisionEnd']) {
            //碰撞组件自己 别人的碰撞组建 自己的节点 别人的节点
            this['onCollisionEnd'](self, other, self.node, other.node)
        }
    },

    /**
     * 注册本身节点点击事件
     */
    _registerSelf () {
        let name = '_tap_' + this._script
        if (this[name]) this.node.on(Sys.Touch_End, this[name], this)
    },

    Set (index, data) {
        this._data = data
        this._index = index 
    },

})