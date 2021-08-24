<template>
  <div style="width: 100%">
    <mu-appbar style="width: 100%" color="primary">
      <mu-button icon slot="left" @click="open = true">
        <mu-icon value="menu"></mu-icon>
      </mu-button>
      autoTools-beta
    </mu-appbar>

    <mu-drawer :open.sync="open" :docked="false">
      <mu-list>
        <div class="ava">
          <mu-avatar :size="56">
            <img src="../img/1.png" />
          </mu-avatar>
          <div style="margin-top: 5px; font-weight: 600">
            周回auto机器人全自动小伊v8
          </div>
        </div>
        <mu-divider></mu-divider>
        <mu-list-item button @click="backHome">
          <mu-list-item-title>首页</mu-list-item-title>
        </mu-list-item>
        <mu-list-item
          button
          @click="goPage('https://magireco.moe/wiki/%E9%A6%96%E9%A1%B5')"
        >
          <mu-list-item-title>魔纪wiki</mu-list-item-title>
        </mu-list-item>
        <mu-list-item
          button
          @click="goPage('http://rika.ren/~kuro/workspace/playground/')"
        >
          <mu-list-item-title>模拟抽卡</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button @click="openSimple = true">
          <mu-list-item-title>切换源</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button @click="goPage('https://baidu.com')">
          <mu-list-item-title>检查更新</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button @click="openconsole">
          <mu-list-item-title>日志</mu-list-item-title>
        </mu-list-item>
        <mu-list-item @click="open = false" button>
          <mu-list-item-title>返回</mu-list-item-title>
        </mu-list-item>
      </mu-list>
    </mu-drawer>

    <mu-dialog title="输入网址" width="360" :open.sync="openSimple">
      <mu-flex>
        <mu-text-field v-model="netinput"></mu-text-field>
        <mu-button color="primary" @click="changeSource">切换源</mu-button>
      </mu-flex>
    </mu-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      open: false,
      openSimple: false,
      netinput: "",
    };
  },
  created() {
    let save_data = localStorage.getItem("change_source");
    if (save_data) {
      this.netinput = save_data;
    } else {
      localStorage.setItem("change_source", this.netinput);
    }
  },
  methods: {
    backHome() {
      this.open = false;
      this.$emit("changeIframe", false);
    },
    goPage(net) {
      this.open = false;
      this.$emit("changeIframe", true);
      this.$emit("changeIframeNet", net);
    },
    callAJ(functionName, arrParam) {
      let res = undefined;
      try {
        res = prompt(functionName, arrParam);
      } catch (error) {
        console.log(error);
      }
      return res;
    },
    openconsole() {
      this.callAJ("open_console");
    },
    changeSource() {
      this.callAJ("change_source", this.netinput);
      localStorage.setItem("change_source", this.netinput);
    },
  },
};
</script>
<style>
.ava {
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 15px;
}
</style>
