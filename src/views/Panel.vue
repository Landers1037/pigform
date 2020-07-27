<template>
    <div class="panel">
        <el-page-header @back="back" content="操作面板">
        </el-page-header>
        <el-menu default-active="1" class="el-menu-demo" mode="horizontal">
            <el-menu-item index="1" @click="fresh">数据表格</el-menu-item>
            <el-menu-item index="2" @click="addItemDialog">添加条目</el-menu-item>
            <el-menu-item>
                <el-input placeholder="默认姓名查找" v-model="searchname">
                    <el-select v-model="searchby" slot="prepend" placeholder="按需查找" style="width: 120px">
                        <el-option label="姓名" value="name"></el-option>
                        <el-option label="日期" value="date"></el-option>
                        <el-option label="电话" value="phone"></el-option>
                        <el-option label="性别" value="sex"></el-option>
                    </el-select>
                <el-button slot="append" icon="el-icon-search" @click="Adsearch"></el-button>
            </el-input>
            </el-menu-item>
            <el-menu-item>
                <el-button icon="el-icon-s-data" @click="dbinfo">数据库信息</el-button>
            </el-menu-item>
            <el-menu-item>
                <el-button icon="el-icon-refresh" @click="fresh">全部数据</el-button>
            </el-menu-item>
            <el-menu-item>
                <el-button @click="back_up" type="primary">备份数据</el-button>
            </el-menu-item>
        </el-menu>
<!--        数据表格-->
        <el-table
                :data="tableDataSlice"
                max-height="600"
                border
                stripe
                @row-dblclick="handleclick"
                style="width: 98%;margin: 20px auto 0;">
            <el-table-column
                    prop="id"
                    :formatter="idplus"
                    align="center"
                    label="ID"
                    sortable
                    min-width="15">
            </el-table-column>
            <el-table-column
                    prop="date"
                    align="center"
                    label="日期"
                    sortable
                    width="110">
            </el-table-column>
            <el-table-column
                    prop="name"
                    align="center"
                    label="姓名"
                    width="80">
            </el-table-column>
            <el-table-column
                    prop="phone"
                    align="center"
                    label="电话"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="address"
                    label="地址"
                    align="left"
                    width="240">
            </el-table-column>
            <el-table-column
                    prop="detail"
                    align="left"
                    label="病史体检，检验及诊断">
            </el-table-column>
            <el-table-column
                    align="center"
                    label="操作"
                    width="80">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            type="primary"
                            @click="handleEdit(scope.$index, scope.row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
