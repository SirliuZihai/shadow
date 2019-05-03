var fs = require('fs');
var path = require('path');

var fPath = 'D:\\dev\\work_2020\\dist\\static\\js'
var fPath2 = 'D:\\dev\\work_2020\\dist\\static\\css'
var fPaht3 = 'D:\\dev\\work_1.7jdk\\Secretary2\\www\\dynamic\\js\\'
var fPaht4 = 'D:\\dev\\work_1.7jdk\\Secretary2\\www\\dynamic\\css\\'
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
            if(filename.match(/app\..*\.js$/)){
              let readStream = fs.createReadStream(path.join(fPath,filename));
              let writeStream = fs.createWriteStream(fPaht3+'app.js');
              readStream.pipe(writeStream);
              console.log(filename+"移动完成")
            }
            if(filename.match(/vendor\..*\.js$/)){
              let readStream = fs.createReadStream(path.join(fPath,filename));
              let writeStream = fs.createWriteStream(fPaht3+'vendor.js');
              readStream.pipe(writeStream);
              console.log(filename+"移动完成")
            }
            if(filename.match(/manifest\..*\.js/)){
              let readStream = fs.createReadStream(path.join(fPath,filename));
              let writeStream2 = fs.createWriteStream(fPaht3+'manifest.js');
              readStream.pipe(writeStream2);
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
      if(filename.match(/app\..*\.css/)){
        let readStream = fs.createReadStream(path.join(fPath2,filename));
        let writeStream2 = fs.createWriteStream(fPaht4+'app2.css');
        readStream.pipe(writeStream2);
        console.log(filename+"移动完成")
      }
    })
  }
})


