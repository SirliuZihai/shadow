var fs = require('fs');
var sftp = require('sftp-node');

var options = {
  host: '47.112.131.22',
  port: '22',
  username: 'root',
  privateKey: 'D:\\id_rsa'
};

sftp.upload(options, '/home/yizhi/test.js','test/myjstest/test.js',function(err,res){
  if(err) console.log('err: '+err);
  else{
    console.log('res: '+res);
  }
});
