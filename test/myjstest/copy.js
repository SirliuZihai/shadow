var fs = require('fs');
var path = require('path');
var sourceFile = path.join('E:\\work_2020\\dist\\', 'index.html');
var destPath = path.join('E:\\work_2020\\dist\\',  'index2.html');

var readStream = fs.createReadStream(sourceFile);
var writeStream = fs.createWriteStream(destPath);
readStream.pipe(writeStream);
console.log("移动完成")

/*fs.rename(sourceFile, destPath, function (err) {
  if (err) throw err;
  fs.stat(destPath, function (err, stats) {
    if (err) throw err;
    console.log('stats: ' + JSON.stringify(stats));
  });
});*/
