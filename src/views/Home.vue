<template>
  <div class="home">
    <h1>{{ appname }}</h1>
    <i id="setting" class="el-icon-s-tools" @click="setting"></i>
    <div class="home-panel">
      <el-avatar :size="140" :src="img.uri"></el-avatar>
      <p style="color: #8f8f8f;font-size: 18px;font-weight: bold;padding: 20px 10px 0">
        <span style="margin-right: 10px">Version5.0</span>
        <span>Build20220504</span>
      </p>
      <el-button id="login" round type="primary" @click="login">进入系统</el-button>

    </div>
  </div>
</template>

<script>
import {getAppPath, genDefaultConfig, readConfigExtra} from "@/utils/config";
import {SYSTEM_NAME} from '@/utils/config';

const appPath = getAppPath();
export default {
  name: 'Home',
  data() {
    return {
      img: {uri: require("@/assets/logo.jpg")},
      appname: SYSTEM_NAME,
    }
  },
  mounted() {
    this.readconfig();
  },
  methods: {
    login() {
      this.$router.push("/panel");
    },
    setting() {
      this.$router.push("/setting");
    },
    async readconfig() {
      let that = this;
      try {
        const config = await readConfigExtra();
        if (config) {
          that.appname = config.appname;
        } else {
          that.$message.error("配置文件不存在，即将创建");
          genDefaultConfig();
        }
      } catch (e) {
        if (e) {
          that.$message.error("配置文件不存在，即将创建");
          genDefaultConfig();
        }
      }
    }
  }

}
</script>
<style>
.home {
  padding: 20px;
  margin: 0 auto;
  max-width: 840px;
  user-select: none;
}

.home h1 {
  color: #8f8f8f;
}

.home-panel {
  margin-top: 6rem;
}

#input {
  max-width: 280px;
}

.home /deep/ .el-input {
  max-width: 280px;
  display: block;
  margin: 30px auto 0;
}

#login {
  margin-top: 2rem;
  width: 160px;
  padding: 16px;
  font-size: 16px;
  font-weight: bold;
  transition: width .2s ease;
}

#login:hover {
  width: 100px;
  border-radius: 60px;
  transition: width .2s ease-out;
}

#setting {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 22px;
  color: #8f8f8f;
  cursor: pointer;
}
</style>