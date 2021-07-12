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
      <div style="height: 100%; width: 100%" v-else>
        <scriptSetting></scriptSetting>
      </div>
    </mu-flex>
  </div>
</template>

<script>
import headerSide from "./Components/headerAndSide.vue";
import scriptSetting from "./Components/scriptSetting.vue";
export default {
  components: {
    headerSide,
    scriptSetting,
  },
  data() {
    return {
      iframeOpen: false,
      iframeNet: "",
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
</style>
