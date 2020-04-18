<template>
  <div>
    <!-- 查询 -->
    <div class="showBtn">
      <div class="filter-container">
        <el-button v-waves class="filter-item newList" type="primary" @click="addFilter()">添加工作内容</el-button>
      </div>
      <div class="filter-container">
        <el-button @click="$router.back(-1)" plain>上一页</el-button>
      </div>
    </div>

    <!-- 列表 -->
    <el-table v-loading="listLoading" ref="filterTable" :data="tableList" style="width: 100%">
      <el-table-column v-if="showRow" prop="flowid"></el-table-column>
      <el-table-column v-if="showRow" prop="operation"></el-table-column>
      <el-table-column align="center" prop="sortNumber" label="序号"></el-table-column>
      <el-table-column align="center" prop="flowName" label="工作(节点)名称"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            @click="handleEdit(scope.$index, scope.row)"
          >修改名称</el-button>
          <template v-if="scope.row.operation === '1'">
            <el-button
              size="mini"
              type="primary"
              plain
              @click="to_jobStandard(scope.$index, scope.row)"
            >装修标准</el-button>
            <el-button
              size="mini"
              type="primary"
              plain
              @click="to_editorStandard(scope.$index, scope.row)"
            >编辑装修标准</el-button>
          </template>
          <template v-if="scope.row.operation === '0'">
            <el-button
              size="mini"
              type="primary"
              plain
              @click="to_jobContent(scope.$index, scope.row)"
            >添加标准</el-button>
          </template>
          <el-button
            size="mini"
            type="danger"
            plain
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑信息 -->
    <el-dialog width="30%" title="修改名称" :visible.sync="dialogVisible">
      <el-form :model="selectTable">
        <el-form-item label="阶段名称" label-width="100px">
          <el-input v-model="selectTable.flowName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateShop()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加信息 -->
    <el-dialog width="30%" title="添加节点" :visible.sync="addVisible">
      <el-form :model="addTable">
        <el-form-item label="工作内容" label-width="100px">
          <el-input v-model="addTable.flowName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addList()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 删除提示 -->
    <el-dialog title="提示" :visible.sync="deletVisible" width="30%">
      <span>您确定要删除这条信息吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deletVisible = false">取 消</el-button>
        <el-button type="primary" @click="deletList()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分页 -->
    <el-pagination
      background
      class="pagination_artic"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currpage"
      :page-sizes="[10, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageTatol"
    ></el-pagination>
  </div>
</template>

<script>
import {
  getProjectChildren,
  editProject,
  deletProject,
  createProject
} from "../../config/api";
export default {
  data() {
    return {
      operationShow: false,
      pageTatol: 1,
      queryId: 1,
      showRow: false,
      deletTip: false,
      deletVisible: false,
      dialogVisible: false, //编辑信息显示隐藏
      addVisible: false, //增加信息显示隐藏
      listLoading: false, //加载效果显示隐藏
      selectTable: {}, //编辑信息显
      addTable: {}, //增加信息
      deletTable: {},
      pageSize: 10, //分页每页展示条数
      currpage: 1, //当前展示页码
      tableList: [], //数据存储数组
      tableData: [], //数据存储数组
      maxSort: 1
    };
  },
  created() {
    if (this.$route.query.father_id) {
      this.queryId = this.$route.query.father_id;
    } else {
    }
    this.initData();
  },
  methods: {
    initData() {
      const CurrentList = {};
      CurrentList.start = this.currpage;
      CurrentList.pageSize = this.pageSize;
      CurrentList.flowid = this.queryId;
      getProjectChildren(CurrentList).then(res => {
        this.tableData = JSON.parse(JSON.stringify(res.result));
        this.tableList = res.result;
        this.pageTatol = res.pageTotal;
        // console.log(res.maxSort)
        this.maxSort = res.maxSort;
      });
    },
    //编辑
    handleEdit(index, row) {
      this.selectTable = row;
      console.log(this.selectTable);
      this.editRow = JSON.stringify(row);
      this.selectTable = JSON.parse(this.editRow);
      this.dialogVisible = true;
    },
    //删除
    handleDelete(index, row) {
      this.deletTable = row;
      this.deletVisible = true;
    },
    deletList() {
      const deletData = {};
      deletData.id = this.deletTable.flowid;
      deletProject(deletData).then(res => {
        this.initData();
        console.log(res);
      });
      this.deletVisible = false;
    },
    to_jobContent(index, row) {
      let childData = null;
      this.$store.commit("childernList", childData);
      console.log(row.flowid);
      this.$router.push({
        path: "addStandard",
        query: { father_id: row.flowid }
      });
    },
    addFilter() {
      // this.resetTemp()
      this.addVisible = true;
    },
    addList() {
      const addData = {};
      addData.flowName = this.addTable.flowName;
      addData.flowParentid = this.queryId;
      addData.sortNum = this.maxSort + 1;
      addData.flowKey = "1";
      addData.flowLevel = "1";
      console.log(addData);
      if (this.addTable.flowName == undefined) {
        this.$message({
          message: "请填写完成",
          type: "warning"
        });
      } else {
        createProject(addData).then(res => {
          this.initData();
          this.addVisible = false;
        });
      }
    },
    // 装修标准
    to_jobStandard(index, row) {
      this.$router.push({
        path: "viewStandard",
        query: { father_id: row.flowid }
      });
    },
    to_editorStandard(index, row) {
      this.$router.push({
        path: "editorStandard",
        query: { father_id: row.flowid }
      });
    },
    //确定
    updateShop() {
      const editData = {};
      editData.flowid = this.selectTable.flowid;
      editData.flowName = this.selectTable.flowName;
      console.log(editData);
      if (this.selectTable.flowName == "") {
        this.$message({
          message: "请填写完成",
          type: "warning"
        });
      } else {
        editProject(editData)
          .then(res => {
            this.initData();
            this.dialogVisible = false;
          })
          .catch(err => {});
      }
    },
    //分页
    handleSizeChange(val) {
      const currSize = {};
      currSize.start = this.currpage;
      currSize.pageSize = val;
      currSize.flowid = this.queryId;
      getProjectChildren(currSize).then(res => {
        this.tableList = res.result;
      });
      this.pageSize = val;
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      const currIndex = {};
      currIndex.start = val;
      currIndex.pageSize = this.pageSize;
      currIndex.flowid = this.queryId;
      getProjectChildren(currIndex).then(res => {
        this.tableList = res.result;
      });
      this.currpage = val;
      console.log(`当前页: ${val}`);
    }
  }
};
</script>
<style scoped>
.title-UserList {
  height: 60px;
  padding: 20px;
  background-color: #fff;
}
.storg {
  font-size: 20px;
  font-weight: 500;
  color: #333;
}
.pagination_artic {
  margin-top: 3rem;
  float: right;
}
.showBtn {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  margin-bottom: 2rem;
}
</style>


