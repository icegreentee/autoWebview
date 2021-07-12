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
    <!-- 脚本 -->
    <mu-flex class="settingContent" align-items="center">
      <mu-select
        label="默认执行脚本:"
        v-model="config.selectOptions"
        full-width
      >
        <mu-option
          v-for="(option, index) in options"
          :key="index"
          :label="option.name"
          :value="index"
        ></mu-option>
      </mu-select>
    </mu-flex>
    <!-- 参数 -->
    <mu-container style="padding: 0">
      <mu-expansion-panel :expand="true" :zDepth="0">
        <div slot="header">参数设置</div>
        <mu-flex
          direction="column"
          v-if="options[config.selectOptions].config.includes('ap')"
        >
          <div>ap回复设置：</div>
          <mu-flex
            class="settingAp"
            justify-content="between"
            align-items="center"
          >
            <mu-checkbox
              v-model="config.ap50"
              label="AP回复50(绿药)"
            ></mu-checkbox>
            <mu-flex align-items="center" v-if="config.ap50">
              <div>次数限制</div>
              <input
                type="number"
                v-model="config.ap50Count"
                class="settingInput"
                maxlength="3"
              />
            </mu-flex>
          </mu-flex>
          <mu-flex
            class="settingAp"
            justify-content="between"
            align-items="center"
          >
            <mu-checkbox
              v-model="config.apfull"
              label="AP回复全(红药)"
            ></mu-checkbox>
            <mu-flex align-items="center" v-if="config.apfull">
              <div>次数限制</div>
              <input
                type="number"
                v-model="config.apfullCount"
                class="settingInput"
                maxlength="3"
              />
            </mu-flex>
          </mu-flex>
          <mu-flex
            class="settingAp"
            justify-content="between"
            align-items="center"
          >
            <mu-checkbox v-model="config.apmo" label="魔法石"></mu-checkbox>
            <mu-flex align-items="center" v-if="config.apmo">
              <div>次数限制</div>
              <input
                type="number"
                v-model="config.apmoCount"
                class="settingInput"
                maxlength="3"
              />
            </mu-flex>
          </mu-flex>
          <!-- 只使用NPC -->
          <mu-flex
            class="settingContent2"
            justify-content="between"
            align-items="center"
          >
            <div>只使用NPC（不选则优先互关好友）</div>
            <mu-switch v-model="config.justnpc"></mu-switch>
          </mu-flex>
          <!-- 防短线 -->
          <mu-flex
            class="settingContent2"
            justify-content="between"
            align-items="center"
          >
            <div>防短线（不断自动点击短线重连按钮）</div>
            <mu-switch v-model="config.keepclick"></mu-switch>
          </mu-flex>
          <!-- bp -->
          <mu-flex
            class="settingAp"
            justify-content="between"
            align-items="center"
          >
            <mu-checkbox
              v-model="config.bpfull"
              label="BP回复"
            ></mu-checkbox>
            <mu-flex align-items="center" v-if="config.bpfull">
              <div>次数限制</div>
              <input
                type="number"
                v-model="config.apfullCount"
                class="settingInput"
                maxlength="3"
              />
            </mu-flex>
          </mu-flex>
        </mu-flex>
      </mu-expansion-panel>
      <!-- 功能介绍 -->
      <mu-expansion-panel :expand="true" :zDepth="0">
        <div slot="header">功能介绍</div>
        {{ options[config.selectOptions].introduce }}
      </mu-expansion-panel>
      <!-- 使用说明 -->
      <mu-expansion-panel :expand="true" :zDepth="0">
        <div slot="header">使用说明</div>
        {{ options[config.selectOptions].helper }}
      </mu-expansion-panel>
    </mu-container>
  </mu-flex>
</template>

<script>
import scriptOptions from "../Scripts/index";
export default {
  data() {
    return {
      options: scriptOptions,
      serve: false,
      float: false,
      config: { selectOptions: 0 },
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
.settingContent2 {
  width: 100%;
  padding: 10px 0 0 0;
}
.setting-font {
  font-size: 14px;
  font-weight: 600;
}
.settingAp {
  width: 100%;
  padding: 5px 0 5px 0;
}
.settingInput {
  border: none;
  border-bottom: 1px solid #000;
  width: 50px;
  margin-left: 10px;
  outline: none;
}
</style>