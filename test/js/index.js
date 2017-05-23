$(function(){

    var ShareIo = new shareio.ShareIo();

    $('<h1>'+ ShareIo.name +' - '+ ShareIo.guid +'</h1>').appendTo('header')

    ShareIo.on((message, from) => {
        $('#recv-msg').prepend('<p>'+ JSON.stringify(message) +' ================ '+ JSON.stringify(from) +'</p>')
    }, 'alls')

    $('body').delegate('#btn-send', 'click', e => {
        ShareIo.emit({ message:'发送消息!'+ new Date() })
    }).delegate('#btn-update', 'click', e => {
        ShareIo.setInfos({ message:'更新数据!'+ new Date() })
    }).delegate('#btn-close', 'click', e => {
        ShareIo.close()
    }).delegate('#btn-clears', 'click', e => {
        $('#recv-msg').empty()
    });

})
