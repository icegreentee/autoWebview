<template>
  <div id="app">
    <mu-flex direction="column" style="height: 100%">
      <headerSide
        @changeIframe="changeIframe"
        @changeIframeNet="changeIframeNet"
      ></headerSide>
      <iframe
        v-if="iframeOpen"
        :src="iframeNet"
        width="100%"
        height="100%"
        frameborder="0"
        scrolling="auto"
      ></iframe>
      <mu-flex direction="column" style="height: 100%; width: 100%">
        <mu-flex
          class="settingContent"
          justify-content="between"
          align-items="center"
        >
          <div class="setting-font">无障碍服务</div>
          <mu-switch v-model="isopenWu"></mu-switch>
        </mu-flex>
        <mu-flex
          class="settingContent"
          justify-content="between"
          align-items="center"
        >
          <div class="setting-font">悬浮窗</div>
          <mu-switch v-model="isopenWu"></mu-switch>
        </mu-flex>
        <mu-divider style="margin-top: 10px"></mu-divider>
      </mu-flex>
    </mu-flex>
  </div>
</template>

<script>
import scripts from "./Scripts/index";
import headerSide from "./Components/headerAndSide.vue";
export default {
  components: {
    headerSide,
  },
  data() {
    return {
      iframeOpen: false,
      iframeNet: "",
      isopenWu: false,
    };
  },
  methods: {
    changeIframe(isIframe) {
      this.iframeOpen = isIframe;
    },
    changeIframeNet(net) {
      this.iframeNet = net;
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
    // this.callAJ("onFloat", scripts);
  },
};
</script>
<style>
#app {
  height: 100vh;
}
.settingContent {
  width: 100%;
  padding: 10px 15px 0 15px;
}
.setting-font {
  /* font-size: 14px;*/
  font-weight: 600;
}
</style>