<!--        底部分页栏-->
        <el-pagination
                style="margin-top: 15px"
                background
                layout="prev, pager, next,jumper"
                :pager-count="9"
                :page-size="page"
                :total="count_size()"
                @current-change="load_data"
        >
        </el-pagination>
        <el-dialog
                title="详细信息"
                :visible.sync="dialogVisible"
                class="dialog"
                align="left"
                >
            <el-date-picker
                    v-model="itemdata.date"
                    type="date"
                    class="in-input small"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
            </el-date-picker>
            <el-input placeholder="请输入内容" v-model="itemdata.name" class="in-input small">
                <template slot="prepend">姓名</template>
            </el-input>
            <el-select v-model="itemdata.sex" placeholder="请选择性别" class="in-input small in">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
            </el-select>
            <el-input placeholder="0" v-model="itemdata.age" class="in-input small in">
                <template slot="prepend">年龄</template>
            </el-input>
            <el-input placeholder="请输入内容" v-model="itemdata.illtime" class="in-input small">
                <template slot="prepend">发病时间</template>
            </el-input>
            <el-input placeholder="请输入内容" v-model="itemdata.phone" class="in-input small">
                <template slot="prepend">电话</template>
            </el-input>
            <el-input placeholder="请输入内容" v-model="itemdata.parent" class="in-input small">
                <template slot="prepend">家属名称</template>
            </el-input>
            <el-input placeholder="请输入内容" v-model="itemdata.work" class="in-input small">
                <template slot="prepend">工作单位及职业</template>
            </el-input>
            <el-input placeholder="请输入内容" v-model="itemdata.address" class="in-input">
                <template slot="prepend">地址</template>
            </el-input>
            <el-input placeholder="请输入内容" v-model="itemdata.detail" class="in-input" clearable>
                <template slot="prepend">病史体检，检验及诊断</template>
            </el-input>
            <el-autocomplete
                    class="in-input"
                    style="width: 100%"
                    v-model="itemdata.solution"
                    :fetch-suggestions="querySolution"
                    placeholder="请输入">
                <template slot="prepend">治疗方案</template>
            </el-autocomplete>
            <el-input
                    type="textarea"
                    placeholder="备注内容"
                    v-model="itemdata.addon"
                    maxlength="200"
                    show-word-limit
                    rows="3"
            >
            </el-input>
            <el-input placeholder="请输入内容" v-model="itemdata.money" class="in-input small" clearable>
                <template slot="prepend">收费及其他</template>
            </el-input>
            <el-autocomplete
                    class="in-input small"
                    v-model="itemdata.doc"
                    :fetch-suggestions="queryDoc"
                    placeholder="请输入">
                <template slot="prepend">医师</template>
            </el-autocomplete>
            <el-button @click="edititem" style="margin-top: 10px" type="info">修改条目</el-button>
            <el-button @click="copyitem" style="margin-top: 10px" type="primary">复制条目</el-button>
            <el-button @click="delitem" style="margin-top: 10px" type="danger">删除条目</el-button>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
            </span>
        </el-dialog>
        <el-dialog
                title="添加条目"
                :visible.sync="addvisible"
                class="dialog"
                align="left"
        >
            <el-date-picker
                    v-model="adddata.date"
                    type="date"
                    class="in-input small"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
            </el-date-picker>
            <el-input placeholder="请输入内容" v-model="adddata.name" class="in-input small">
                <template slot="prepend">姓名</template>
            </el-input>
            <el-select v-model="adddata.sex" placeholder="请选择性别" class="in-input small in">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
            </el-select>
            <el-input placeholder="0" v-model="adddata.age" class="in-input small in">
                <template slot="prepend">年龄</template>
            </el-input>
            <el-input placeholder="请输入内容" v-model="adddata.illtime" class="in-input small">
                <template slot="prepend">发病时间</template>
            </el-input>
            <el-input placeholder="请输入内容" v-model="adddata.phone" class="in-input small">
                <template slot="prepend">电话</template>
            </el-input>
            <el-input placeholder="请输入内容" v-model="adddata.parent" class="in-input small">
                <template slot="prepend">家属名称</template>
            </el-input>
            <el-autocomplete
                    class="in-input"
                    style="width: 100%"
                    v-model="adddata.work"
                    :fetch-suggestions="queryWork"
                    placeholder="请输入内容">
                <template slot="prepend">工作单位及职业</template>
            </el-autocomplete>
            <el-input placeholder="请输入内容" v-model="adddata.address" class="in-input" clearable>
                <template slot="prepend">地址</template>
            </el-input>
            <el-input placeholder="请输入内容" v-model="adddata.detail" class="in-input" clearable>
                <template slot="prepend">病史体检，检验及诊断</template>
            </el-input>
            <el-autocomplete
                    class="in-input"
                    style="width: 100%"
                    v-model="adddata.solution"
                    :fetch-suggestions="querySolution"
                    placeholder="请输入">
                <template slot="prepend">治疗方案</template>
            </el-autocomplete>
            <el-input
                    type="textarea"
                    placeholder="备注内容"
                    v-model="adddata.addon"
                    maxlength="200"
                    show-word-limit
                    rows="3"
                    clearable
            >
            </el-input>
            <el-autocomplete
                    class="in-input small"
                    v-model="adddata.money"
                    :fetch-suggestions="queryMoney"
                    placeholder="请输入内容">
                <template slot="prepend">收费及其他</template>
            </el-autocomplete>
            <el-autocomplete
                    class="in-input small"
                    v-model="adddata.doc"
                    :fetch-suggestions="queryDoc"
                    placeholder="请输入">
                <template slot="prepend">医师</template>
            </el-autocomplete>
            <el-button style="margin-top: 10px" type="success" @click="checkAdd">添加条目</el-button>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="checkAdd">确定添加</el-button>
            </span>
        </el-dialog>
        <el-dialog title="数据库信息" :visible.sync="db_show">
            <p style="font-size: 20px">数据库条目数量: {{db_info.count}}</p>
            <p style="font-size: 20px">数据库占用空间: {{db_info.size}}KB</p>
            <p style="font-size: 20px">数据库最新备份: {{db_info.new_bk}}</p>
        </el-dialog>
    </div>
