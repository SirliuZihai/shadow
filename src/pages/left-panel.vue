<template>
  <f7-page>
    <f7-list>
      <div style="text-align:center">
        <img id="headImg" src="" class="headImg"/>
        <input id="left_panelHeadImg" type="file" accept="image/*" @change="uploadFileForm" hidden />
      </div>
      <f7-button @click="uploadFile">点击上传头像</f7-button>
    </f7-list>
    <f7-list>
      <f7-list-item link="/userInfo/" title="我" panel-close></f7-list-item>
      <f7-list-item link="/contact/" title="联系人" panel-close></f7-list-item>
      <f7-list-item link="/tips/" title="动态" :badge="args.tips_num" badge-color="blue" @click="args.tips_num=0"
                    panel-close></f7-list-item>
      <f7-list-item link="/notify/" title="请求&通知" :badge="args.notify_num" badge-color="blue" @click="args.notify_num=0"
                    panel-close></f7-list-item>
      <!--<f7-list-item link="/letterBox/" title="信箱" panel-close></f7-list-item>-->
      <f7-list-item link="/setting/" title="设置" panel-close></f7-list-item>
      <f7-list-item link="/about/" title="关于" panel-close></f7-list-item>
      <f7-list-item v-if="uname === 'yanzi'||uname === 'xiaotong'" link="/test2/" title="测试" panel-close></f7-list-item>
    </f7-list>
  </f7-page>
</template>
<script>
  import photo from '@/assets/js/phonto.js'
  import defautImg from '@/assets/image/nohead.jpg'

  var LeftPanelCur
  export default {
    created () {
      // 统计通知数
      const self = this
      let url = process.env.API_HOST + 'notify/countNofify.do'
      self.$f7.request.promise.get(url, null, 'json').then(
        (data) => {
          if (data.success && data.data.length > 0) {
            // 总数
            self.args.notify_num = data.data.map((a) => {
              return a.count
            }).reduce((x, y) => {
              return x + y
            })
          }
        },
        () => {
          self.$root.toastbuttom(self, '通讯异常')
        }
      )
    },
    mounted () {
      const self = this
      LeftPanelCur = self
      self.$$('#headImg').on('error', self.nohaedImg)
      self.changeImgUrl()
    },
    data: function () {
      return {
        uname: localStorage.getItem('username'),
        args: {
          notify_num: 0,
          tips_num: 0
        }
      }
    },
    methods: {
      getCur () {
        return LeftPanelCur
      },
      uploadFile () {
        const self = this
        self.$root.curSelf = self
        if (self.$device.android === true || self.$device.ios === true) {
          photo.getPhoto()
        } else {
          LeftPanelCur.$$('#left_panelHeadImg').click()
        }
      },
      uploadFileForm (event) {
        const self = this
        var SERVER = process.env.API_HOST + 'user/uploadHeadImg.do'
        var imgFile = event.target.files[0] // 获取图片文件
        var formData = new FormData() // 创建form对象
        formData.append('headImageFile', imgFile)// 通过append向form对象添加数据
        self.$f7.request.promise({
          method: 'POST',
          url: SERVER,
          data: formData
        }).then(function (data) {
          let data2 = self.$root.myevil(data)
          if (data2.success === true) {
            self.$f7.dialog.alert(data2.message)
            self.changeImgUrl()
          } else {
            self.$root.toastbuttom(self, data2.message)
          }
        })
      },
      changeImgUrl () {
        let url = process.env.API_HOST + 'image/head/' + localStorage.getItem('username') + '.jpg?temp=' + Math.floor((Math.random() * 10000) + 1)
        LeftPanelCur.$$('#headImg').attr('src', url)
      },
      nohaedImg () {
        this.$$('#headImg').attr('src', defautImg)
      }

    }
  }
</script>
<style scoped>
  .headImg {
    width: 50px;
    height: 50px;
    border-radius: 50%
  }
</style>
