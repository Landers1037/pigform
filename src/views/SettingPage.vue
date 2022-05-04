<template>
  <div class="setting">
    <div class="st">
      <span style="padding: 0 8px;color: #8f8f8f">后台配置</span>
      <el-select v-model="port" placeholder="请选择启动端口">
        <el-option label="5000" value="5000"></el-option>
      </el-select>
      <div style="padding: 30px;margin-top: 20px">
        <el-button :size="size" round style="margin-right: 10px;margin-bottom: 6px" type="danger" @click="start">启动后台
        </el-button>
        <el-button :size="size" round style="margin-right: 10px;margin-bottom: 6px" type="primary" @click="stop">停止后台
        </el-button>
        <el-button :size="size" round style="margin-right: 10px;margin-bottom: 6px" type="primary" @click="createdb">
          新建数据库
        </el-button>
        <el-button :size="size" round style="margin-right: 10px;margin-bottom: 6px" type="danger" @click="drop">删除数据库
        </el-button>
        <el-button :size="size" round type="success" @click="show">备份数据库</el-button>
      </div>
      <div class="conf">
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
      </div>
      <el-button round style="margin-top: 40px" @click="save">保存配置</el-button>
      <el-button round style="margin-top: 40px" type="primary" @click="update">更新程序</el-button>
    </div>
    <el-dialog
        :visible.sync="dialogVisible"
        title="备份数据库"
        width="70%">
      <span style="margin-right: 14px;font-weight: bold">保留当前数据</span>
      <el-button round style="margin-top: 40px" type="primary" @click="backup(0)">备份</el-button>
      <br>
      <span style="margin-right: 14px;font-weight: bold">清空当前数据</span>
      <el-button round style="margin-top: 40px" type="warning" @click="backup(1)">备份并清空</el-button>
      <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
          </span>
    </el-dialog>
  </div>
</template>

<script>
import {getConfigPath, readConfigExtra} from "@/utils/config";
import {shell} from "electron";

let fs = require("fs");
const app = require("electron").remote.app;
const remote = require('electron').remote;
let appPath = app.getPath("exe").replace("pigform.exe", "");
export default {
  name: "SettingPage",
  data() {
    return {
      size: "normal",
      width: null,
      port: "5000",
      conf: [],
      appname: "医疗管理系统",
      work: "职工,学生,其他",
      doc: "廖世利,专家",
      solution: "",
      page: 0,
      dialogVisible: false
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
    that.readconfig();
  },
  methods: {
    back() {
      this.$router.push("/");
    },
    start() {
      let that = this;
      try {
        that.$message("启动成功");
      } catch (e) {
        that.$message.error("启动失败");
      }
    },
    stop() {
      that.$message("停止成功");
    },
    createdb() {
      this.$axios.post("/api/createdb").then(res => {
        if (res.data === "bad") {
          this.$message.error("数据库生成失败");
        } else {
          this.$message("生成数据库文件成功");
          this.$message("地址:" + res.data.uri)
        }
      });
    },
    drop() {
      this.$message.error("危险选项");
      // this.$axios.post("/api/drop").then(res=>{
      //     if(res.data==="ok"){
      //         this.$message("删除数据库文件成功")
      //     }
      // });
    },
    show() {
      this.dialogVisible = true;
    },
    backup(num) {
      let data = {"type": num};
      this.$axios.post("/api/backup", data).then(res => {
        if (res.data === "bad") {
          this.$message.error("数据库备份失败");
        } else if (res.data === "ok") {
          this.$message({type: "success", message: "数据库备份成功"});
        }
      });
    },
    ifexists() {
      fs.access(getConfigPath(), function (err) {
        console.log(appPath);
        console.log(err);
        return !!err;
      });
    },
    async readconfig() {
      let that = this;
      const config = await readConfigExtra();
      let work = that.get(config.work);
      let doc = that.get(config.doc);
      let solution = that.get(config.solution);
      let page = config.page;
      that.appname = config.appname;
      that.work = work;
      that.doc = doc;
      that.solution = solution;
      that.page = page;
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

      let gwork = that.generate(work);
      let gdoc = that.generate(doc);
      let gsolution = that.generate(solution);
      conf = {
        "appname": appname,
        "port": that.port,
        "work": gwork,
        "doc": gdoc,
        "solution": gsolution,
        "page": parseInt(page)
      };
      let str = JSON.stringify(conf, undefined, 2);
      fs.writeFile(getConfigPath(), str, function (err) {
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
  }
}
</script>

<style scoped>
.setting {
  padding-top: 8px;
}

.st {
  padding-top: 60px;
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
</style>