</template>

<script>
    const remote = require("electron").remote;
    const app = require("electron").remote.app;
    const menuitem = remote.MenuItem;
    const menu = remote.Menu; //全局的右键
    let appPath = app.getPath("exe").replace("pigform.exe","");
    //let appPath = app.getPath("exe").replace("electron.exe","");
    export default {
        name: "Panel",
        data(){
            return{
                dialogVisible: false, //修改框可见
                addvisible: false, //添加框可见
                itemdata: {id:"",date:"",name:"",sex:"",age:"",illtime:"",phone:"",parent:"",work:"",address:"",detail:"",solution:"",addon:"",money:"",doc:"廖世利"},
                adddata: {date:"",name:"",sex:"",age:"",illtime:"",phone:"",parent:"",work:"",address:"",detail:"",solution:"",addon:"",money:"",doc:"廖世利"},
                searchby:'', //搜索方式
                worksuggestion: [
                    {"value":"职工"},
                    {"value":"学生"},
                    {"value":"其他"},
                    ],
                moneysuggestion: [
                    {"value":"医保卡"},
                    {"value":"现金"},
                ],
                docsuggestion:[
                    {"value":"廖世利"},
                    {"value":"专家"},
                ],
                solutionsuggestion:[
                    {"value":"吊针"},
                ],
                checked: false, //
                tableData: [], //表格数据
                tableDataSlice: [],//分页数据
                page: 0,//分页大小
                searchname:"", //搜索的关键词
                repeat: false, //判断添加条目按钮抖动
                copyrepeat: false, //判断复制条目按钮抖动,
                menu1: null, //右键
                db_info: {},
                db_show: false
            }
        },
        watch:{
          searchname:function () {
              if(this.searchname.length>=0){
                  setTimeout(()=>{
                      this.Adsearch();
                  },1000);
              }
          }
        },
        mounted(){
            this.fresh();
            this.initMenu();
            this.readconfig();
            let that = this;
            // window.addEventListener('contextmenu', (e) => {
            //     e.preventDefault();
            //     that.menu1.popup({ window: remote.getCurrentWindow() });
            // }, false);
            window.oncontextmenu = function () {
                that.menu1.popup({ window: remote.getCurrentWindow() });
                return false
            }
        },
        methods:{
            back(){
                this.$router.push("/");
            },
            count_size(){
              return this.tableData?this.tableData.length:1;
            },
            //配置文件
            readconfig(){
                let fs = require("fs");
                let that = this;
                fs.stat(appPath+"pig.db",function (err,stat) {
                    if(!stat){
                        that.$message("数据库不存在，即将创建");
                        that.$axios.post("/api/createdb").then(res=>{
                            if(res.data==="bad"){
                                that.$message.error("数据库生成失败");
                            }else{
                                that.$message("数据库初始化成功");
                            }
                        });
                    }
                });
                fs.stat(appPath+"config.json", function(err,stats) {
                    if(stats){
                        fs.readFile(appPath+"config.json",function (err,data) {
                            if(!err){
                                let d = JSON.parse(data.toString());
                                that.worksuggestion = d.work;
                                that.docsuggestion = d.doc;
                                that.solutionsuggestion = d.solution;
                                that.page = d.page;
                            }
                        });
                    }else{
                        that.$message.error("配置文件不存在，即将创建");
                        let conf = {
                            "port": "5000",
                            "work": [{"value":"职工"}, {"value":"学生"}, {"value":"其他"}],
                            "doc": [{"value":"廖世利"}, {"value":"专家"}],
                            "solution": [],
                            "page": 20
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
            fresh(){
                let that = this;
                this.$axios.get("/api/data").then(res=>{
                    if(res.data !=="bad"){
                        try {
                            that.tableData = res.data;
                            this.$message("载入数据完成");
                            this.load_data(1);
                        }catch (e) {
                            this.$message.error("数据转换错误");
                        }
                    }
                }).catch(()=>{
                    this.$message.error("数据请求错误");
                });
            },
            handleEdit(index, row){
                let id = row.id;
                let that = this;
                this.$axios.get("/api/data",{params: {"id":id}}).then(res=>{
                    that.itemdata = res.data;
                    that.dialogVisible = true;
                });
            },
            handleclick(row){
                let id = row.id;
                let that = this;
                this.$axios.get("/api/data",{params: {"id":id}}).then(res=>{
                    that.itemdata = res.data;
                    that.dialogVisible = true;
                });
            },
            queryWork(queryString, cb){
                var results =  this.worksuggestion;
                cb(results);
            },
            queryMoney(queryString, cb){
                var results =  this.moneysuggestion;
                cb(results);
            },
            queryDoc(queryString, cb){
                var results =  this.docsuggestion;
                cb(results);
            },
            querySolution(queryString, cb){
                var results =  this.solutionsuggestion;
                cb(results);
            },
            addItemDialog(){
                this.addvisible = true;
                this.repeat = false;
            },
            addItem(){
                let that = this;
                let data = that.adddata;
                this.adddata = {date:"",name:"",sex:"",age:"",illtime:"",phone:"",parent:"",work:"",address:"",detail:"",solution:"",addon:"",money:"",doc:"廖世利"};
                this.$axios.post("/api/add",data).then(res=>{
                    if(res.data === "ok"){
                        that.$message("条目添加完成");
                        this.repeat = true;
                        setTimeout(()=>{
                            that.addvisible = false;
                        },400);
                        setTimeout(()=>{
                            that.fresh();
                        },400);
                    }
                }).catch(()=>{
                    that.$message.error("API请求错误");
                    that.addvisible = false;
                })
            },
            checkAdd(){
                if(this.repeat){
                    this.$message.error("请勿重复提交");
                }else if(this.adddata.date!=="" && this.adddata.name !== ""){
                    this.addItem();
                }else {
                    this.$message.error("确保信息填写完整");
                }
            },
            delitem(){
                let that = this;
                let id = this.itemdata.id;
                this.$axios.post("/api/del",{"id":id}).then(res=>{
                    if(res.data === "ok"){
                        that.$message("条目删除完成");
                        setTimeout(()=>{
                            that.dialogVisible = false;
                        },400);
                        setTimeout(()=>{
                            that.fresh();
                        },400);
                    }
                }).catch(()=>{
                    that.$message.error("API请求错误");
                })
            },
            edititem(){
                let that = this;
                let data = that.itemdata;
                this.$axios.post("/api/edit",data).then(res=>{
                    if(res.data === "ok"){
                        that.$message("条目修改完成");
                        setTimeout(()=>{
                            that.dialogVisible = false;
                        },400);
                        setTimeout(()=>{
                           that.fresh();
                        },400);
                    }
                }).catch(()=>{
                    that.$message.error("API请求错误");
                })
            },
            copyitem(){
                let that = this;
                let data = that.itemdata;
                if(that.copyrepeat){
                    that.$message.error("请勿重复添加");
                }else{
                    this.$axios.post("/api/add",data).then(res=>{
                        if(res.data === "ok"){
                            that.$message("条目复制完成");
                            this.copyrepeat = true;
                            setTimeout(()=>{
                                that.dialogVisible = false;
                                that.copyrepeat = false;
                            },400);
                            setTimeout(()=>{
                                that.fresh();
                            },400);
                        }
                    }).catch(()=>{
                        that.$message.error("API请求错误");
                        that.addvisible = false;
                    });
                }
            },
            search(data){
                let that = this;
                if(that.searchname === ""){
                    //that.$message.error("搜索不能为空");
                }else {
                    this.$axios.get("/api/se",{params:data}).then(res=>{
                        if(res.data === "bad"){
                            that.$message.error("API请求错误");
                        }else if(res.data.length <= 0){
                            this.$message("没有查询到相关数据");
                        } else{
                            that.tableData = res.data;
                            //因为分片逻辑修改
                            that.load_data(1);
                            this.$message("载入数据完成");
                        }
                    });
                }
            },
            Adsearch(){
                //switch多种查找方式
                let searchby = this.searchby!==""?this.searchby:"name";
                if(searchby==="name"){
                    this.search({"name":this.searchname})
                }else if(searchby==="sex"){
                    this.search({"sex":this.searchname})
                }else if(searchby==="phone"){
                    this.search({"phone":this.searchname})
                }else if(searchby==="date"){
                    this.search({"date":this.searchname})
                }
            },
            initMenu(){
                let that = this;
                //菜单应该非全局建立
                that.menu1 = new menu();
                that.menu1.append(new menuitem({"label":"添加条目",click(){
                    that.addItemDialog();
                    }}));
                that.menu1.append(new menuitem({type:"separator"}));
                that.menu1.append(new menuitem({label:"剪切",role:"cut"}));
                that.menu1.append(new menuitem({label:"复制",role:"copy"}));
                that.menu1.append(new menuitem({label:"粘贴",role:"paste"}));
                that.menu1.append(new menuitem({label:"全选",role:"selectAll"}));
            },
            idplus(row,value,id){
                // console.log(row,value,id);
                return "0000"+id;
            },
            dbinfo(){
                //数据库信息获取
                let that = this;
                try {
                    that.$axios.get('/api/info').then(res=>{
                        that.db_info = res.data;
                        that.db_show = true;
                    });
                }catch (e) {
                    that.$message.error("API请求错误");
                }
            },
            //分页
            load_data(e){
                let page_now = e;
                let page = parseInt(this.page);
                let data = this.tableData.slice((page_now-1)*page,page*page_now);
                this.tableDataSlice = data;
            },
            back_up(){
                let data = {"type": 0};
                this.$axios.post("/api/backup",data).then(res=>{
                    if(res.data==="bad"){
                        this.$message.error("数据库备份失败");
                    }else if(res.data === "ok"){
                        let d = new Date();
                        let day =  d.toLocaleDateString();
                        this.$message({type: "success",message:day+"备份成功"});
                    }
                });
            }
        }
    }
</script>
<style>
    html{
        height: 100vh;
    }
    body{
        height: 100vh;
    }
</style>
<style scoped>
    .panel{
        padding-top: 8px;
        user-select: none;
    }
    .in-input{
        margin-bottom: 6px;
    }
    .in-input.small{
        width: 32%;
        margin-right: 1%;
    }
    .in-input.small.in{
        width: 16%;
    }
    .dialog /deep/ .el-dialog{
        width: 90%;
    }
    @media (max-width: 800px) {
        .dialog /deep/ .el-dialog{
            width: 96%;
        }
    }
</style>