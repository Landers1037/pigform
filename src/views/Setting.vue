<template>
    <div class="setting">
        <el-page-header @back="back" content="设置页面">
        </el-page-header>
        <div class="st">
            <span style="padding: 0 8px;color: #8f8f8f">后台配置</span>
            <el-select v-model="port" placeholder="请选择启动端口">
                    <el-option label="5000" value="5000"></el-option>
            </el-select>
            <div style="padding: 30px;margin-top: 20px">
                <el-button type="danger" round style="margin-right: 10px;margin-bottom: 6px" @click="start" :size="size">启动后台</el-button>
                <el-button type="primary" round style="margin-right: 10px;margin-bottom: 6px" @click="stop" :size="size">停止后台</el-button>
                <el-button type="primary" round style="margin-right: 10px;margin-bottom: 6px" @click="createdb" :size="size">重建数据库</el-button>
                <el-button type="danger" round style="margin-right: 10px;margin-bottom: 6px" @click="drop" :size="size">删除数据库</el-button>
                <el-button type="success" round  @click="show" :size="size">备份数据库</el-button>
            </div>
            <div class="conf">
                <el-input placeholder="自定义首页名称" v-model="appname" clearable class="input">
                    <template slot="prepend">软件名称</template>
                </el-input>
                <el-input placeholder="默认用，隔开" v-model="work" clearable class="input">
                    <template slot="prepend">职业可选项</template>
                </el-input>
                <el-input placeholder="用，隔开" v-model="doc" clearable class="input">
                    <template slot="prepend">医师可选项</template>
                </el-input>
                <el-input placeholder="用，隔开" v-model="solution" clearable class="input">
                    <template slot="prepend">治疗方案可选项</template>
                </el-input>
                <el-input placeholder="数字" v-model="page" clearable class="input">
                    <template slot="prepend">分页大小</template>
                </el-input>
            </div>
            <el-button round @click="save" style="margin-top: 40px">保存配置</el-button>
            <el-button round @click="update" style="margin-top: 40px" type="primary">更新程序</el-button>
        </div>
        <el-dialog
                title="备份数据库"
                :visible.sync="dialogVisible"
                width="70%">
            <span style="margin-right: 14px;font-weight: bold">保留当前数据</span>
            <el-button round @click="backup(0)" style="margin-top: 40px" type="primary">备份</el-button><br>
            <span style="margin-right: 14px;font-weight: bold">清空当前数据</span>
            <el-button round @click="backup(1)" style="margin-top: 40px" type="warning">备份并清空</el-button>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
    let cmd = require("node-cmd");
    let fs = require("fs");
    const app = require("electron").remote.app;
    const remote = require('electron').remote;
    let appPath = app.getPath("exe").replace("pigform.exe","");
    // let appPath = app.getPath("exe").replace("electron.exe","");
    export default {
        name: "Setting",
        data(){
            return{
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
        watch:{
            width:function () {
                if(this.width < 700){
                    this.size = "small";
                }else {
                    this.size = null;
                }
            },
        },
        mounted(){
            let that = this;
            that.width = document.body.clientWidth;
            window.onresize = function () {
                that.width = document.body.clientWidth;
            };
            that.readconfig();
        },
        methods:{
            back(){
                this.$router.push("/");
            },
            start(){
                let that = this;
                try{
                    cmd.get('"'+appPath+"pigapp\\"+"pigapp.exe"+'"',function (err,data,stderr) {
                        console.log(err);
                        console.log(data.toString());
                        if(err!=="" || err !== null){
                            that.$message.error("启动失败");
                        }else{
                            that.$message("启动成功");
                        }
                    });
                }catch (e) {
                    that.$message.error("启动失败");
                }
            },
            stop(){
                cmd.run("taskkill /f /t /im pigapp.exe");
            },
            createdb(){
                this.$axios.post("/api/createdb").then(res=>{
                   if(res.data==="bad"){
                       this.$message.error("数据库生成失败");
                   }else{
                       this.$message("生成数据库文件成功");
                       this.$message("地址:"+res.data.uri)
                   }
                });
            },
            drop(){
                this.$message.error("危险选项");
                // this.$axios.post("/api/drop").then(res=>{
                //     if(res.data==="ok"){
                //         this.$message("删除数据库文件成功")
                //     }
                // });
            },
            show(){
              this.dialogVisible = true;
            },
            backup(num){
                let data = {"type": num};
                this.$axios.post("/api/backup",data).then(res=>{
                    if(res.data==="bad"){
                        this.$message.error("数据库备份失败");
                    }else if(res.data === "ok"){
                        this.$message({type: "success",message:"数据库备份成功"});
                    }
                });
            },
            ifexists(){
                fs.access(appPath+"config.json", function(err) {
                    console.log(appPath);
                    console.log(err);
                    return !!err;
                });
            },
            readconfig(){
                let that = this;
                fs.stat(appPath+"config.json", function(err,stats) {
                    if(stats){
                        fs.readFile(appPath+"config.json",function (err,data) {
                            if(!err){
                                let d = JSON.parse(data.toString());
                                let work = that.get(d.work);
                                let doc = that.get(d.doc);
                                let solution = that.get(d.solution);
                                let page = d.page;
                                that.appname = d.appname;
                                that.work = work;
                                that.doc = doc;
                                that.solution = solution;
                                that.page = page;
                            }
                        });
                    }else{
                        that.$message.error("配置文件不存在，请自行创建");
                    }
                });
            },
            generate(list){
                let l = [];
              for(let i=0;i<list.length;i++){
                  if(list[i].length>0){
                      l.push({"value": list[i]});
                  }
              }
              return l;
            },
            get(list){
                let l = '';
                for(let i=0;i<list.length;i++){
                    if(list[i].value.length>0){
                        l = l+list[i].value+',';
                    }
                }
                return l;
            },
            save(){
                let that = this;
                let conf;
                let appname = that.appname;
                let page = that.page;
                let work = that.work.replace("，",",").split(",");
                let doc = that.doc.replace("，",",").split(",");
                let solution = that.solution.replace("，",",").split(",");

                let gwork = that.generate(work);
                let gdoc =that.generate(doc);
                let gsolution = that.generate(solution);
                conf = {
                    "appname": appname,
                    "port": that.port,
                    "work": gwork,
                    "doc": gdoc,
                    "solution": gsolution,
                    "page": parseInt(page)
                };
                let str = JSON.stringify(conf,undefined,2);
                fs.writeFile(appPath+"config.json",str, function (err){
                    if(err){
                        that.$message.error("保存配置失败");
                    }else{
                        that.$message({type:"success",message:"配置已保存"})
                    }
                });
            },
            update(){
                let that = this;
                remote.dialog.showOpenDialog({title:"选择更新程序"}).then(s=>{
                    console.log(s.filePaths[0]);
                    let file = s.filePaths[0];
                    if(file.indexOf("app.asar")!==-1){
                        that.$message("即将更新程序，程序将退出");
                        let update_cmd = "update.exe\" "+file;
                        cmd.run('"'+appPath+"pigapp\\"+update_cmd);
                        // cmd.get(appPath+"build/"+update_cmd,function (err,data) {
                        //     console.log(err);
                        // });
                        setTimeout(()=>{
                            app.quit();
                        },1500);
                    }else {
                        that.$message.error("请指定更新程序");
                    }
                });

            }
        }
    }
</script>

<style scoped>
    .setting{
        padding-top: 8px;
    }
    .st{
        padding-top: 60px;
    }
    .conf{
        max-width: 80%;
        margin: 20px  auto 0;
    }
    .conf .input{
        margin-bottom: 8px;
    }
    @media (max-width: 500px) {
        .conf{
            max-width: 96%;
        }
    }
</style>