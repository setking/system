<template>
  <div>
    <!-- 查询 -->
    <div class="search_all">
      <div>
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
      <el-table-column v-if="showRole" prop="roleid"></el-table-column>
      <el-table-column align="center" prop="roleName" label="角色名称"></el-table-column>
      <el-table-column align="center" prop="remark" label="备注"></el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <el-button id="myBtn2" size="mini" v-if="scope.row.useStatus == '0'" type="success">可用</el-button>
          <el-button id="myBtn3" size="mini" v-if="scope.row.useStatus == '1'" type="info">禁用</el-button>
        </template> 
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
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
    <el-dialog title="角色管理" :visible.sync="dialogFormVisible">
      <div class="dialogList">
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="角色名称:" prop="roleName">
            <el-input
              style="width:20rem;"
              placeholder="角色名称，不可重复"
              v-model="ruleForm.roleName"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注:" prop="remark">
            <el-input style="width:20rem;" v-model="ruleForm.remark" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <template>
              <el-radio v-model="ruleForm.radio" label="0">可用</el-radio>
              <el-radio v-model="ruleForm.radio" label="1">禁用</el-radio>
            </template>
          </el-form-item>
        </el-form>
        <div>
          <div>
            <el-button @click="expandAll()" size="mini">全部展开</el-button>
            <el-button @click="closeAll" size="mini">全部收缩</el-button>
            <el-button @click="setCheckedKeys" size="mini">全选</el-button>
            <el-button @click="resetChecked" size="mini">取消</el-button>
          </div>
          <el-tree
            class="elTree"
            :data="roleData"
            show-checkbox
            node-key="menuid"
            ref="tree"
            highlight-current
            :props="defaultProps"
          ></el-tree>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="createForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog title="角色管理" :visible.sync="editFormVisible">
      <div class="dialogList">
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="角色名称:" prop="roleName">
            <el-input
              style="width:20rem;"
              placeholder="角色名称，不可重复"
              v-model="ruleForm.roleName"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注:" prop="remark">
            <el-input style="width:20rem;" v-model="ruleForm.remark" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <template>
              <el-radio v-model="ruleForm.radio" label="0">可用</el-radio>
              <el-radio v-model="ruleForm.radio" label="1">禁用</el-radio>
            </template>
          </el-form-item>
        </el-form>
        <div class="rightTree">
          <div>
            <el-button @click="expandAll()" size="mini">全部展开</el-button>
            <el-button @click="closeAll" size="mini">全部收缩</el-button>
            <el-button @click="setCheckedKeysL" size="mini">全选</el-button>
            <el-button @click="resetChecked" size="mini">取消</el-button>
          </div>
          <el-tree
            class="elTree selectelTree"
            :data="roleTree"
            show-checkbox
            node-key="menuid"
            ref="tree"
            highlight-current
            :default-checked-keys="chekkList"
            :props="defaultTree"
          ></el-tree>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">取 消</el-button>
        <el-button type="primary" @click="editForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 删除提示 -->
    <el-dialog title="提示" :visible.sync="deletVisible" width="30%">
      <span>您确定要删除这条信息吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deletVisible= false">取 消</el-button>
        <el-button type="primary" @click="deletRole()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FileSave from "file-saver";
