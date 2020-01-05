/* eslint-disable */
import myapp from '@/app'
import theEventPage from '@/pages/homeSub/eventsPage.vue'
var myPosition
document.addEventListener('deviceready', onDeviceReady, false)

// Cordova加载完成会触发
function onDeviceReady () {
  document.addEventListener("backbutton", onBackKeyDown, false);
  document.addEventListener("resume", onResume, false);
  document.addEventListener("pause", onPause, false);
  //setInterval("getPosition()","1000");

  let chcp = window.chcp;
  // 检测更新
  chcp.fetchUpdate((error, data) => {
    if (error) {
      //alert('--更新版本异常，或其他错误--'+error.code+'  '+error.description);
      if (error.code === -2) {
        /*var dialogMessage = '有新的版本是否下载';
        //调用升级提示框 点击确认会跳转对应商店升级
        chcp.requestApplicationUpdate(dialogMessage, null, null);*/
        if(window.confirm('有新的版本是否下载')){
          cordova.InAppBrowser.open(process.env.API_HOST+'/store/app.html', '_blank', 'location=yes');
        }
      }
    }
    /*        setTimeout(()=>{
          // 服务器版本信息
        chcp.isUpdateAvailableForInstallation((error, data) => {
            if (error) {
             //alert('No update was loaded => nothing to install');
            } else {
              // 询问用户是否更新
              if ( window.confirm('检测到新版本，是否更新') ) {
                // 更新中
                chcp.installUpdate((error) => {
                  if (error) {
                    // 更新失败
                    alert('error code: ' + error.code +' DES:'+error.description);
                  } else {
                    // 更新成功
                    alert('更新成功!');
                  }
                });
              } else {
                console.log('您已拒绝更新');
              }
            }
          })},2000);*/
    // 版本信息
    /*chcp.getVersionInfo((err, data) => {
      console.log('服务器应用时间版本: ' + data.readyToInstallWebVersion);
      console.log('当前应用时间版本： ' + data.currentWebVersion);
      console.log('当前应用version name: ' + data.appVersion + ' curVersion:' + data.currentVersion);
    });*/
  });

}
function onResume () {
  theEventPage.methods.getCur().$root.isForword = true
  theEventPage.methods.getCur().initSocket()
}
function onPause () {
  theEventPage.methods.getCur().$root.isForword = false
}
function reconnectSocket(){}

function getPosition(){
navigator.geolocation.getCurrentPosition(
    function(position){
      myPosition = position.coords.longitude+","+position.coords.latitude//+","+position.coords.altitude;
    },
    function(error){myPosition = ''}, null
  );
}
  function onBackKeyDown() {
  if(myapp.$f7.views.main.history.length>2){
    //如果有history则执行返回
    myapp.$f7.views.main.router.back()
  }else{
    //HOME键
    navigator.Backbutton.goHome(function() {
      //清除所有以读
      let eventPage = theEventPage.methods.getCur()
      let settings = JSON.parse(localStorage.getItem(eventPage.$root.prefx + 'settings'))
      if (settings&&settings.allReadOnExit === true) {
        eventPage.events.forEach((e)=>{
          e.num = null
        })
      }
      console.log('go home success');
    }, function() {
      console.log('go home fail');
    });
  }

}
function cordovaDevice() {
  navigator.notification.alert("Cordova version: " + device.cordova + "\n" +
    "Device model: " + device.model + "\n" +
    "Device platform: " + device.platform + "\n" +
    "Device UUID: " + device.uuid + "\n" +
    "Device version: " + device.version);
}
// 获取照片
function getPhoto (calledObj) {
  // quality : 图像的质量，范围是[0,100]
  navigator.camera.getPicture(onPhotoURISuccess,
   null,
    { quality: 50, destinationType: navigator.camera.DestinationType.FILE_URI, sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY })
}

