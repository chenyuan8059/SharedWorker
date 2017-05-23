import Emmiter from 'eventemitter3'
import Guid from './guid'
var SharedWorker = require('worker-loader?name=[name].min.js&wkname=SharedWorker!./sharedworker');
// 导出对象
function ShareIo( name ){
    var _this = this

    Object.defineProperty(this, 'name', {
        value :name || location.href,
        writable: false,
        configurable: false,
        enumerable:false
    })

    Object.defineProperty(this, 'guid', {
        value :Guid(),
        writable: false,
        configurable: false,
        enumerable:false
    })

    // 定义一个 datas 属性用来存放临时数据用
    Object.defineProperty(this, 'datas', {
        value :{},
        writable: false,
        configurable: false,
        enumerable:false
    })

    // 定义一个 infos 属性用来存放当前对象的附加信息
    Object.defineProperty(this, 'infos', {
        value :{},
        writable: false,
        configurable: false,
        enumerable:false
    })
    // 创建事件发布对象
    var emmiter = new Emmiter()
    // 设置单个事件最多可监听的数量
    emmiter.setMaxListeners(100);
    // SharedWorker对象
    var sharedworker = null

    // 先获取旧的 onbeforeunload 事件监听函数，以免重写时覆盖原先的事件处理函数
    var old_before_unload = window.onbeforeunload || function(){}
    // 监听页面关闭前事件
    window.onbeforeunload = function(){
        // 关闭链接
        _this.close()
        old_before_unload.call(window)
    }
    /**
     * 打开与 SharedWorker 的链接
     */
    this.open = function(){
        if( !sharedworker ){
            sharedworker = SharedWorker()
            sharedworker.port.name = this.name
            // 监听消息
            sharedworker.port.addEventListener('message', e => {
                var message = e.data;
                if( message.from !== this.guid ){
                    emmiter.emit( message.type, message.message, { name:message.from, guid:message.guid }, this )

                    emmiter.emit( 'alls', message.message, { name:message.from, guid:message.guid }, this )
                }
            })
            // 监听线程异常信息
            sharedworker.addEventListener('error', e => {
                emmiter.emit( 'errors', e, this )
            })
            // 开启链接
            sharedworker.port.start()
            // 发送连接信息
            this.emit({ type:'connect' })
        }
    }
    /**
     * 关闭与 SharedWorker 的链接
     */
    this.close = function(){
        if( sharedworker ){
            this.emit( { type:'close' } )
            sharedworker.port.close()
            sharedworker = null
        }
        return this
    }
    /**
     * 设置对象附加信息
     */
    this.setInfos = function( name, value ){
        if( !name ) return
        if( name instanceof Object ){
            if( Array.isArray() ) return
            for( var prop in name ){
                this.infos[ prop ] = name[ prop ]
            }
        } else {
            this.infos[ name ] = value
        }
        this.emit({ type:'infos', message:this.infos })
        return this
    }
    /**
     * 出发消息发送
     */
    this.emit = function(message = {}, to = 'all'){
        // 发送消息前调用 open 来确保 SharedWorker 对象一连接
        this.open()
        var type = (message || {}).type || 'default'
        var ret = sharedworker.port.postMessage({
            guid:this.guid,
            from:this.name,
            to:to,
            type:type,
            message:message
        })
        return this
    }
    /**
     * 为指定事件注册一个监听器，接受一个字符串 event 和一个回调函数。
     */
    this.on = function(handler, type = 'default'){
        emmiter.on( type, handler )
        return this
    }
    /**
     * 返回指定事件的监听器数组。
     */
    this.ons = function(type = 'default'){
        return emmiter.listeners( type )
    }
    /**
     * 为指定事件注册一个单次监听器，即 监听器最多只会触发一次，触发后立刻解除该监听器
     */
    this.once = function(handler, type = 'default'){
        emmiter.once( type, handler )
        return this
    }
    /**
     * 删除某个事件监听函数
     */
    this.off = function( hander, type = 'default' ){
        emmiter.once( type, hander )
        return this
    }
    /**
     * 移除指定事件的所有监听器。
     */
    this.offs = function( type = 'default' ){
        emmiter.removeAllListeners( type )
        return this
    }
    // 开启链接
    this.open()
}

export default function( name ){
    return new ShareIo( name )
}

export {ShareIo};















/*****************************************<< 华丽的分割线 >>*****************************************/


















