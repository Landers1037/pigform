<template>
  <div class="panel">
    <el-page-header content="操作面板" @back="back" style="padding: 1rem">
    </el-page-header>
    <el-menu class="el-menu-demo" default-active="1" mode="horizontal">
      <el-menu-item index="1">
        <i @click="fresh" class="el-icon-document"></i>
      </el-menu-item>
      <el-menu-item index="2">
        <i @click="addItemDialog" class="el-icon-document-add"></i>
      </el-menu-item>
      <el-menu-item>
        <el-input v-model="searchname" placeholder="默认姓名查找" size="small">
          <el-select slot="prepend" v-model="searchby" placeholder="按需查找" style="width: 100px">
            <el-option label="姓名" value="name"></el-option>
            <el-option label="日期" value="date"></el-option>
            <el-option label="电话" value="phone"></el-option>
            <el-option label="性别" value="sex"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="Adsearch" size="small"></el-button>
        </el-input>
      </el-menu-item>
      <el-menu-item>
        <el-button icon="el-icon-s-data" @click="dbinfo" size="mini">数据库信息</el-button>
      </el-menu-item>
      <el-menu-item>
        <el-button icon="el-icon-refresh" @click="fresh" size="mini">全部数据</el-button>
      </el-menu-item>
      <el-menu-item>
        <el-button type="primary" @click="back_up" size="mini">备份数据</el-button>
      </el-menu-item>
      <el-menu-item>
        <el-button type="primary" @click="export_excel" size="mini">导出Excel</el-button>
      </el-menu-item>
    </el-menu>
    <!--        数据表格-->
    <el-table
        :data="tableDataSlice"
        border
        stripe
        class="table"
        height="calc(100vh - 220px)"
        style="width: 98%;margin: 20px auto 0;overflow-y: auto"
        @row-dblclick="handleclick">
      <el-table-column
          :formatter="idplus"
          align="center"
          label="ID"
          min-width="24"
          prop="id"
          sortable>
      </el-table-column>
      <el-table-column
          align="center"
          label="日期"
          prop="date"
          sortable
          width="110">
      </el-table-column>
      <el-table-column
          align="center"
          label="姓名"
          prop="name"
          :show-overflow-tooltip="true"
          width="80">
      </el-table-column>
      <el-table-column
          align="center"
          label="电话"
          :show-overflow-tooltip="true"
          prop="phone"
          width="120">
      </el-table-column>
      <el-table-column
          align="left"
          label="地址"
          prop="address"
          :show-overflow-tooltip="true"
          width="240">
      </el-table-column>
      <el-table-column
          align="left"
          label="病史体检，检验及诊断"
          :show-overflow-tooltip="true"
          prop="detail">
      </el-table-column>
      <el-table-column
          align="center"
          label="操作"
          width="80">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)">详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--        底部分页栏-->
    <el-pagination
        :page-size="page"
        :total="count_size()"
        background
        layout="prev, pager, next,jumper"
        style="margin-top: 15px"
        @current-change="load_data"
    >
    </el-pagination>
    <el-dialog
        :visible.sync="dialogVisible"
        align="left"
        class="dialog"
        title="详细信息"
    >
      <el-date-picker
          v-model="itemdata.date"
          class="in-input small"
          placeholder="选择日期"
          type="date"
          value-format="yyyy-MM-dd">
      </el-date-picker>
      <el-input v-model="itemdata.name" class="in-input small" placeholder="请输入内容">
        <template slot="prepend">姓名</template>
      </el-input>
      <el-select v-model="itemdata.sex" class="in-input small in" placeholder="请选择性别">
        <el-option label="男" value="男"></el-option>
        <el-option label="女" value="女"></el-option>
      </el-select>
      <el-input v-model="itemdata.age" class="in-input small in" placeholder="0">
        <template slot="prepend">年龄</template>
      </el-input>
      <el-input v-model="itemdata.illtime" class="in-input small" placeholder="请输入内容">
        <template slot="prepend">发病时间</template>
      </el-input>
      <el-input v-model="itemdata.phone" class="in-input small" placeholder="请输入内容">
        <template slot="prepend">电话</template>
      </el-input>
      <el-input v-model="itemdata.parent" class="in-input small" placeholder="请输入内容">
        <template slot="prepend">家属名称</template>
      </el-input>
      <el-input v-model="itemdata.work" class="in-input small" placeholder="请输入内容">
        <template slot="prepend">工作单位及职业</template>
      </el-input>
      <el-input v-model="itemdata.address" class="in-input" placeholder="请输入内容">
        <template slot="prepend">地址</template>
      </el-input>
      <el-input v-model="itemdata.detail" class="in-input" clearable placeholder="请输入内容">
        <template slot="prepend">病史体检，检验及诊断</template>
      </el-input>
      <el-autocomplete
          v-model="itemdata.solution"
          :fetch-suggestions="querySolution"
          class="in-input"
          placeholder="请输入"
          style="width: 100%">
        <template slot="prepend">治疗方案</template>
      </el-autocomplete>
      <el-input
          v-model="itemdata.addon"
          maxlength="200"
          placeholder="备注内容"
          rows="3"
          show-word-limit
          type="textarea"
      >
      </el-input>
      <el-input v-model="itemdata.money" class="in-input small" clearable placeholder="请输入内容">
        <template slot="prepend">收费及其他</template>
      </el-input>
      <el-autocomplete
          v-model="itemdata.doc"
          :fetch-suggestions="queryDoc"
          class="in-input small"
          placeholder="请输入">
        <template slot="prepend">医师</template>
      </el-autocomplete>
      <el-button style="margin-top: 10px" type="info" @click="edititem">修改条目</el-button>
      <el-button style="margin-top: 10px" type="primary" @click="copyitem">复制条目</el-button>
      <el-button style="margin-top: 10px" type="danger" @click="delitem">删除条目</el-button>
      <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
            </span>
    </el-dialog>
    <el-dialog
        :visible.sync="addvisible"
        align="left"
        class="dialog"
        title="添加条目"
    >
      <el-date-picker
          v-model="adddata.date"
          class="in-input small"
          placeholder="选择日期"
          type="date"
          value-format="yyyy-MM-dd">
      </el-date-picker>
      <el-input v-model="adddata.name" class="in-input small" placeholder="请输入内容">
        <template slot="prepend">姓名</template>
      </el-input>
      <el-select v-model="adddata.sex" class="in-input small in" placeholder="请选择性别">
        <el-option label="男" value="男"></el-option>
        <el-option label="女" value="女"></el-option>
      </el-select>
      <el-input v-model="adddata.age" class="in-input small in" placeholder="0">
        <template slot="prepend">年龄</template>
      </el-input>
      <el-input v-model="adddata.illtime" class="in-input small" placeholder="请输入内容">
        <template slot="prepend">发病时间</template>
      </el-input>
      <el-input v-model="adddata.phone" class="in-input small" placeholder="请输入内容">
        <template slot="prepend">电话</template>
      </el-input>
      <el-input v-model="adddata.parent" class="in-input small" placeholder="请输入内容">
        <template slot="prepend">家属名称</template>
      </el-input>
      <el-autocomplete
          v-model="adddata.work"
          :fetch-suggestions="queryWork"
          class="in-input"
          placeholder="请输入内容"
          style="width: 100%">
        <template slot="prepend">工作单位及职业</template>
      </el-autocomplete>
      <el-input v-model="adddata.address" class="in-input" clearable placeholder="请输入内容">
        <template slot="prepend">地址</template>
      </el-input>
      <el-input v-model="adddata.detail" class="in-input" clearable placeholder="请输入内容">
        <template slot="prepend">病史体检，检验及诊断</template>
      </el-input>
      <el-autocomplete
          v-model="adddata.solution"
          :fetch-suggestions="querySolution"
          class="in-input"
          placeholder="请输入"
          style="width: 100%">
        <template slot="prepend">治疗方案</template>
      </el-autocomplete>
      <el-input
          v-model="adddata.addon"
          clearable
          maxlength="200"
          placeholder="备注内容"
          rows="3"
          show-word-limit
          type="textarea"
      >
      </el-input>
      <el-autocomplete
          v-model="adddata.money"
          :fetch-suggestions="queryMoney"
          class="in-input small"
          placeholder="请输入内容">
        <template slot="prepend">收费及其他</template>
      </el-autocomplete>
      <el-autocomplete
          v-model="adddata.doc"
          :fetch-suggestions="queryDoc"
          class="in-input small"
          placeholder="请输入">
        <template slot="prepend">医师</template>
      </el-autocomplete>
      <el-button style="margin-top: 10px" type="success" @click="checkAdd">添加条目</el-button>
      <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="checkAdd">确定添加</el-button>
            </span>
    </el-dialog>
    <el-dialog :visible.sync="db_show" title="数据库信息">
      <p style="font-size: 20px">数据库条目数量: {{ db_info.count }}</p>
      <p style="font-size: 20px">数据库占用空间: {{ db_info.size }}KB</p>
      <p style="font-size: 20px">数据库路径: {{ db_info.path }}</p>
    </el-dialog>
  </div>
