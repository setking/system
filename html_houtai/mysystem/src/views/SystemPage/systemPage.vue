<template>
  <div>
    <!-- 查询 -->
    <div class="search_all">
      <div>
        <div class="search_listOne">
          <div class="filter-container">
            用户名:
            <el-input
              v-model="formData.backNickName"
              placeholder="请输入用户名"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="search(formData)"
            />
          </div>
          <div class="filter-container">
            真实姓名:
            <el-input
              v-model="formData.backRealName"
              placeholder="请输入真实姓名"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="search(formData)"
            />
          </div>
          <div class="filter-container">
            手机:
            <el-input
              v-model="formData.backMobile"
              placeholder="请输入手机号"
              style="width: 200px;"
              class="filter-item"
              oninput="value=value.replace(/[^\d]/g,'')"
              maxlength="11"
            />
          </div>
          <div class="filter-container">
            角色:
            <el-input
              v-model="formData.roleName"
              placeholder="请输入角色名"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="search(formData)"
            />
          </div>
          <div class="filter-container">
            状态:
            <el-select v-model="formData.value" placeholder="全部状态">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="filter-container">
            <el-button
              v-waves
              class="filter-item search_items"
              type="primary"
              @click="search(formData)"
            >查询</el-button>
          </div>
        </div>
        <div class="search_listOne">
          <!-- <div class="filter-container">
            <el-button @click="resetData()" type="primary">刷新</el-button>
          </div>-->
          <div class="filter-container">
            <el-button v-show="showAdd" @click="newFrom()" type="primary">新建</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 列表 -->
    <el-table
      id="out-table"
      v-loading="listLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      ref="filterTable"
      :data="tableList"
      style="width: 100%"
    >
      <el-table-column v-if="showId" prop="backid"></el-table-column>
      <el-table-column align="center" prop="backNickName" label="用户名"></el-table-column>
      <el-table-column align="center" prop="backRealName" label="真实姓名"></el-table-column>
      <el-table-column align="center" prop="backMobile" label="手机" width="180"></el-table-column>
      <el-table-column align="center" prop="roleName" label="角色" width="180"></el-table-column>
      <el-table-column v-if="showId" align="center" prop="loginCount" label="登录次数"></el-table-column>
      <el-table-column v-if="showId" align="center" prop="lastLoginTime" label="最后登陆时间"></el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <el-button id="myBtn2" size="mini" v-if="scope.row.useStatus == '0'" type="success">可用</el-button>
          <el-button id="myBtn3" size="mini" v-if="scope.row.useStatus == '1'" type="info">禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope" style="display: flex;">
          <el-button
            type="primary"
            v-show="showEdit"
            plain
            size="small"
            @click="editList(scope.$index, scope.row)"
          >修改</el-button>
          <el-button
            type="danger"
            v-show="showDelet"
            v-if="scope.row.backNickName !== 'admin'"
            plain
            :disabled="disableButton"
            size="small"
            @click="deletList(scope.$index, scope.row)"
          >删除</el-button>
          <el-button
            type="danger"
            v-if="scope.row.backNickName === 'admin'"
            plain
            class="deletBTN"
            :disabled="disableButton"
            size="small"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      class="celent_pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currpage"
      :page-sizes="[10, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageTotal"
    ></el-pagination>
    <!-- 创建 -->
    <el-dialog title="管理员设置" :visible.sync="dialogFormVisible">
      <el-form
        :model="ruleForm"
        :inline="true"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="登录用户名:" prop="logName">
          <el-input style="width:20rem;" v-model="ruleForm.logName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录密码:" prop="logPassword">
          <el-input
            style="width:20rem;"
            type="password"
            v-model="ruleForm.logPassword"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-form
        :model="ruleForm"
        :inline="true"
        status-icon
        :rules="rulesName"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="真实姓名:" prop="realName">
          <el-input style="width:20rem;" v-model="ruleForm.realName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="backMobile">
          <el-input
            @keyup.native="number"
            style="width:20rem;"
            v-model="ruleForm.backMobile"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-form
        :model="ruleForm"
        :inline="true"
        status-icon
        :rules="rulesList"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色" prop="role">
          <el-select v-model="ruleForm.value1" multiple placeholder="请选择">
            <el-option
              v-for="item in selectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
          <p style="color: #d3d3d3;">可多选角色权限将合并</p>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <template>
            <el-radio v-model="ruleForm.radio" label="0">可用</el-radio>
            <el-radio v-model="ruleForm.radio" label="1">禁用</el-radio>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editCancel">取 消</el-button>

        <el-button v-if="showMenu == 0" type="primary" @click="createForm('ruleForm')">确 定</el-button>
        <el-button v-if="showMenu == 1" type="primary" @click="editForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 删除提示 -->
    <el-dialog title="提示" :visible.sync="deletVisible" width="30%">
      <span>您确定要删除这条信息吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deletVisible = false">取 消</el-button>
        <el-button type="primary" @click="deletRole()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FileSave from "file-saver";
