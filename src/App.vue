<template>
  <div id="app">
    <mu-appbar style="width: 100%; position: fixed" color="primary">
      <mu-button icon slot="left" @click="open = true">
        <mu-icon value="menu"></mu-icon>
      </mu-button>
      autoTools
      <mu-button icon slot="right"
        ><mu-icon value="refresh"></mu-icon
      ></mu-button>
    </mu-appbar>
    <mu-drawer :open.sync="open" :docked="false" :right="position === 'right'">
      <mu-list>
        <mu-list-item button>
          <mu-list-item-title>首页</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button>
          <mu-list-item-title>魔纪wiki</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button>
          <mu-list-item-title>模拟抽卡</mu-list-item-title>
        </mu-list-item>
        <mu-list-item>
          <mu-text-field v-model="value1">
            <mu-button color="primary">跳转链接</mu-button>
          </mu-text-field>
        </mu-list-item>
        <mu-list-item @click="open = false" button>
          <mu-list-item-title>返回</mu-list-item-title>
        </mu-list-item>
      </mu-list>
    </mu-drawer>
    <!-- <iframe
      src="https://www.baidu.com/"
      width="100%"
      height="800"
      frameborder="0"
      scrolling="auto"
    ></iframe> -->
  </div>
</template>

<script>
import scripts from "./Scripts/index";
export default {
  data() {
    return { checkbox: true, open: false };
  },
  methods: {
    test() {
      // this.callAJ("fun", function () {
      //   log(55);
      // });
      this.callAJ("onFloat", scripts);
    },
    callAJ(functionName, arrParam) {
      let res = undefined;
      try {
        res = prompt(functionName, arrParam);
      } catch (error) {
        layToast(error);
      }
      return res;
    },
  },
  created() {
    // console.log(scripts);
  },
};
</script>
<style>
.mu-demo-form {
  width: 100%;
}
</style>