import XLSX from "xlsx";
import {
  roleData,
  roleList,
  deletRole,
  menuList,
  createRole,
  getRoleId,
  editRole
} from "../../config/api";
export default {
  inject: ["reload"],
  data() {
    return {
      showEdit: true,
      showDelet: true,
      showAdd: true,
      editFormVisible: false,
      showRole: false,
      pageTotal: 1,
      deletVisible: false, //删除对话框控件
      dialogFormVisible: false,
      dialogVisible: false, //编辑信息显示隐藏
      deletTable: {}, //删除的列表信息
      addVisible: false, //增加信息显示隐藏
      listLoading: false, //加载效果显示隐藏
      selectTable: {}, //编辑信息显
      addTable: {}, //增加信息
      pageSize: 10, //分页每页展示条数
      currpage: 1, //当前展示页码
      chekkList: [], //select选中状态
      roleID: {},
      formData: {
        //表单查询
        backNickName: "",
        backRealName: "",
        value: ""
      },
      ruleForm: {
        roleName: "",
        remark: "",
        radio: "0"
      },
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ]
      },
      formLabelWidth: "120px",
      tableList: [], //数据存储数组
      tableData: [],
      options: [
        {
          value: 0,
          label: "可用"
        },
        {
          value: 1,
          label: "禁用"
        }
      ],
      value6: "",
      roleTree: [],
      roleData: [],
      defaultProps: {
        children: "childNodes",
        label: "menuName",
        id: "menuid"
      },
      defaultTree: {
        children: "childNodes",
        label: "menuName",
        id: "menuid"
      }
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
      if (!storyMenu.includes("角色列表-编辑")) {
        // this.showEdit = false
      }
      if (!storyMenu.includes("角色列表-删除")) {
        this.showDelet = false;
      }
      if (!storyMenu.includes("角色列表-新建")) {
        // this.showAdd = false
      }
      const CurrentList = {};
      CurrentList.start = this.currpage;
      CurrentList.pageSize = this.pageSize;
      roleData(CurrentList).then(res => {
        console.log(res);
        this.tableList = res.result;
        this.pageTotal = res.pageTotal;
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
      roleData(currSize).then(res => {
        this.tableList = res.result;
      });
      this.pageSize = val;
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      const currIndex = {};
      currIndex.start = val;
      currIndex.pageSize = this.pageSize;
      roleData(currIndex).then(res => {
        console.log(res);
        this.tableList = res.result;
      });
      this.currpage = val;
      console.log(`当前页: ${val}`);
    },
    resetData() {
      this.listLoading = true;
      this.initData();
      this.listLoading = false;
    },
    newFrom() {
      const CurrentList = {};
      CurrentList.start = "1";
      CurrentList.pageSize = "999";
      menuList(CurrentList).then(res => {
        console.log("tree", res);
        this.roleData = res.result;
      });
      this.dialogFormVisible = true;
    },
    // getCheck(ckArr) {
    //   let checkData = []
    //   for (let item in  ckArr){
    //     if (ckArr[item].checked) {
    //       checkData.push(JSON.parse(ckArr[item].menuid))
    //     }
    //     if (ckArr[item].childNodes) {
    //       for (let args in ckArr[item].childNodes) {
    //         console.log(ckArr[item].childNodes[args])
    //         // if (args.checked) {
    //         //   checkData.push(JSON.parse(args.menuid))
    //         // }
    //       }
    //     }
    //   }
    //   return checkData
    // },
    // 编辑角色
    editList(index, row) {
      this.roleID.uid = row.roleid;
      getRoleId(this.roleID).then(res => {
        this.ruleForm.roleName = res.roleInfo.roleName;
        this.ruleForm.radio = res.roleInfo.useStatus;
        this.ruleForm.remark = res.roleInfo.remark;
        this.roleTree = res.treeNodes;
        // this.$options.methods.getCheck(this.roleTree)
        // console.log(this.$options.methods.getCheck(this.roleTree))
        // this.chekkList = this.$options.methods.getCheck(this.roleTree)
        // select选中状态
        for (let r = 0; r < this.roleTree.length; r++) {
          console.log(this.roleTree[r]);
          if (this.roleTree[r].childNodes && this.roleTree[r].checked) {
            for (let d = 0; d < this.roleTree[r].childNodes.length; d++) {
              if (
                this.roleTree[r].childNodes[d].childNodes &&
                this.roleTree[r].childNodes[d].checked
              ) {
                for (
                  let u = 0;
                  u < this.roleTree[r].childNodes[d].childNodes.length;
                  u++
                ) {
                  if (this.roleTree[r].childNodes[d].childNodes[u].checked) {
                    this.chekkList.push(
                      JSON.parse(
                        this.roleTree[r].childNodes[d].childNodes[u].menuid
                      )
                    );
                  }
                }
              } else if (this.roleTree[r].childNodes[d].checked) {
                this.chekkList.push(
                  JSON.parse(this.roleTree[r].childNodes[d].menuid)
                );
                console.log(JSON.parse(this.roleTree[r].childNodes[d].menuid));
              }
            }
          } else if (this.roleTree[r].checked) {
            this.chekkList.push(JSON.parse(this.roleTree[r].menuid));
          } else if (
            !this.roleTree[r].childNodes &&
            !this.roleTree[r].checked
          ) {
            this.chekkList = [];
          }
        }
      });
      this.editFormVisible = true;
    },
    editForm() {
      const editFrom = {};
      let selectNode = this.$refs.tree.getCheckedNodes();
      let arr = [];
      selectNode.forEach(item => {
        arr.push(item.menuid);
      });
      editFrom.roleName = this.ruleForm.roleName;
      editFrom.useStatus = this.ruleForm.radio;
      editFrom.remark = this.ruleForm.remark;
      editFrom.roleid = this.roleID.uid;
      let TreeList = {};
      for (let d = 0; d < arr.length; d++) {
        TreeList += arr[d] + "-";
      }
      if (JSON.stringify(TreeList) !== "{}") {
        editFrom.menuid = TreeList.substring(15, TreeList.length - 1);
      }
      if (this.ruleForm.roleName == "") {
        this.$message.error("角色名称不能为空");
      } else {
        console.log(editFrom.menuid);
        editRole(editFrom).then(res => {
          this.ruleForm.roleName = "";
          this.ruleForm.radio = "0";
          this.ruleForm.remark = "";
          this.roleData = [];
          this.initData();
          this.editFormVisible = false;
        });
      }
    },
    //删除角色
    deletList(index, row) {
      this.deletTable = row;
      this.deletVisible = true;
    },
    deletRole() {
      const deletData = {};
      deletData.id = this.deletTable.roleid;
      deletRole(deletData).then(res => {
        this.initData();
        console.log(res);
      });
      this.deletVisible = false;
    },
    createForm() {
      const addFrom = {};
      let selectNode = this.$refs.tree.getCheckedNodes();
      let arr = [];
      selectNode.forEach(item => {
        arr.push(item.menuid);
      });
      addFrom.roleName = this.ruleForm.roleName;
      addFrom.useStatus = this.ruleForm.radio;
      addFrom.remark = this.ruleForm.remark;
      let TreeList = {};
      for (let d = 0; d < arr.length; d++) {
        TreeList += arr[d] + "-";
      }
      if (JSON.stringify(TreeList) !== "{}") {
        addFrom.menuid = TreeList.substring(15, TreeList.length - 1);
      }
      if (this.ruleForm.roleName == "") {
        this.$message.error("角色名称不能为空");
      } else {
        createRole(addFrom).then(res => {
          this.ruleForm.roleName = "";
          this.ruleForm.radio = "0";
          this.ruleForm.remark = "";
          this.roleData = [];
          this.initData();
          this.dialogFormVisible = false;
        });
      }
    },
    cancel() {
      this.ruleForm.roleName = "";
      this.ruleForm.radio = "0";
      this.ruleForm.remark = "";
      this.roleData = [];
      this.dialogFormVisible = false;
    },
    cancelEdit() {
      this.ruleForm.roleName = "";
      this.ruleForm.radio = "0";
      this.ruleForm.remark = "";
      this.roleData = [];
      this.editFormVisible = false;
    },
    setCheckedKeys() {
      this.$refs.tree.setCheckedNodes(this.roleData);
    },
    setCheckedKeysL() {
      this.$refs.tree.setCheckedNodes(this.roleTree);
    },
    resetChecked() {
      this.$refs.tree.setCheckedKeys([]);
    },
    expandAll() {
      console.log(this.$refs.tree.store._getAllNodes());
      for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
        this.$refs.tree.store._getAllNodes()[i].expanded = true;
      }
    },
    closeAll() {
      for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
        this.$refs.tree.store._getAllNodes()[i].expanded = false;
      }
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

.dialogList {
  display: flex;
  justify-content: space-around;
  overflow: auto;
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