import XLSX from "xlsx";
import {
  mangeList,
  roleList,
  deletMangeList,
  createMange,
  onlyMange,
  editMange
} from "../../config/api";
import { setTimeout } from "timers";
export default {
  data() {
    return {
      userName: null,
      disableButton: false,
      showEdit: true,
      showDelet: true,
      showAdd: true,
      showId: false,
      showMenu: 0,
      pageTotal: 1,
      deletVisible: false, //删除对话框控件
      dialogFormVisible: false,
      dialogVisible: false, //编辑信息显示隐藏
      addVisible: false, //增加信息显示隐藏
      listLoading: false, //加载效果显示隐藏
      selectTable: {}, //编辑信息显
      deletTable: {}, //删除的列表信息
      addTable: {}, //增加信息
      pageSize: 10, //分页每页展示条数
      currpage: 1, //当前展示页码
      trastArr: [],
      roleList: [],
      roleID: {},
      formData: {
        //表单查询
        backNickName: "",
        backRealName: "",
        backMobile: "",
        roleName: "",
        value: ""
      },
      ruleForm: {
        logName: "",
        logPassword: "",
        realName: "",
        backMobile: "",
        value1: [],
        radio: "1"
      },
      rules: {
        logName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        logPassword: [
          { required: true, message: "请输入密码", trigger: "blur" }
        ]
      },
      rulesName: {
        realName: [
          { required: true, message: "请输入真实名称", trigger: "blur" }
        ],
        backMobile: [
          { required: true, message: "请输入手机号", trigger: "blur" }
        ]
      },
      rulesList: {
        role: [{ required: true, message: "请选择角色", trigger: "blur" }],
        status: [{ required: true, message: "请输入标题", trigger: "blur" }]
      },
      formLabelWidth: "120px",
      tableList: [], //数据存储数组
      tableData: [],
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: 0,
          label: "可用"
        },
        {
          value: 1,
          label: "禁用"
        }
      ],
      selectOptions: [],
      value6: ""
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      let storyList = [];
      storyList = sessionStorage.getItem("menuName");
      let storyMenu = storyList.split(",");
      if (!storyMenu.includes("系统管理-编辑")) {
        this.showEdit = false;
      }
      if (!storyMenu.includes("系统管理-删除")) {
        this.showDelet = false;
      }
      if (!storyMenu.includes("系统管理-新建")) {
        this.showAdd = false;
      }
      const CurrentList = {};
      CurrentList.start = this.currpage;
      CurrentList.pageSize = this.pageSize;
      mangeList(CurrentList).then(res => {
        console.log(res);
        this.tableList = res.result;
        this.pageTotal = res.pageTotal;
        this.userName = sessionStorage.getItem("userName");
        if (this.userName === "admin") {
          this.disableButton = false;
        } else {
          this.disableButton = true;
        }
      });
    },
    addList() {
      this.tableList.push(this.addTable);
      this.addVisible = false;
    },
    //计数器
    handleChange(value) {
      console.log(value);
    },
    //确定
    updateShop() {
      this.dialogVisible = false;
    },
    //分页
    handleSizeChange(val) {
      const currSize = {};
      currSize.start = this.currpage;
      currSize.pageSize = val;
      if (this.formData.backNickName !== "") {
        currSize.backNickName = this.formData.backNickName;
      }
      if (this.formData.backRealName !== "") {
        currSize.backRealName = this.formData.backRealName;
      }
      if (this.formData.backMobile !== "") {
        currSize.backMobile = this.formData.backMobile;
      }
      if (this.formData.roleName !== "") {
        currSize.roleName = this.formData.roleName;
      }
      if (this.formData.value !== "") {
        currSize.useStatus = this.formData.value;
      }
      mangeList(currSize).then(res => {
        this.tableList = res.result;
      });
      this.pageSize = val;
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      const currIndex = {};
      currIndex.start = val;
      currIndex.pageSize = this.pageSize;
      if (this.formData.backNickName !== "") {
        currIndex.backNickName = this.formData.backNickName;
      }
      if (this.formData.backRealName !== "") {
        currIndex.backRealName = this.formData.backRealName;
      }
      if (this.formData.backMobile !== "") {
        currIndex.backMobile = this.formData.backMobile;
      }
      if (this.formData.roleName !== "") {
        currIndex.roleName = this.formData.roleName;
      }
      if (this.formData.value !== "") {
        currIndex.useStatus = this.formData.value;
      }
      mangeList(currIndex).then(res => {
        this.tableList = res.result;
      });
      this.currpage = val;
      console.log(`当前页: ${val}`);
    },
    //查询
    search() {
      const searchCount = {};
      const searchData = this.formData;
      searchCount.start = "1";
      searchCount.pageSize = this.pageSize;

      if (this.formData.backNickName !== "") {
        searchCount.backNickName = this.formData.backNickName;
      }
      if (this.formData.backRealName !== "") {
        searchCount.backRealName = this.formData.backRealName;
      }
      if (this.formData.backMobile !== "") {
        searchCount.backMobile = this.formData.backMobile;
      }
      if (this.formData.roleName !== "") {
        searchCount.roleName = this.formData.roleName;
      }
      if (this.formData.value !== "") {
        searchCount.useStatus = this.formData.value;
      }
      mangeList(searchCount).then(res => {
        this.tableList = res.result;
        this.pageTotal = res.pageTotal;
        this.currpage = 1;
      });
      console.log(searchData);
      this.listLoading = true;
      this.listLoading = false;
    },
    resetData() {
      this.listLoading = true;
      this.initData();
      this.listLoading = false;
    },
    newFrom() {
      this.showMenu = 0;
      roleList().then(res => {
        console.log(res);
        let seletRole = [];
        for (var i = 0; i < res.length; i++) {
          const roleData = {};
          roleData.label = res[i].roleName;
          roleData.value = i;
          roleData.id = res[i].roleid;
          seletRole.push(roleData);
        }
        this.selectOptions = seletRole;
        console.log(seletRole);
      });
      this.dialogFormVisible = true;
    },
    //删除角色
    deletList(index, row) {
      this.deletTable = row;
      this.deletVisible = true;
    },
    deletRole() {
      const deletData = {};
      deletData.uid = this.deletTable.backid;
      console.log(this.deletTable.backNickName);
      if (this.deletTable.backNickName) {
      }
      deletMangeList(deletData).then(res => {
        this.initData();
        console.log(res);
      });
      this.deletVisible = false;
    },
    //新建角色
    createForm() {
      const TreeList = {};
      // this.ruleForm.value1
      if (
        this.ruleForm.logName === "" ||
        this.ruleForm.logPassword === "" ||
        this.ruleForm.realName === "" ||
        this.ruleForm.value1 === []
      ) {
        this.$message({
          message: "标星号的不能为空",
          type: "warning"
        });
      } else if (!/^1[34578]\d{9}$/.test(this.ruleForm.backMobile)) {
        this.$message({
          message: "手机号格式不对",
          type: "warning"
        });
      } else {
        let rolueList = {};
        for (let j = 0; j < this.ruleForm.value1.length; j++) {
          rolueList += this.ruleForm.value1[j] + "-";
        }
        if (JSON.stringify(rolueList) !== "{}") {
          TreeList.menuid = rolueList.substring(15, rolueList.length - 1);
        }

        const uploadRule = {};
        uploadRule.roleid = TreeList.menuid;
        uploadRule.backNickName = this.ruleForm.logName;
        uploadRule.backRealName = this.ruleForm.realName;
        uploadRule.backMobile = this.ruleForm.backMobile;
        uploadRule.useStatus = this.ruleForm.radio;
        uploadRule.backPassword = this.ruleForm.logPassword;
        if (uploadRule.roleid == undefined) {
          this.$message.error("您有未填项");
        } else {
          createMange(uploadRule)
            .then(res => {
              console.log(res);
              this.ruleForm.logName = "";
              this.ruleForm.logPassword = "";
              this.ruleForm.realName = "";
              this.ruleForm.backMobile = "";
              this.ruleForm.value1 = [];
              this.ruleForm.radio = "0";
              this.dialogFormVisible = false;
              this.initData();
            })
            .catch(res => {
              this.$message.error("网络错误，创建失败!");
            });
        }
      }
    },

    editCancel() {
      this.ruleForm.logName = "";
      this.ruleForm.logPassword = "";
      this.ruleForm.realName = "";
      this.ruleForm.backMobile = "";
      this.ruleForm.value1 = [];
      this.ruleForm.radio = "0";
      this.dialogFormVisible = false;
    },
    // 编辑角色
    editList(index, row) {
      this.showMenu = 1;
      this.roleID.uid = row.backid;
      onlyMange(this.roleID).then(res => {
        console.log(res.roleName);
        if (res.roleName) {
          let newRoleName = JSON.parse(res.roleName);
          let roleArr = [];
          for (let key in newRoleName) {
            const roleListData = {};
            roleListData.id = key;
            roleListData.label = newRoleName[key];
            roleArr.push(roleListData);
            console.log(roleListData);
          }
          this.roleList = roleArr;
        }
        roleList().then(res => {
          console.log(res);
          let seletRole = [];
          for (var i = 0; i < res.length; i++) {
            const roleData = {};
            roleData.label = res[i].roleName;
            roleData.value = i;
            roleData.id = res[i].roleid;
            seletRole.push(roleData);
          }
          this.selectOptions = seletRole;
        });
        if (this.roleList) {
          for (let m = 0; m < this.roleList.length; m++) {
            console.log(this.roleList[m].label);
            this.ruleForm.value1.push(this.roleList[m].label);
          }
        }
        this.ruleForm.logName = res.backNickName;
        this.ruleForm.realName = res.backRealName;
        this.ruleForm.backMobile = res.backMobile;
        this.ruleForm.radio = res.useStatus;
        this.ruleForm.logPassword = res.backPassword;
        console.log(this.ruleForm);
      });
      this.dialogFormVisible = true;
    },
    editForm() {
      const editFrom = {};
      let newLabel = [];
      let newData = [];
      for (let t = 0; t < this.ruleForm.value1.length; t++) {
        for (let b = 0; b < this.roleList.length; b++) {
          newLabel.push(this.roleList[b].label);
          if (this.roleList[b].label == this.ruleForm.value1[t]) {
            console.log(this.roleList[b].id);
            newData.push(this.roleList[b].id);
          } else if (this.ruleForm.value1[t] !== this.roleList[b].label) {
            console.log(this.ruleForm.value1[t]);
          }
        }
      }
      const newArr = this.ruleForm.value1.filter(
        item => !newLabel.includes(item)
      );
      let listData = newArr.concat(newData);
      let TreeList = {};
      for (let d = 0; d < listData.length; d++) {
        TreeList += listData[d] + "-";
      }
      editFrom.roleid = TreeList.substring(15, TreeList.length - 1);
      editFrom.backNickName = this.ruleForm.logName;
      editFrom.backRealName = this.ruleForm.realName;
      editFrom.backMobile = this.ruleForm.backMobile;
      editFrom.backPassword = this.ruleForm.logPassword;
      editFrom.useStatus = this.ruleForm.radio;
      editFrom.backid = this.roleID.uid;
      // if (editFrom.roleid == undefined) {
      //   this.$message.error('您有未填项');
      // }
      if (
        this.ruleForm.logName === "" ||
        this.ruleForm.logPassword === "" ||
        this.ruleForm.realName === "" ||
        this.ruleForm.value1 === []
      ) {
        this.$message.error("您有未填项");
      } else if (!/^1[34578]\d{9}$/.test(this.ruleForm.backMobile)) {
        this.$message({
          message: "手机号格式不对",
          type: "warning"
        });
      } else {
        editMange(editFrom).then(res => {
          this.ruleForm.logName = "";
          this.ruleForm.logPassword = "";
          this.ruleForm.realName = "";
          this.ruleForm.backMobile = "";
          this.ruleForm.value1 = [];
          this.ruleForm.radio = "0";
          this.initData();
          this.dialogFormVisible = false;
        });
      }
      console.log(editFrom);
    },
    number() {
      this.ruleForm.backMobile = this.ruleForm.backMobile.replace(
        /[^\.\d]/g,
        ""
      );
      this.ruleForm.backMobile = this.ruleForm.backMobile.replace(".", "");
    }
  }
};
</script>
<style scoped>
#out-table {
  margin-top: 30px;
}
.filter-container {
  margin-top: 20px;
  margin-left: 1rem;
}
.search_listOne {
  width: 100%;
  display: flex;
}

.deletBTN {
  visibility: hidden;
}
#myBtn2 {
  color: #fff;
  background-color: #67c23a;
  border-color: #67c23a;
}
#myBtn3 {
  color: #fff;
  background-color: #909399;
  border-color: #909399;
}
</style>

