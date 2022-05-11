<template>
  <div class="setting">
    <el-page-header content="参数设置" @back="back" style="padding: 1rem"></el-page-header>
    <div class="st">
      <div style="padding-bottom: 2rem;">
        <div style="width: 80%;margin: 0 auto 1rem">
          <el-alert
              v-if="healthCheckStatus"
              title="数据库连接状态正常"
              :closable="false"
              type="success">
          </el-alert>
          <el-alert
              v-else
              title="数据库连接状态异常"
              :closable="false"
              type="warning">
          </el-alert>
        </div>

        <el-button :size="size" round style="margin-right: 10px;margin-bottom: 6px" type="info" @click="opendb">
          打开数据库
        </el-button>
        <el-button :size="size" round style="margin-right: 10px;margin-bottom: 6px" type="danger" @click="drop">删除数据库
        </el-button>
        <el-button :size="size" round type="success" @click="show">备份数据库</el-button>
        <el-button :size="size" round type="warning" @click="openBuild">高级本地调试</el-button>
      </div>
      <div class="conf">
        <el-input :value="config_path" class="input">
          <template slot="prepend">配置文件</template>
        </el-input>
        <el-input v-model="appname" class="input" clearable placeholder="自定义首页名称">
          <template slot="prepend">软件名称</template>
        </el-input>
        <el-input v-model="work" class="input" clearable placeholder="默认用，隔开">
          <template slot="prepend">职业可选项</template>
        </el-input>
        <el-input v-model="doc" class="input" clearable placeholder="用，隔开">
          <template slot="prepend">医师可选项</template>
        </el-input>
        <el-input v-model="solution" class="input" clearable placeholder="用，隔开">
          <template slot="prepend">治疗方案可选项</template>
        </el-input>
        <el-input v-model="page" class="input" clearable placeholder="数字">
          <template slot="prepend">分页大小</template>
        </el-input>
        <el-input v-model="channel" class="input" clearable placeholder="程序更新地址">
          <template slot="prepend">更新频道</template>
        </el-input>
      </div>
      <el-button round style="margin-top: 40px" @click="save">保存配置</el-button>
      <el-button round style="margin-top: 40px" type="primary" @click="update">更新程序</el-button>
    </div>
    <div class="copyright">
      <el-footer>copyright © Landers1037 <a href="https://github.com/landers1037" target="_blank">Github</a></el-footer>
    </div>
    <el-dialog
        :visible.sync="dialogVisible"
        title="备份数据库"
        width="70%">
      <span style="margin-right: 14px;font-weight: bold">保留当前数据</span>
      <el-button round style="margin-top: 40px" type="primary" @click="backup()">备份</el-button>
      <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
          </span>
    </el-dialog>
  </div>
</template>

<script>
import {getAppPath, getConfigPath, getDBPath, getPigappPath, readConfigExtra} from "@/utils/config";
import {shell} from 'electron';
import * as process from 'process';

const path = require("path");

const cmd = require("node-cmd");
const fs = require("fs");
const app = require("electron").remote.app;
const remote = require('electron').remote;
const appPath = getAppPath();