// 获取照片成功
function onPhotoURISuccess (imageURI) {
  plugins.crop(function success(url) {
    url = url.split('?');
    //缩放裁切后的图片，然后再上传
    window.autobots.imageResize.resize(
      {
        source: url[0],
        quality: 90, // Default 70
        type: 'maxPixelResize' | 'minPixelResize', //Default maxPixelResize
        width: 100,
        height: 100
      },
      function(response) {
        //console.log(response.filePath);
        //console.log(response.width);
        //console.log(response.height);
        upload('file://'+ response.filePath);
      },
      function(error) {
        //alert(error);
      }
    );
  }, function fail(err) {
    console.log(err);
  }, imageURI, {quality: 80});
}

// 上传文件
function upload (fileURL) {
  //alert(fileURL)
  // 上传成功
  var success = function (r) {
    let data = myapp.myevil(r.response)
    myapp.curSelf.changeImgUrl ()
    if(theEventPage.methods.getCur()){
      theEventPage.methods.getCur().reload()
    }
  }

  // 上传失败
  var fail = function (error) {
    myapp.$f7.dialog.alert("上传失败! ")
  }

  var options = new FileUploadOptions()
  options.fileKey = 'headImageFile'
  options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1)

  var ft = new FileTransfer()
  // 上传地址
  var SERVER = process.env.API_HOST + 'user/uploadHeadImg.do'
  ft.upload(fileURL, encodeURI(SERVER), success, fail, options)
};

function notify (event,success,ignore) {
  cordova.plugins.notification.local.on('yes', success)
  cordova.plugins.notification.local.on('no', ignore)
  cordova.plugins.notification.local.schedule({
    id: 0,
    title: event.title,
    text: event.latestMsg,
    foreground: true,
/*    actions: [
      { id: 'yes', title: '确认查看' },
      { id: 'no', title: '忽略' }
    ],*/
  })
}
var ignore=function(notification, eopts){
 // alert("消息详情：消息标题["+notification["title"]+"], 消息内容["+notification["text"]+"]")
}

function sendPicture (ws) {
  navigator.camera.getPicture((dataUrl) => {
      if (dataUrl){
        // 上传成功
        let success = function (r) {
          let data = myapp.myevil(r.response)
          //alert(JSON.stringify(data.response))
          ws.send('[image]:' + process.env.API_HOST +data.message)

        }
        // 上传失败
        let fail = function (error) {
          myapp.$f7.dialog.alert("发送失败! ")
        }
        let options = new FileUploadOptions()
        options.fileKey = 'tempFile'
        options.fileName = 'temqq.png'

        let ft = new FileTransfer()
        // 上传地址
        let SERVER = process.env.API_HOST + 'event/uploadtempfile.do'
        ft.upload(dataUrl, encodeURI(SERVER), success, fail, options)
      }
    }, (e)=>{},
    { quality: 75, destinationType: navigator.camera.DestinationType.FILE_URI, sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: false,encodingType:0,targetWidth:1040,targetHeight:780,mediaType:0
    })
}

/**
 * 用于动态圈上传照片
 * */
function upPicture (clazzName,imgArry) {
  navigator.camera.getPicture((dataUrl) => {
      if (dataUrl){
        // 上传成功
        let success = function (r) {
          let data = myapp.myevil(r.response)
          imgArry.push(data.message)
        }
        // 上传失败
        let fail = function (error) {
          myapp.$f7.dialog.alert("上传失败! ")
        }
        let options = new FileUploadOptions()
        options.fileKey = 'tempFile'
        options.fileName = 'temqq.png'

        let ft = new FileTransfer()
        // 上传地址
        let SERVER = process.env.API_HOST + 'event/uploadtempfile.do?classify='+clazzName
        ft.upload(dataUrl, encodeURI(SERVER), success, fail, options)
      }
    }, (e)=>{},
    { quality: 75, destinationType: navigator.camera.DestinationType.FILE_URI, sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: false,encodingType:0,targetWidth:1040,targetHeight:780,mediaType:0
    })
}
export default {
  getPhoto,
  notify,
  sendPicture,
  getPosition,
  upPicture
}
