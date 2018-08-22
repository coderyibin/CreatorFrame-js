var Global = require('Global')

class Pool {
    constructor () {
        this._pool = {
            use : {},
            unuse : {}
        }
    }

    /**
     * 创建对象内存池
     * @param {*} name 对象名称
     * @param {*} unit 对象
     * @param {*} count 创建的对象数量
     */
    CreatePool (name, unit, count=1) {
        if (! this._pool['unuse'][name]) {
            this._pool['unuse'][name] = []
        }
        if (! this._pool['use'][name]) {
            this._pool['use'][name] = []            
        }
        for (let i = 0; i < count; i ++) {
            this._pool['unuse'][name].push(unit)
        }
    }

    /**
     * 获取对象内存池对象
     * @param 对象名称
     */
    GetPoolUnit (name) {
        let units = this._pool['unuse'][name]
        if (units) {
            let count = units.length
            if (count > 0) {
                this._pool['use'][name].push(units[count - 1])
                let unit = units[count - 1]
                units = Global.DelArray(units, count - 1)
                return unit
            } else {
                let uses = this._pool['use'][name]
                if (uses.length > 0) {
                    let unit2 = cc.instantiate(uses[0])
                    unit2.removeFromParent(false)
                    this.CreatePool(name, unit2)
                    return this.GetPoolUnit(name)
                }
            }
        } else {
            return null
        }
    }
}

// class Pool {
//     constructor () {
//         this._pool = {}
//     }

//     CreatePool (name, node) {
//         if (! this._pool[name]) {
//             let pool = new cc.NodePool(name)
//             this._pool[name] = pool
//         }
//         this._pool[name].put(node)
//     }

//     GetPoolUnit (name) {
//         if (! this._pool[name]) return null
//         return this._pool[name].get()
//     }
// }

window['CusPool'] = new Pool()