export default {
  name: "Setting",
  data() {
    return {
      healthCheckStatus: true,
      size: "normal",
      width: null,
      config_path: getConfigPath(),
      conf: [],
      appname: "医疗管理系统",
      work: "职工,学生,其他",
      doc: "廖世利,专家",
      solution: "",
      channel: "",
      page: 10,
      dialogVisible: false,
      ticker: null,
    }
  },
  watch: {
    width: function () {
      if (this.width < 700) {
        this.size = "small";
      } else {
        this.size = null;
      }
    },
  },
  mounted() {
    let that = this;
    that.width = document.body.clientWidth;
    window.onresize = function () {
      that.width = document.body.clientWidth;
    };
    that.readConfig();
    that.healthCheck();
  },
  beforeDestroy() {
    if (this.ticker) {
      clearInterval(this.ticker);
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.ticker) {
      clearInterval(this.ticker);
    }
    next();
  },
  methods: {
    back() {
      this.$router.push("/");
    },
    start() {
      let that = this;
      try {
        cmd.get(getPigappPath(), function (err, data, stderr) {
          if (err !== "" || err !== null) {
            that.$message.error("启动失败");
          } else {
            that.$message("启动成功");
          }
        });
      } catch (e) {
        that.$message.error("启动失败");
      }
    },
    stop() {
      cmd.run("taskkill /f /t /im pigapp.exe");
    },
    opendb() {
      shell.showItemInFolder(getDBPath());
    },
    drop() {
      this.$message.error("危险选项, 请在程序目录下删除");
    },
    show() {
      this.dialogVisible = true;
    },
    backup() {
      const dbPath = getDBPath();
      const dbPathBack = path.join(process.env.USERPROFILE, 'pig.db.back');
      fs.copyFileSync(dbPath, dbPathBack);
      this.$message.success("数据库备份完毕");
      shell.showItemInFolder(dbPathBack);
    },
    ifexists() {
      fs.access(getConfigPath(), function (err) {
        console.log(appPath);
        console.log(err);
        return !!err;
      });
    },
    async readConfig() {
      let that = this;
      const config = await readConfigExtra();
      let work = that.get(config.work);
      let doc = that.get(config.doc);
      let solution = that.get(config.solution);
      let page = config.page;
      let channel = config.updateChannel;
      that.appname = config.appname;
      that.work = work;
      that.doc = doc;
      that.solution = solution;
      that.page = page;
      that.channel = channel;
    },
    generate(list) {
      let l = [];
      for (let i = 0; i < list.length; i++) {
        if (list[i].length > 0) {
          l.push({"value": list[i]});
        }
      }
      return l;
    },
    get(list) {
      let l = '';
      for (let i = 0; i < list.length; i++) {
        if (list[i].value.length > 0) {
          l = l + list[i].value + ',';
        }
      }
      return l;
    },
    save() {
      let that = this;
      let conf;
      let appname = that.appname;
      let page = that.page;
      let work = that.work.replace("，", ",").split(",");
      let doc = that.doc.replace("，", ",").split(",");
      let solution = that.solution.replace("，", ",").split(",");
      let channel = that.channel;
      let gwork = that.generate(work);
      let gdoc = that.generate(doc);
      let gsolution = that.generate(solution);
      conf = {
        "appname": appname,
        "work": gwork,
        "doc": gdoc,
        "solution": gsolution,
        "page": parseInt(page),
        "updateChannel": channel
      };
      let str = JSON.stringify(conf, undefined, 2);
      fs.writeFileSync(appPath + "config.json", str, (err) => {
        if (err) {
          that.$message.error("保存配置失败");
        } else {
          that.$message({type: "success", message: "配置已保存"})
        }
      });
    },
    update() {
      if (this.channel) {
        shell.openExternalSync(this.channel);
      } else {
        this.$message.error("无法找到更新频道");
      }
    },
    healthCheck() {
      if (!this.ticker) {
        this.ticker = setInterval(() => {
          this.$axios.get("/api/health")
              .then()
              .catch(e => {
                this.healthCheckStatus = false;
              })
        }, 2000);
      }
    },
    openBuild() {
      shell.showItemInFolder(path.join(appPath, "build"));
    }
  }
}
</script>

<style scoped>
.setting {
  padding: 8px 8px 0 8px;
}

.st {
  padding-top: 1rem;
}

.conf {
  max-width: 80%;
  margin: 20px auto 0;
}

.conf .input {
  margin-bottom: 8px;
}

@media (max-width: 500px) {
  .conf {
    max-width: 96%;
  }
}

.copyright {
  margin-top: 30px;
  font-size: .85rem;
  color: #8f8f8f;
}
</style>