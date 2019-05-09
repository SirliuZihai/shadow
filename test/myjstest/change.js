let gaze = require('gaze');
gaze(['你的文件路径/*.*','还可以使用数组的方式监听多个文件夹/app.js'], function(err, watcher) {
  let watched = this.watched();
  //监听文件的变化
  this.on('changed', (filepath) => {
    //romotePath是我文件的远程位置
    let romotePath = '/root' + filepath.substr(15);
    //put为上传文件的函数，下面会讲
    put(filepath,romotePath);
    console.log(filepath + ' was changed');
  });
});
