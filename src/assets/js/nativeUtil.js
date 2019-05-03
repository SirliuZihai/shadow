/* eslint-disable */
function errorCallback(error) {
  alert("ERROR: " + error.code)
}
function writeLogFile(data) {
  var type = window.PERSISTENT;
  var size = 5*1024*1024;
  window.requestFileSystem(type, size, successCallback, errorCallback)
  function successCallback(fs) {
    savefile(fs,data,'log.txt')
  }
}

//*******************************沙箱外存储*********************//
function savefile(dirEntry,fileData, fileName){
  dirEntry.getFile(
    fileName, {
      create: true,
      exclusive: false
    },
    function (fileEntry) {
      writeFile(fileEntry, fileData, true);

    }, onErrorCreateFile);
}



function onErrorCreateFile(e) {
  console.log('Failed create file: ' + e.toString());
};

function onErrorGetDir(error){
  console.log("文件夹创建失败！")
}
/**
 * cordova.file.externalRootDirectory ok
 * */
function writeLogFile2(data){
  var url2 =cordova.file.externalRootDirectory
  window.resolveLocalFileSystemURL(url2, function (dirEntry) {
    savefile(dirEntry,data+'\n\r','appZihailog2.txt')
  }, null);
}
function writeFile(fileEntry, dataObj, isAppend) {
  // Create a FileWriter object for our FileEntry (log.txt).
  fileEntry.createWriter(function (fileWriter) {
    fileWriter.onwriteend = function() {
      //alert(fileEntry.fullPath + 'has written')
     // readFile(fileEntry)
    };
    fileWriter.onerror = function (e) {
      alert("Failed file read: " + e.toString());
    };
    // If we are appending data to file, go to the end of the file.
    if (isAppend) {
      try {
        fileWriter.seek(fileWriter.length);
      }
      catch (e) {
        alert.log("file doesn't exist!");
      }
    }
    fileWriter.write(dataObj);
  });
}
function readFile(fileEntry) {
  fileEntry.file(function (file) {
    var reader = new FileReader();
    reader.onloadend = function() {
     alert(fileEntry.fullPath + "===" + this.result);
    };
    reader.readAsText(file);
  }, onErrorReadFile);
}
function removeLogFile2(){
  var url3 =cordova.file.externalRootDirectory
  window.resolveLocalFileSystemURL(url3+'appZihailog2.txt', function (fileEntry) {
    fileEntry.remove(function () {
      alert('delete success');
    }, function (err) {
     // alert(JSON.stringify(err));
    }, function () {
     // alert('file not exist');
    });
  })
}

export default {
  writeLogFile2,
  removeLogFile2
}
