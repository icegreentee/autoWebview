<template>
  <mu-flex direction="column">
    <mu-list>
      <mu-list-item button :ripple="true" @click="openServe">
        <mu-list-item-title>无障碍服务</mu-list-item-title>
        <mu-list-item-action>
          <mu-icon value="done" v-if="serve"></mu-icon>
          <mu-icon value="navigate_next" v-else></mu-icon>
        </mu-list-item-action>
      </mu-list-item>
    </mu-list>
    <mu-divider></mu-divider>
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
    <div style="padding: 0; width: 100%">
      <mu-expansion-panel :expand="true" :zDepth="0" style="width: 100%">
        <div slot="header">参数设置</div>
        <mu-flex direction="column">
          <!-- ap使用 -->
          <mu-flex
            direction="column"
            v-if="'ap50' in options[config.selectOptions].config"
            style="width: 100%"
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
                @change="change_config('ap50')"
              ></mu-checkbox>
              <mu-text-field
                v-if="config.ap50"
                prefix="次数限制："
                type="number"
                v-model="config.ap50Count"
                style="width: 110px; font-size: 12px"
                @change="change_config('ap50Count')"
              ></mu-text-field>
            </mu-flex>
            <mu-flex
              class="settingAp"
              justify-content="between"
              align-items="center"
            >
              <mu-checkbox
                v-model="config.apfull"
                label="AP回复全(红药)"
                @change="change_config('apfull')"
              ></mu-checkbox>
              <mu-text-field
                v-if="config.apfull"
                prefix="次数限制："
                type="number"
                v-model="config.apfullCount"
                style="width: 110px; font-size: 12px"
                @change="change_config('apfullCount')"
              ></mu-text-field>
            </mu-flex>
            <mu-flex
              class="settingAp"
              justify-content="between"
              align-items="center"
            >
              <mu-checkbox
                v-model="config.apmo"
                label="魔法石"
                @change="change_config('apmo')"
              ></mu-checkbox>
              <mu-text-field
                v-if="config.apmo"
                prefix="次数限制："
                type="number"
                v-model="config.apmoCount"
                style="width: 110px; font-size: 12px"
                @change="change_config('apmoCount')"
              ></mu-text-field>
            </mu-flex>
          </mu-flex>
          <!-- 只使用NPC -->
          <mu-flex
            class="settingContent2"
            justify-content="between"
            align-items="center"
            v-if="'justnpc' in options[config.selectOptions].config"
          >
            <div>只使用NPC（不选则优先互关好友）</div>
            <mu-switch
              v-model="config.justnpc"
              @change="change_config('justnpc')"
            ></mu-switch>
          </mu-flex>
          <!-- 防短线 -->
          <!-- <mu-flex
            class="settingContent2"
            justify-content="between"
            align-items="center"
          >
            <div>防短线（不断自动点击短线重连按钮）</div>
            <mu-switch v-model="config.keepclick"></mu-switch>
          </mu-flex> -->
          <!-- bp -->
          <!-- <mu-flex
            class="settingAp"
            justify-content="between"
            align-items="center"
          >
            <mu-checkbox v-model="config.bpfull" label="BP回复"></mu-checkbox>
            <mu-flex align-items="center" v-if="config.bpfull">
              <div>次数限制</div>
              <input
                type="number"
                v-model="config.apfullCount"
                class="settingInput"
                maxlength="3"
              />
            </mu-flex>
          </mu-flex> -->
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
    </div>
  </mu-flex>
</template>

<script>
import scriptOptions from "../Scripts/index";
export default {
  data() {
    return {
      options: scriptOptions,
      serve: false,
      config: { selectOptions: 0 },
    };
  },
  methods: {
    callAJ(functionName, arrParam) {
      let res = undefined;
      try {
        res = prompt(functionName, arrParam);
      } catch (error) {
        console.log(error);
      }
      return res;
    },
    openServe() {
      if (!this.serve) {
        let res = this.callAJ("is_serve");
        if (res) {
          this.serve = true;
        } else {
          this.callAJ("open_serve");
        }
      }
    },
    change_config(one_config) {
      // 对于有存储的特殊处理
      if (
        this.options[this.config.selectOptions].config[one_config] &&
        this.options[this.config.selectOptions].config[one_config].save
      ) {
        let save_data = localStorage.getItem(one_config);
        if (save_data) {
          localStorage.setItem(one_config, this.config[one_config]);
        }
      }

      // 改变设置
      let data = { config: this.config };
      this.callAJ("change_config", JSON.stringify(data));
    },
  },
  created() {
    //initServe
    // let res = this.callAJ("is_serve");
    // if (res) {
    //   this.serve = true;
    // }
    //config
    let one = {};
    for (let i = 0; i < this.options.length; i++) {
      let configs = Object.keys(this.options[i].config);
      for (let i2 = 0; i2 < configs.length; i2++) {
        if (configs[i2] in one) {
        } else {
          one[configs[i2]] = this.options[i].config[configs[i2]].default;
          // 存储值
          if (this.options[i].config[configs[i2]].save) {
            let save_data = localStorage.getItem(configs[i2]);
            if (save_data) {
              if (save_data == "true") {
                save_data = true;
              } else if (save_data == "false") {
                save_data = false;
              }
              one[configs[i2]] = save_data;
            } else {
              localStorage.setItem(
                configs[i2],
                this.options[i].config[configs[i2]].default
              );
            }
          }
        }
      }
    }
    one["selectOptions"] = this.config.selectOptions;
    this.config = one;
    //script
    // let options = [];
    // for (let i = 0; i < this.options.length; i++) {
    //   let option = {};
    //   option["name"] = this.options[i].name;
    //   option["script"] = this.options[i].script;
    //   options.push(option);
    // }
    // let data = { scripts: options, config: this.config };
    // this.callAJ("set_script", JSON.stringify(data));
  },
};
</script>
<style >
.settingAp .mu-input {
  min-height: 0px;
  margin-bottom: 0px;
  padding-bottom: 0px;
  padding-top: 0px;
}
.settingAp .mu-text-field-input {
  height: 24px;
}
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