var fs = require('fs');
var path = require('path');

var fPath = 'D:\\dev\\work_2020\\dist\\static\\js'
var fPath2 = 'D:\\dev\\work_2020\\dist\\static\\css'
var projectPath = 'D:\\dev\\work_1.7jdk\\Myapp\\src\\main\\webapp'
fs.readdir(fPath,(err,files)=>{
  if(err){
    console.log(err)
  }else{
    files.forEach((filename)=>{
      fs.stat(path.join(fPath,filename),(err,stats)=>{
        if(err){
          console.log(err)
        }else{
          if(stats.isFile()){
            if(filename.match(/app\..*\.gz/)){
              let readStream = fs.createReadStream(path.join(fPath,filename));
              let writeStream = fs.createWriteStream(projectPath+'\\static\\js\\'+'app.js.gz');
              readStream.pipe(writeStream);
              console.log(filename+"移动完成")
            }
            if(filename.match(/vendor\..*\.gz/)){
              let readStream = fs.createReadStream(path.join(fPath,filename));
              let writeStream = fs.createWriteStream(projectPath+'\\static\\js\\'+'vendor.js.gz');
              readStream.pipe(writeStream);
              console.log(filename+"移动完成")
            }
            if(filename.match(/manifest\..*\.js/)){
              let readStream = fs.createReadStream(path.join(fPath,filename));
              let writeStream = fs.createWriteStream(projectPath+'\\static\\js\\'+'manifest.js');
              readStream.pipe(writeStream);
              console.log(filename+"移动完成")
            }
            if(filename.match(/nativeUtil\.js/)){
              let readStream = fs.createReadStream(path.join(fPath,filename));
              let writeStream = fs.createWriteStream(projectPath+'\\static\\js\\'+'nativeUtil.js');
              readStream.pipe(writeStream);
              console.log(filename+"移动完成")
            }
          }
        }
      })
    })
  }
})

fs.readdir(fPath2,(err,files)=> {
  if (err) {
    console.log(err)
  } else {
    files.forEach((filename)=>{
      if(filename.match(/app\..+\.css/)){
        let readStream = fs.createReadStream(path.join(fPath2,filename));
        let writeStream = fs.createWriteStream(projectPath+'\\static\\css\\'+'app2.css');
        readStream.pipe(writeStream);
        console.log(filename+"移动完成")
      }
/*      if(filename.match('framework7.bundle.css.gz')){
        let readStream = fs.createReadStream(path.join(fPath2,filename));
        let writeStream = fs.createWriteStream(projectPath+'\\static\\css\\'+'framework7.bundle.css.gz');
        readStream.pipe(writeStream);
        console.log(filename+"移动完成")
      }*/
    })
  }
})


