var nodeCmd = require('node-cmd');
nodeCmd.get(
  'cd/d D:\\dev\\work_1.7jdk\\Secretary &&cordova-hcp build',
  function(err, data, stderr){
    console.log(data);
  }
);
