<template>
    <f7-block strong>
      <p>Sorry</p>
      <p>Requested content not found.</p>
      <p v-for="(msg ,index) in msgs" :key="index">
        {{msg}}
      </p>
    </f7-block>
</template>
<script>
export default {
  name: 'test1',
  created () {
    console.log('test1 created')
    const self = this
    self.msgs = ['cordova.file.applicationDirectory:',
      'cordova.file.documentsDirectory:',
      'cordova.file.dataDirectory:',
      'cordova.file.cacheDirectory:',
      '400'
    ]
  },
  data: function () {
    return {
      msgs: 'good'
    }
  }
}

</script>
