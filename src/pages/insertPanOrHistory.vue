<template>
  <f7-page>
    <f7-navbar title="请记录或计划您的日程" back-link="Back"></f7-navbar>
    <f7-list inline-labels form >
      <f7-list-input label="标题&事件" type="text"  placeholder="请输入关键字（默认：留白）" clear-button />
      <f7-list-input
        label="起始时间"
        type="datetime-local"
        placeholder="请选择时间"
      />
      <f7-list-input
        label="截止时间"
        type="datetime-local"
        placeholder="请选择时间"
      />
      <f7-list-input label="地点" type="text"  placeholder="请输入地址" clear-button />
      <f7-list-input label="关联人" type="text" placeholder="请选择关联人"  clear-button />
      <f7-list-input label="说明" type="textarea"  clear-button />
      <f7-list-input label="属性" type="select"  defaultValue="public" >
        <option value="public">公开</option>
        <option value="private">私密</option>
      </f7-list-input>
    </f7-list>
  </f7-page>
</template>

<script>

export default {
}
</script>

<style scoped>

</style>
