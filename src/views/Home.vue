<template>
  <div class="home">
    <h1>{{appname}}</h1>
    <i class="el-icon-s-tools" id="setting" @click="setting"></i>
    <div class="home-panel">
      <el-avatar :size="140" :src="img.uri"></el-avatar>
      <el-input placeholder="请输入密码" v-model="pass" show-password id="input"></el-input>
      <el-button type="primary" round id="login" @click="login" style="width: 160px;padding-top: 14px;padding-bottom: 14px;font-size: 16px;">进入系统</el-button>
    </div>
  </div>
</template>

<script>
  const app = require("electron").remote.app;
  let appPath = app.getPath("exe").replace("pigform.exe","");
  // let appPath = app.getPath("exe").replace("electron.exe","");
export default {
  name: 'Home',
  data(){
    return{
      pass: '',
      img: {uri: require("@/assets/logo.jpg")},
      appname: "医疗管理系统"
    }
  },
  mounted(){
    this.readconfig();
  },
  methods:{
    login(){
      if(this.pass.length<=0){
        // this.$message.error("必须输入密码");
        this.$router.push("/panel");
      }else{
        this.$axios.post("/api/login",{"code":this.pass}).then(res=>{
          if(res.data["data"]==="ok"){
            this.$router.push("/panel");
          }
        }).catch(()=>{
          this.$message.error("后台服务器未启动，继续使用会出问题");
          setTimeout(()=>{
            this.$router.push("/panel");
          },2000)
        })
      }
    },
    setting(){
      this.$router.push("/setting");
    },
    readconfig(){
      let fs = require("fs");
      let that = this;
      fs.stat(appPath+"config.json", function(err,stats) {
        if(stats){
          fs.readFile(appPath+"config.json",function (err,data) {
            if(!err){
              let d = JSON.parse(data.toString());
              that.appname = d.appname;
            }
          });
        }else{
          that.$message.error("配置文件不存在，即将创建");
          let conf = {
            "appname": "医疗管理系统",
            "port": "5000",
            "work": [{"value":"职工"}, {"value":"学生"}, {"value":"其他"}],
            "doc": [{"value":"廖世利"}, {"value":"专家"}],
            "solution": []
          };
          let str = JSON.stringify(conf,undefined,2);
          fs.writeFile(appPath+"config.json",str, function (err){
            if(err){
              console.log(err);
            }
          });
        }
      });
    },
  }

}
</script>
<style>
  .home{
    padding: 20px;
    margin: 0 auto;
    max-width: 840px;
    user-select: none;
  }
  .home h1{
    color: #8f8f8f;
  }
  .home-panel{
    margin-top: 60px;
  }
  #input{
    max-width: 280px;
  }
  .home /deep/ .el-input{
    max-width: 280px;
    display: block;
    margin: 30px auto 0;
  }
  #login{
    margin-top: 40px;
  }
  #setting{
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 22px;
    color: #8f8f8f;
    cursor: pointer;
  }
</style>