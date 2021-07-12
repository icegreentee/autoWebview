<template>
  <mu-flex direction="column">
    <mu-flex
      class="settingContent"
      justify-content="between"
      align-items="center"
    >
      <div class="setting-font">无障碍服务</div>
      <mu-switch v-model="serve"></mu-switch>
    </mu-flex>
    <mu-flex
      class="settingContent"
      justify-content="between"
      align-items="center"
    >
      <div class="setting-font">悬浮窗</div>
      <mu-switch v-model="float"></mu-switch>
    </mu-flex>
    <mu-divider style="margin-top: 10px"></mu-divider>
    <mu-flex
      class="settingContent"
      justify-content="between"
      align-items="center"
    >
      <mu-select label="默认执行脚本:"   v-model="selectScript"  full-width>
        <mu-option v-for="option,index in options" :key="option" :label="option" :value="option"></mu-option>
      </mu-select>
    </mu-flex>
  </mu-flex>
</template>

<script>
export default {
  data() {
    return {
        options: [
        'Option 1', '奥迪发阿斯顿发射点', 'Option 3', 'Option 4',
        'Option 5', 'Option 6', 'Option 7', 'Option 8',
        'Option 9', 'Option 10'
      ],
      serve: false,
      float: false,
      selectScript:"Option 1"
    };
  },
  methods: {},
};
</script>
<style >
.settingContent {
  width: 100%;
  padding: 10px 15px 0 15px;
}
.setting-font {
  font-size: 14px;
  font-weight:600;
}

</style>