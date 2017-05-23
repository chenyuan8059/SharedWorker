# SharedWorker
利用 SharedWorker 进行多个页面之间的通讯

项目使用 webpack 构建

webpack worker-loader 需要稍作修改
![Aaron Swartz](https://raw.githubusercontent.com/chenyuan8059/SharedWorker/master/2017-05-24_021947.png)

使用时添加一个 `&wkname=SharedWorker` 参数指定 WebWorker 类型，默认为 Worker, 代码如下:
var SharedWorker = require('worker-loader?name=[name].min.js&wkname=SharedWorker!./sharedworker');
