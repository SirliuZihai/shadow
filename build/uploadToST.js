var fs = require('fs');
var pathLib = require('path');
var sftp = require('sftp-node');
let path2 = 'D:\\dev\\work_1.7jdk\\Secretary2\\www\\dynamic'
let path21 =   path2.replace(/\\/g,'/')
let path3 = '/home/yizhi/program/Myapp-2/www/dynamic/'

var nodeCmd = require('node-cmd');
nodeCmd.get(
  'cd/d D:\\dev\\work_1.7jdk\\Secretary2 &&cordova-hcp build',
  function(err, data, stderr){
    console.log(data);
    doUpload('D:\\dev\\work_1.7jdk\\Secretary2\\www\\chcp.json','/home/yizhi/program/Myapp-2/www/chcp.json')
    doUpload('D:\\dev\\work_1.7jdk\\Secretary2\\www\\chcp.manifest','/home/yizhi/program/Myapp-2/www/chcp.manifest')
    dealDirFils(path2,deal)
  }
);

function deal (filepath) {
  let filepath2 =  filepath.replace(/\\/g,'/')
  let relaypath = filepath2.substring(filepath2.indexOf(path21)+1+path21.length)
  if(relaypath.startsWith('fonts')){
    return false
  }
  doUpload(filepath,path3 +relaypath)
}
function dealDirFils(path,dealBus){
  fs.readdir(path,(err,files)=>{
    if(err){
      console.log(err)
    }else{
      files.forEach((filename)=>{
        fs.stat(pathLib.join(path,filename),(err,stats)=>{
          if(err){
            console.log(err)
          }else{
            if(stats.isFile()){
              dealBus(pathLib.join(path,filename))
            }else if(stats.isDirectory()){
              dealDirFils(pathLib.join(path,filename),dealBus)
            }
          }
        })
      })
    }
  })
}

var options = {
  host: '47.112.131.22',
  port: '8089',
  username: 'zihai',
  privateKey: 'D:\\key\\id_rsa(zihai)'
};
function doUpload(from,to){
  sftp.upload(options, to,from,function(err,res){
    if(err) console.log('err: '+err);
    else{
      console.log('from=='+from+'to==='+to+'提交成功'+res);
    }
  });

}