</template>

<script>
import fs from "fs";

const remote = require("electron").remote;
const app = require("electron").remote.app;
const shell = require("electron").shell;
const path = require("path");

import {getAppPath, getDBPath, getExportPath, readConfigExtra} from '../utils/config';
import * as xlsx from "node-xlsx";

const menuitem = remote.MenuItem;
const menu = remote.Menu; //全局的右键
const appPath = getAppPath();
export default {
  name: "Panel",
  data() {
    return {
      dialogVisible: false, //修改框可见
      addvisible: false, //添加框可见
      itemdata: {
        id: "",
        date: "",
        name: "",
        sex: "",
        age: "",
        illtime: "",
        phone: "",
        parent: "",
        work: "",
        address: "",
        detail: "",
        solution: "",
        addon: "",
        money: "",
        doc: "廖世利"
      },
      adddata: {
        date: "",
        name: "",
        sex: "",
        age: "",
        illtime: "",
        phone: "",
        parent: "",
        work: "",
        address: "",
        detail: "",
        solution: "",
        addon: "",
        money: "",
        doc: "廖世利"
      },
      searchby: '', //搜索方式
      worksuggestion: [
        {"value": "职工"},
        {"value": "学生"},
        {"value": "其他"},
      ],
      moneysuggestion: [
        {"value": "医保卡"},
        {"value": "现金"},
      ],
      docsuggestion: [
        {"value": "廖世利"},
        {"value": "专家"},
      ],
      solutionsuggestion: [
        {"value": "吊针"},
      ],
      checked: false, //
      tableData: [], //表格数据
      tableDataSlice: [],//分页数据
      page: 10,//分页大小
      searchname: "", //搜索的关键词
      repeat: false, //判断添加条目按钮抖动
      copyrepeat: false, //判断复制条目按钮抖动,
      menu1: null, //右键
      db_info: {},
      db_show: false
    }
  },
  watch: {
    searchname: function () {
      if (this.searchname.length >= 0) {
        setTimeout(() => {
          this.Adsearch();
        }, 1000);
      }
    }
  },
  mounted() {
    this.fresh();
    this.initMenu();
    this.readconfig();
    let that = this;
    // window.addEventListener('contextmenu', (e) => {
    //     e.preventDefault();
    //     that.menu1.popup({ window: remote.getCurrentWindow() });
    // }, false);
    window.oncontextmenu = function () {
      that.menu1.popup({window: remote.getCurrentWindow()});
      return false
    }
  },
  methods: {
    back() {
      this.$router.push("/");
    },
    count_size() {
      return this.tableData ? this.tableData.length : 1;
    },
    //配置文件
    async readconfig() {
      let that = this;
      const d = await readConfigExtra();
      that.worksuggestion = d.work;
      that.docsuggestion = d.doc;
      that.solutionsuggestion = d.solution;
      that.page = d.page;
    },
    fresh() {
      let that = this;
      this.$axios.get("/api/data").then(res => {
        if (res.data.data !== "bad") {
          try {
            that.tableData = res.data.data;
            this.$message("载入数据完成");
            this.load_data(1);
          } catch (e) {
            this.$message.error("数据转换错误");
          }
        }
      }).catch(() => {
        this.$message.error("数据请求错误");
      });
    },
    handleEdit(index, row) {
      let id = row.id;
      let that = this;
      this.$axios.get("/api/data", {params: {"id": id}}).then(res => {
        that.itemdata = res.data.data;
        that.dialogVisible = true;
      });
    },
    handleclick(row) {
      let id = row.id;
      let that = this;
      this.$axios.get("/api/data", {params: {"id": id}}).then(res => {
        console.log(id)
        that.itemdata = res.data.data;
        that.dialogVisible = true;
      });
    },
    queryWork(queryString, cb) {
      var results = this.worksuggestion;
      cb(results);
    },
    queryMoney(queryString, cb) {
      var results = this.moneysuggestion;
      cb(results);
    },
    queryDoc(queryString, cb) {
      var results = this.docsuggestion;
      cb(results);
    },
    querySolution(queryString, cb) {
      var results = this.solutionsuggestion;
      cb(results);
    },
    addItemDialog() {
      this.addvisible = true;
      this.repeat = false;
    },
    addItem() {
      let that = this;
      let data = that.adddata;
      this.adddata = {
        date: "",
        name: "",
        sex: "",
        age: "",
        illtime: "",
        phone: "",
        parent: "",
        work: "",
        address: "",
        detail: "",
        solution: "",
        addon: "",
        money: "",
        doc: "廖世利"
      };
      this.$axios.post("/api/add", data).then(res => {
        if (res.data.data === "ok") {
          that.$message("条目添加完成");
          this.repeat = true;
          setTimeout(() => {
            that.addvisible = false;
          }, 400);
          setTimeout(() => {
            that.fresh();
          }, 400);
        }
      }).catch(() => {
        that.$message.error("API请求错误");
        that.addvisible = false;
      })
    },
    checkAdd() {
      if (this.repeat) {
        this.$message.error("请勿重复提交");
      } else if (this.adddata.date !== "" && this.adddata.name !== "") {
        this.addItem();
      } else {
        this.$message.error("确保信息填写完整");
      }
    },
    delitem() {
      let that = this;
      let id = this.itemdata.id;
      this.$axios.post("/api/del?id=" + id).then(res => {
        if (res.data.data === "ok") {
          that.$message("条目删除完成");
          setTimeout(() => {
            that.dialogVisible = false;
          }, 400);
          setTimeout(() => {
            that.fresh();
          }, 400);
        } else {
          that.$message.error("条目删除失败");
        }
      }).catch(() => {
        that.$message.error("API请求错误");
      })
    },
    edititem() {
      let that = this;
      let data = that.itemdata;
      this.$axios.post("/api/edit", data).then(res => {
        if (res.data.data === "ok") {
          that.$message("条目修改完成");
          setTimeout(() => {
            that.dialogVisible = false;
          }, 400);
          setTimeout(() => {
            that.fresh();
          }, 400);
        }
      }).catch(() => {
        that.$message.error("API请求错误");
      })
    },
    copyitem() {
      let that = this;
      let data = that.itemdata;
      if (that.copyrepeat) {
        that.$message.error("请勿重复添加");
      } else {
        this.$axios.post("/api/add", data).then(res => {
          if (res.data.data === "ok") {
            that.$message("条目复制完成");
            this.copyrepeat = true;
            setTimeout(() => {
              that.dialogVisible = false;
              that.copyrepeat = false;
            }, 400);
            setTimeout(() => {
              that.fresh();
            }, 400);
          }
        }).catch(() => {
          that.$message.error("API请求错误");
          that.addvisible = false;
        });
      }
    },
    search(data) {
      let that = this;
      if (that.searchname === "") {
        that.$message.warning("搜索内容不能为空");
      } else {
        this.$axios.get("/api/se", {params: data}).then(res => {
          if (res.data.data === "bad") {
            that.$message.error("API请求错误");
          } else if (res.data.data.length <= 0) {
            this.$message("没有查询到相关数据");
          } else {
            that.tableData = res.data.data;
            //因为分片逻辑修改
            that.load_data(1);
            this.$message("载入数据完成");
          }
        });
      }
    },
    Adsearch() {
      //switch多种查找方式
      let searchby = this.searchby !== "" ? this.searchby : "name";
      if (searchby === "name") {
        this.search({"condition": "name", "data": this.searchname})
      } else if (searchby === "sex") {
        this.search({"condition": "sex", "data": this.searchname})
      } else if (searchby === "phone") {
        this.search({"condition": "phone", "data": this.searchname})
      } else if (searchby === "date") {
        this.search({"condition": "date", "data": this.searchname})
      }
    },
    initMenu() {
      let that = this;
      //菜单应该非全局建立
      that.menu1 = new menu();
      that.menu1.append(new menuitem({
        "label": "添加条目", click() {
          that.addItemDialog();
        }
      }));
      that.menu1.append(new menuitem({type: "separator"}));
      that.menu1.append(new menuitem({label: "剪切", role: "cut"}));
      that.menu1.append(new menuitem({label: "复制", role: "copy"}));
      that.menu1.append(new menuitem({label: "粘贴", role: "paste"}));
      that.menu1.append(new menuitem({label: "全选", role: "selectAll"}));
    },
    idplus(row, value, id) {
      // console.log(row,value,id);
      return "0000" + id;
    },
    dbinfo() {
      //数据库信息获取
      let that = this;
      try {
        that.$axios.get('/api/info').then(res => {
          that.db_info = res.data;
          that.db_show = true;
        });
      } catch (e) {
        that.$message.error("API请求错误");
      }
    },
    //分页
    load_data(e) {
      const page_now = e;
      const page = parseInt(this.page);
      const data = this.tableData.slice((page_now - 1) * page, page * page_now);
      this.tableDataSlice = data;
    },
    back_up() {
      // 调用api打开本地目录
      shell.showItemInFolder(getDBPath())
    },
    // 导出excel 异步函数直到完成
    export_excel() {
      // 国际化替换
      const headMap = {
        id: "id",
        date: "日期",
        time: "时间",
        name: "姓名",
        sex: "性别",
        age: "年龄",
        illtime: "发病日期",
        phone: "电话号码",
        parent: "家属",
        work: "工作",
        address: "家庭地址",
        detail: "具体信息",
        solution: "治疗方案",
        addon: "备注",
        money: "收费",
        doc: "医师"
      }
      const fileName = path.join(getExportPath(), "pigform_" +  new Date().getTime().toString() + ".xlsx");
      this.$axios.get("/api/data").then(res => {
        if (res.data.data !== "bad") {
          try {
            const data = res.data.data;
            if (data.length <= 0) {
              return;
            }
            const reformatData = function (d) {
              let dataList = [];
              dataList[0] = Object.keys(d[0]).map(x => {
                return headMap[x];
              });
              d.forEach(x => {
                let res = [];
                Object.values(x).forEach(val => {
                  res.push(val);
                })
                dataList.push(res);
              });
              return dataList;
            }
            const list = [
              {
                name: "sheet",
                data: reformatData(data),
              }
            ]
            const buffer = xlsx.build(list);
            fs.writeFile(fileName, buffer, err => {
              if (err){
                console.log(err);
                this.$message.error("表格导出失败" +  err.toString());
              } else {
                this.$message.success("表格导出至" +  fileName);
              }
            })
          } catch (e) {
            this.$message.error("数据转换错误" +  e.toString());
          }
        }
      }).catch(() => {
        this.$message.error("数据请求错误");
      });
    }
  }
}
</script>
<style>
html {
  height: 100vh;
}

body {
  height: 100vh;
}
</style>
<style scoped>
.panel {
  padding: .5rem 0;
  user-select: none;
}

.in-input {
  margin-bottom: 6px;
}

.in-input.small {
  width: 32%;
  margin-right: 1%;
}

.in-input.small.in {
  width: 16%;
}

.dialog /deep/ .el-dialog {
  width: 90%;
}

@media (max-width: 800px) {
  .dialog /deep/ .el-dialog {
    width: 96%;
  }
}

.el-menu-item {
  padding: 0 .4rem;
}
</style>