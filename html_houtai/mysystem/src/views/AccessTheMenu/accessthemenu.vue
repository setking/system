<template>
  <div>
    <div class="search_all">
      <div>
        <div class="search_listOne">
          <!-- <div class="filter-container">
                <el-button @click="unfold()" type="primary" plain>刷新</el-button>
          </div>-->
          <div class="filter-container" style="margin-left:1rem;">
            <el-button v-show="showAdd" @click="newFrom()" type="primary">新建</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 表格 -->
    <el-table
      :data="tableData.slice((currpage - 1) * pageSize, currpage * pageSize)"
      style="width: 100%;margin-bottom: 20px;"
      row-key="menuid"
      ref="tree"
      :tree-props="{children: 'childNodes', hasChildren: 'hasChildren'}"
    >
      <el-table-column v-if="showId" prop="menuid"></el-table-column>

      <!-- align="center" -->
      <el-table-column prop="menuName" label="菜单名称"></el-table-column>
      <el-table-column v-if="showId" prop="menuLevel"></el-table-column>
      <!-- <el-table-column
    align="center"
      prop="menuAddr" 
      label="地址">
      </el-table-column>-->
      <el-table-column align="center" prop="sortNum" label="排序"></el-table-column>
      <el-table-column align="center" label="类型">
        <template slot-scope="scope">
          <el-button id="myBtn" size="mini" v-if="scope.row.menuType == '0'" type="primary">菜单</el-button>
          <el-button id="myBtn1" size="mini" v-if="scope.row.menuType == '1'" type="warning">动作</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <el-button id="myBtn2" size="mini" v-if="scope.row.useStatus == '0'" type="success">可用</el-button>
          <el-button id="myBtn3" size="mini" v-if="scope.row.useStatus == '1'" type="info">禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="success"
            v-show="showAdd"
            plain
            size="small"
            @click="addeditList(scope.$index, scope.row)"
          >添加</el-button>
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
            plain
            size="small"
            @click="deletList(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
    background
      class="mare_pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currpage"
      :page-sizes="[10, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageTotal"
    ></el-pagination>
    <!-- 创建 -->
    <el-dialog title="配置权限" :visible.sync="dialogFormVisible">
      <el-form
        :model="ruleForm"
        :inline="true"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="名称:" prop="logName">
          <el-input style="width:20rem;" v-model="ruleForm.logName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="status">
          <template>
            <el-radio v-model="ruleForm.radio" label="0">作为菜单</el-radio>
            <el-radio v-model="ruleForm.radio" label="1">作为动作</el-radio>
          </template>
        </el-form-item>
      </el-form>
      <el-form
        :model="ruleForm"
        :inline="true"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="父级:" prop="fatherName">
          <el-select @change="selectGet" v-model="ruleForm.fatherName" filterable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.sortNum"
              :label="item.menuName"
              :value="item.menuid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="radio1">
          <template>
            <el-radio v-model="ruleForm.radio1" label="0">可用</el-radio>
            <el-radio v-model="ruleForm.radio1" label="1">禁用</el-radio>
          </template>
        </el-form-item>
      </el-form>
      <!-- <el-form :model="ruleForm" :inline="true" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="地址:" prop="menuAddr">
    <el-input style="width:20rem;" v-model="ruleForm.menuAddr" autocomplete="off"></el-input>
  </el-form-item>
      </el-form>-->
      <el-form
        :model="ruleForm"
        :inline="true"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="排序:" prop="sortList">
          <el-input
            onkeyup="value=value.replace(/[^\d]/g,'')"
            style="width:20rem;"
            v-model="ruleForm.sortList"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="是否隐藏" prop="radio2">
      <template>
        <el-radio v-model="ruleForm.radio2" label="0">显示</el-radio>
        <el-radio v-model="ruleForm.radio2" label="1">隐藏</el-radio> 
      </template>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">取 消</el-button>
        <el-button v-if="showMenu == 0" type="primary" @click="createForm('ruleForm')">确 定</el-button>
        <el-button v-if="showMenu == 1" type="primary" @click="updateMenu('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新建 -->
    <el-dialog title="添加权限" :visible.sync="createList">
      <el-form
        :model="ruleForm"
        :inline="true"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="名称:" prop="logName">
          <el-input style="width:20rem;" v-model="ruleForm.logName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="radio1">
          <template>
            <el-radio v-model="ruleForm.radio1" label="0">可用</el-radio>
            <el-radio v-model="ruleForm.radio1" label="1">禁用</el-radio>
          </template>
        </el-form-item>
      </el-form>
      <el-form
        :model="ruleForm"
        :inline="true"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="排序:" prop="sortList">
          <el-input
            onkeyup="value=value.replace(/[^\d]/g,'')"
            style="width:20rem;"
            v-model="ruleForm.sortList"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="是否隐藏" prop="radio2">
      <template>
        <el-radio v-model="ruleForm.radio2" label="0">显示</el-radio>
        <el-radio v-model="ruleForm.radio2" label="1">隐藏</el-radio> 
      </template>
        </el-form-item>-->
      </el-form>
      <!-- <el-form :model="ruleForm" :inline="true" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="地址:" prop="menuAddr">
    <el-input style="width:20rem;" v-model="ruleForm.menuAddr" autocomplete="off"></el-input>
  </el-form-item>
      </el-form>-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEditA">取 消</el-button>
        <el-button type="primary" @click="createNewFrom('ruleForm')">确 定</el-button>
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
import {
  menuList,
  addMenu,
  deletMenu,
  fatherList,
  menubyID,
  updateMenu
} from "../../config/api";
export default {
  data() {
    return {
      showColumn: "0",
      menulive: null,
      showEdit: true,
      showDelet: true,
      showAdd: true,
      menuid: "",
      showMenu: 0,
      showId: false,
      deletVisible: false, //删除对话框控件
      dialogFormVisible: false,
      createList: false,
      pageTotal: 1,
      pageSize: 10, //分页每页展示条数
      currpage: 1, //当前展示页码
      checkExpand: false,
      tableData: [],
      addLeval: null,
      menuKey: null,
      ruleForm: {
        logName: "",
        fatherName: "",
        sortList: "",
        radio: "0",
        radio1: "0",
        radio2: "0"
        // menuAddr: null,
      },
      rules: {
        logName: [{ required: true, message: "请输入名称", trigger: "blur" }],
        status: [{ required: true, message: "请输入密码", trigger: "blur" }],
        fatherName: [
          { required: true, message: "请输入父级名称", trigger: "blur" }
        ],
        radio1: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        sortList: [
          { required: true, message: "请输入排序号", trigger: "blur" }
        ],
        radio2: [{ required: true, message: "请输入标题", trigger: "blur" }]
      },
      options: [
        {
          sortNum: "1",
          menuName: "无数据", 
          menuid: 1
        }
      ]
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
      console.log("story数据", storyMenu);
      if (!storyMenu.includes('菜单设置-编辑')) {
        this.showEdit = false
      }
      if (!storyMenu.includes('菜单设置-删除')) {
        this.showDelet = false
      }
      if (!storyMenu.includes('菜单设置-添加')) {
        this.showAdd = false
      }
      if (!storyMenu.includes('菜单设置-新建')) {
        this.showAdd = false
      }  
      const CurrentList = {};
      CurrentList.start = this.currpage;
      CurrentList.pageSize = this.pageSize;
      menuList(CurrentList).then(res => {
        this.tableData = res.result;
        this.pageTotal = res.pageTotal;
        console.log(res);
      });
    },
    unfold() {
      this.initData();
    },
    //分页
    handleSizeChange(val) {
      const currSize = {};
      currSize.start = this.currpage;
      currSize.pageSize = val;
      menuList(currSize).then(res => {
        this.tableData = res.result;
      });
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      const currIndex = {};
      currIndex.start = val;
      currIndex.pageSize = this.pageSize;
      menuList(currIndex).then(res => {
        this.tableData = res.result;
      });
      console.log(`当前页: ${val}`);
    },

    //添加
    addeditList(index, row) {
      this.showMenu = 0;
      this.menulive = row.menuLevel;
      console.log("this.menulive", this.menulive);
      fatherList().then(res => {
        console.log("添加列表", res);
        // let opps = []
        // res.forEach(element => {
        // const ftList = {}
        // ftList.id = element.menuid
        // ftList.value = element.sortNum
        // ftList.label = element.menuName
        // ftList.menuLevel = element.menuLevel
        // ftList.menuKey = element.menuKey
        // opps.push(ftList)
        // });
        this.options = res;
      });
      this.dialogFormVisible = true;
    },
    selectGet(val) {
      let obj = this.options.find(item => {
        //这里的userList就是上面遍历的数据源
        if (item.menuid === val) { 
          this.addLeval = item.menuLevel;
          this.menukey = item.menuKey;
          console.log(item.menuKey);
        }
      });
    },
    newFrom() {
      this.createList = true;
    },
    //编辑
    editList(index, row) {
      this.menulive = row.menuLevel;
      this.showMenu = 1;
      fatherList().then(res => {
        this.options = res;
        // console.log("keyList",res)
      });
      this.menuid = row.menuid;
      const menuIdList = {};
      menuIdList.uid = row.menuid;
      menubyID(menuIdList).then(res => {
        for (let key = 0; key < this.options.length; key++) {
                  
          if (this.options[key].menuName == res.menuName) {
            this.menukey = this.options[key].menuKey
            // console.log('列表menukey',this.options[key].menuKey)
            // console.log('匹配的值',this.options[key].menuName)
          } else if (this.options[key].menuName == res.parentName) {
            this.menukey = this.options[key].menuKey
            // console.log('列表menukey',this.options[key].menuKey)
            // console.log('匹配的值',this.options[key].menuName)
          }
        } 
        console.log("编辑", res);
        this.ruleForm.logName = res.menuName;
        this.ruleForm.radio = res.menuType;
        this.ruleForm.fatherName = res.menuParentid;
        // this.menukey = res.menuKey;
        this.ruleForm.radio1 = res.useStatus;
        this.ruleForm.sortList = res.sortNum;
        this.ruleForm.radio2 = res.isHidden;
      });
      this.dialogFormVisible = true;
    },
    deletList(index, row) {
      this.deletTable = row;
      this.deletVisible = true;
    },
    deletRole() {
      const deletData = {};
      deletData.uid = this.deletTable.menuid;
      deletMenu(deletData).then(res => {
        this.initData();
        console.log(res);
      });
      this.deletVisible = false;
    },
    //添加确定
    createForm() {
      if (this.ruleForm.logName == "" || this.ruleForm.fatherName == "") {
        this.$message({
          message: "标星号的不能为空",
          type: "warning"
        });
      } else {
        const menuData = {};
        menuData.menuLevel = String(parseInt(this.addLeval) + 1);
        menuData.menuAddr = "";
        menuData.menuName = this.ruleForm.logName;
        menuData.menuType = this.ruleForm.radio;
        menuData.menuParentid = this.ruleForm.fatherName;
        menuData.useStatus = this.ruleForm.radio1;
        menuData.sortNum = this.ruleForm.sortList;
        menuData.isHidden = this.ruleForm.radio2;
        // menuData.menuAddr = this.ruleForm.menuAddr
        menuData.menuKey = this.menukey;
        addMenu(menuData)
          .then(res => {
            this.ruleForm.logName = "";
            this.ruleForm.fatherName = "";
            this.ruleForm.sortList = "";
            this.showColumn = this.ruleForm.radio2;
            this.initData();
            this.dialogFormVisible = false;
          })
          .catch(res => {
            this.$message.error("网络错误，创建失败!");
          });
      }
    },
    createNewFrom() {
      if (this.ruleForm.logName == "" || this.ruleForm.sortList == "") {
        this.$message({
          message: "标星号的不能为空",
          type: "warning"
        });
      } else {
        const menuData = {};
        menuData.menuName = this.ruleForm.logName;
        menuData.menuAddr = "";
        menuData.menuKey = "0";
        menuData.menuLevel = "0";
        menuData.menuType = "0";
        menuData.menuParentid = "0";
        menuData.useStatus = this.ruleForm.radio1;
        menuData.sortNum = this.ruleForm.sortList;
        menuData.isHidden = this.ruleForm.radio2;
        addMenu(menuData)
          .then(res => {
            this.ruleForm.logName = "";
            this.ruleForm.fatherName = "";
            this.ruleForm.sortList = "";
            this.showColumn = this.ruleForm.radio2;
            this.initData();
            this.createList = false;
          })
          .catch(res => {
            this.$message.error("网络错误，创建失败!");
          });
      }
    },
    //编辑确定
    updateMenu() {
      if (this.ruleForm.logName == "" || this.ruleForm.fatherName == "") {
        this.$message({
          message: "标星号的不能为空",
          type: "warning"
        });
      } else {
        const menuData = {};

        menuData.menuKey = this.menukey;
        menuData.menuLevel = this.menulive;
        menuData.menuid = this.menuid;
        menuData.menuName = this.ruleForm.logName;
        menuData.menuType = this.ruleForm.radio;
        menuData.menuParentid = this.ruleForm.fatherName;
        menuData.useStatus = this.ruleForm.radio1;
        menuData.sortNum = this.ruleForm.sortList;
        menuData.isHidden = this.ruleForm.radio2;
        console.log("menuData.menuKey", menuData);
        updateMenu(menuData)
          .then(res => {
            console.log(res);
            this.ruleForm.logName = "";
            this.ruleForm.fatherName = "";
            this.ruleForm.sortList = "";
            this.showColumn = this.ruleForm.radio2;
            this.initData();
            this.dialogFormVisible = false;
          })
          .catch(res => {
            this.$message.error("网络错误，创建失败!");
          });
      }
    },
    cancelEdit() {
      this.ruleForm.logName = "";
      this.ruleForm.fatherName = "";
      this.ruleForm.sortList = "";
      this.dialogFormVisible = false;
    },
    cancelEditA() {
      this.ruleForm.logName = "";
      this.ruleForm.fatherName = "";
      this.ruleForm.sortList = "";
      this.createList = false;
    }
  }
};
</script>
<style scoped>
.search_listOne {
  margin-top: 2rem;
  margin-bottom: 2rem;
  width: 100%;
  display: flex;
}
.mare_pagination {
  float: right;
}


#myBtn{
color: #409EFF;
background-color: #ecf5ff;
border-color: #b3d8ff;
}
#myBtn1{
color: #FFF;
background-color: #E6A23C;
border-color: #E6A23C;
}
#myBtn2{
color: #FFF;
background-color: #67C23A;
border-color: #67C23A;
}
#myBtn3{
color: #FFF;
background-color: #909399;
border-color: #909399;
}
</style>