<template>
  <f7-page>
    <f7-navbar title="地图" backLink="Back">
      <f7-nav-right>
        <f7-link @click="doConfirm()">确定</f7-link>
      </f7-nav-right>
      <f7-subnavbar :inner="false">
        <form class="searchbar">
          <div class="searchbar-inner">
            <div class="searchbar-input-wrap">
              <input id="mapSearch" type="search" placeholder="请输入关键字" :value="placeName" @change="doSearch"/>
              <i class="searchbar-icon"></i>
              <span class="input-clear-button"></span>
            </div>
          </div>
        </form>
      </f7-subnavbar>
    </f7-navbar>
    <div class="baidumap" id="allmap" style="width: 100%;height:100%;">
  </div>
  </f7-page>
</template>

<script>
import BMap from 'BMap'
import insertPan from '@/pages/insertPanOrHistory.vue'
import eventDetail from '@/pages/eventDetail.vue'
export default {
  name: 'bdmap',
  mounted () {
    const self = this
    var map = new BMap.Map('allmap')
    self.map = map
    let curMapPoint = sessionStorage.getItem('curMapPoint').split(',')
    let curMapPointName = sessionStorage.getItem('curMapPointName')
    if (curMapPointName) {
      self.curPoint = new BMap.Point(curMapPoint[0], curMapPoint[1])
      self.placeName = curMapPointName
      self.updateCurPoint(true)
    } else {
      self.orientate()
    }

    map.addControl(new BMap.NavigationControl({
      // LARGE类型
      type: BMap.BMAP_NAVIGATION_CONTROL_LARGE,
      // 启用显示定位
      enableGeolocation: true
    }))
    map.enableScrollWheelZoom(true)
    // 添加定位控件
    var geolocationControl = new BMap.GeolocationControl()
    map.addControl(geolocationControl)
    // 城市列表控件
    var size = new BMap.Size(10, 20)
    map.addControl(new BMap.CityListControl({
      anchor: BMap.BMAP_ANCHOR_TOP_LEFT,
      offset: size
    }))
    // 鼠标点击地图获取地址
    var geoc = new BMap.Geocoder()
    map.addEventListener('click', function (e) {
      var pt = e.point
      geoc.getLocation(pt, function (rs) {
        var addComp = rs.addressComponents
        self.placeName = addComp.province + ', ' + addComp.city + ', ' + addComp.district + ', ' + addComp.street + ', ' + addComp.streetNumber
        self.curPoint = e.point
        self.updateCurPoint(false)
      })
    })
    // autoComplete
    self.autoComplete()
  },
  data: function () {
    return {
      map: {},
      curPoint: {},
      placeName: '',
      city: '',
      province: '',
      searchResult: []
    }
  },
  methods: {
    // 坐标转换完之后的回调函数
    translateCallback (data) {
      if (data.status === 0) {
        self.curPoint = data.points[0]
        var myGeo = new BMap.Geocoder()
        // 根据坐标得到地址描述
        myGeo.getLocation(self.curPoint, function (result) {
          if (result) {
            self.city = result.address.city
          }
        })
        var marker = new BMap.Marker(data.points[0])
        self.map.addOverlay(marker)
        var label = new BMap.Label('您的位置', {offset: new BMap.Size(20, -10)})
        marker.setLabel(label)
        self.map.centerAndZoom(data.points[0], 15)
      }
    },
    orientate () {
      const self = this
      navigator.geolocation.getCurrentPosition(
        function (position) {
          let ggPoint = new BMap.Point(position.coords.longitude, position.coords.latitude)
          var convertor = new BMap.Convertor()
          var pointArr = []
          pointArr.push(ggPoint)
          convertor.translate(pointArr, 1, 5, self.translateCallback)
        },
        function (error) {
          console.log(error)
          var geolocation = new BMap.Geolocation()
          geolocation.getCurrentPosition(function getinfo (position) {
            self.city = position.address.city // 获取城市信息
            self.province = position.address.province
            var point = new BMap.Point(position.point.lng, position.point.lat)
            self.curPoint = point
            self.map.centerAndZoom(point, 15)
          }, function (e) {
            alert('获取定位位置信息失败')
          }, {provider: 'baidu'})
        }, null
      )
    },
    doConfirm () {
      const self = this
      if (self.$f7route.query.businessCode === 'insertPalce') {
        insertPan.methods.getCur().eventInfo.place.name = self.placeName
        insertPan.methods.getCur().eventInfo.place.coordinates = [self.curPoint.lng, self.curPoint.lat]
      }
      if (self.$f7route.query.businessCode === 'eventDetail') {
        eventDetail.methods.getCur().eventInfo.place.name = self.placeName
        eventDetail.methods.getCur().eventInfo.place.coordinates = [self.curPoint.lng, self.curPoint.lat]
      }
      self.$f7router.back()
    },
    autoComplete () {
      // Standalone With Ajax
      const self = this
      const app = self.$f7
      // Dropdown with ajax data
      self.autocompleteDropdownAjaxTypeahead = app.autocomplete.create({
        inputEl: '#mapSearch',
        openIn: 'dropdown',
        preloader: false, // enable preloader
        /* If we set valueProperty to "id" then input value on select will be set according to this property */
        valueProperty: 'name', // object's "value" property name
        textProperty: 'name', // object's "text" property name
        limit: 20, // limit to 20 results
        typeahead: false,
        // dropdownPlaceholderText: 'try insert',
        source (query, render) {
          // const autocomplete = this
          const results = []
          if (query.length === 0) {
            render(results)
            return
          }
          // Show Preloader
          // autocomplete.preloaderShow()
          // Do Ajax request to Autocomplete data
          let url = process.env.API_BDMAP + 'place/v2/suggestion'
          let param = {ak: 'dKpZ2xyxOUn3M2mpXuWN4BDXyTpMeThw',
            query: query,
            region: self.city,
            city_limit: true,
            location: self.curPoint.lat + ',' + self.curPoint.lng, // 先纬后经
            output: 'json'}
          app.request.promise({
            url: url, data: param, dataType: 'json', method: 'GET'
          }).then((data) => {
            if (data.status !== 0) {
              return false
            }
            for (let i = 0; i < data.result.length; i += 1) {
              results.push(data.result[i])
            }
            render(results)
          }, (error) => { console.log(error) })
        },
        on: {
          change: (val) => {
            self.placeName = val[0].name
            self.curPoint = new BMap.Point(val[0].location.lng, val[0].location.lat)
            self.updateCurPoint(true)
          }
        }
      })
    },
    setPlace2 (myValue) {
      const self = this
      function myFun () {
        if (local.getResults() === undefined || local.getResults().getPoi(0) === undefined) {
          self.$root.toastbuttom(self, '未找到相关位置')
          return false
        }
        var pp = local.getResults().getPoi(0).point // 获取第一个智能搜索的结果
        self.curPoint = pp
        self.updateCurPoint(true)
      }
      var local = new BMap.LocalSearch(self.map, { // 智能搜索
        onSearchComplete: myFun
      })
      local.search(myValue)
    },
    doSearch (e) {
      const self = this
      let query = e.target.value
      if (query) {
        self.placeName = query
        self.setPlace2(query)
      }
    },
    updateCurPoint (iscenter) {
      const self = this
      self.map.clearOverlays() // 清除地图上所有覆盖物
      var marker = new BMap.Marker(self.curPoint)
      self.map.addOverlay(marker)
      var label = new BMap.Label(self.placeName, {offset: new BMap.Size(20, -10)})
      marker.setLabel(label)
      if (iscenter) {
        self.map.centerAndZoom(self.curPoint, 18)
      } else {
      }
    }
  }

}
</script>

<style scoped>

</style>
