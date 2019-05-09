<template>
    <f7-block strong>
      <p>Sorry2</p>
      <p>Requested content not found.</p>
      <p v-for="(msg ,index) in msgs" :key="index">
        {{msg}}
      </p>
    </f7-block>
</template>
<script>
export default {
  name: 'test2',
  created () {
    console.log('test2 created')
    const self = this
    self.msgs = ['a',
      'aa',
      'aaa'
    ]
  },
  data: function () {
    return {
      msgs: 'good'
    }
  }
}
</script>
