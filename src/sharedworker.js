/**
 * 共享线程必须放在网站更目录
 */ 
// 保存所以链接
var ports = self.ports = self.ports || {};

var processMessage = function( e ){
    var message = e.data
    var type = message.type
    if( type === 'connect' ){
        var port = ports[ message.guid ]
        port = ports[ message.guid ] = e.target || e.currentTarget
        port.name = message.from
        port.guid = message.guid
    } else if( type === 'close' ){
        for( var guid in ports ){
            if( guid === message.guid ){
                delete ports[ guid ]
                break
            }
        }
    }
    var isall = message.to === 'all'
    for( var guid in ports ){
        if( guid !== message.guid ){
            var port = ports[ guid ]
            if( isall ){
                port.postMessage(message)
            } else if( port.name === message.to ) {
                port.postMessage(message)
            }
        }
    }
}

// 监听链接
self.addEventListener('connect', function(e){
    // 获取当前连接
    var port = e.ports[0]
    // 监听消息
    port.addEventListener('message', processMessage)
    port.start()
})
