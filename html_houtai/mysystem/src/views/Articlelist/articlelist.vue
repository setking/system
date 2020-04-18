<template>
<div>
    <!-- 查询 -->
    <div class="filter-container">
      <el-button v-show="showAdd" v-waves class="filter-item newList" type="primary" @click="addFilter()">
          添加阶段
      </el-button>
    </div> 

    <!-- 列表 -->
    <el-table
    v-loading="listLoading"
    ref="filterTable"
    :data="tableList"
    style="width: 100%">
    <el-table-column
      v-if="showRow"
      prop="flowid"
    >
    </el-table-column>
    <el-table-column
    align="center"
      prop="sortNumber"
      label="序号"
    >
    </el-table-column>
    <el-table-column
    align="center"
      prop="flowName" 
      label="阶段名称">
    </el-table-column>
    <el-table-column align="center" label="操作">
      
      <template slot-scope="scope">
        <el-button
        v-show="showEdit"
          size="mini"
          type="primary"
          plain
          @click="handleEdit(scope.$index, scope.row)">修改名称</el-button>
          <el-button
           v-show="showMore"
          size="mini"
          type="primary"
          plain
          @click="to_jobContent(scope.$index, scope.row)">工作内容</el-button>
        <el-button
        v-show="showDelet"
          size="mini"
          type="danger"
          plain
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
  <el-dialog width="30%" title="添加阶段" :visible.sync="addVisible">
      <el-form :model="addTable">
          <el-form-item label="阶段名称" label-width="100px">
              <el-input v-model="addTable.flowName"></el-input>
          </el-form-item>
      </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="addVisible = false">取 消</el-button>
      <el-button type="primary" @click="addList()">确 定</el-button>
    </div>
  </el-dialog>
  <!-- 删除提示 -->
  <el-dialog
  title="提示"
  :visible.sync="deletVisible"
  width="30%">
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
    :total="tablecount">
  </el-pagination>
</div>

</template>

<script> 
import {getProjectFather, editProject, deletProject, createProject} from '../../config/api'
export default {
    data() {
      return {
        showEdit: true, 
        showDelet: true, 
        showMore: true, 
        showAdd: true, 
        tablecount: 1,
        maxSort: 1,
        showRow: false,
        deletTip:false,
        deletVisible: false,
        dialogVisible: false,//编辑信息显示隐藏
        addVisible: false,//增加信息显示隐藏
        listLoading: false,//加载效果显示隐藏
        selectTable: {},//编辑信息显
        addTable: {},//增加信息
        deletTable: {},
        pageSize: 10,//分页每页展示条数
        currpage: 1,//当前展示页码
        tableList: [],//数据存储数组
      }
    },
    created() {
    this.initData();
  },
    methods: {
      initData() { 
        let storyList = []
        storyList = sessionStorage.getItem("menuName")  
        let storyMenu = storyList.split(",") 
        console.log("story数据", storyMenu)
        if (!storyMenu.includes('项目阶段流程设置-修改')) {
          this.showEdit = false      
        } 
        if (!storyMenu.includes('项目阶段流程设置-删除')) {
          this.showDelet = false     
        }
        if (!storyMenu.includes('项目阶段流程设置-工作内容')) {
          this.showMore = false     
        } 
        if (!storyMenu.includes('项目阶段流程设置-添加阶段')) {
          this.showAdd = false     
        }  
          const CurrentList = {}
          CurrentList.start = this.currpage
          CurrentList.pageSize = this.pageSize
          CurrentList.flowParentid = 0 
          getProjectFather(CurrentList).then(res => {
            this.tablecount = res.pageTotal
            this.tableList = res.result
            this.maxSort = res.maxSort
            console.log(res.maxSort)
          })
      },
      //编辑
      handleEdit(index, row) {
          this.selectTable = row
          console.log(this.selectTable)
          this.editRow = JSON.stringify(row);
          this.selectTable = JSON.parse(this.editRow);
          this.dialogVisible = true;
      },
      //删除
      handleDelete(index, row) {
        this.deletTable = row
        this.deletVisible = true
      // this.tableList.splice(index, 1);
      },
      deletList() {
        const deletData = {}
        deletData.id = this.deletTable.flowid
        deletProject(deletData).then(res => {
          this.initData();
            console.log(res)
        })
        this.deletVisible = false
      },
      to_jobContent(index, row) {
        console.log(row.flowid)
        this.$router.push({ path: 'jobContent', query: {father_id: row.flowid}})
      },
      addFilter() {
        // this.resetTemp() 
        this.addVisible = true 
      },
      addList() {
        const addData = {}
        addData.flowName =this.addTable.flowName
        addData.sortNum = this.maxSort + 1
		addData.flowKey = '0'
		addData.flowLevel = '0'  
        console.log(this.addTable.flowName)
        if (this.addTable.flowName == undefined) {
          this.$message({
          message: '请填写完成',
          type: 'warning'
        });
        } else {
          createProject(addData).then(res => {
              this.initData();
              this.addVisible = false;
          })
          
        }
      },
      //确定
      updateShop() {
        const editData = {}
        editData.flowid = this.selectTable.flowid
        editData.flowName = this.selectTable.flowName
        console.log(editData)
        if (this.selectTable.flowName == '') {
          this.$message({
          message: '请填写完成',
          type: 'warning'
        });
        } else {

          editProject(editData).then(res => {
              this.initData();
            this.dialogVisible = false;
          }).catch(err => {
  
          })
        }
      },
      //分页
      handleSizeChange(val) {
        const currSize = {}
          currSize.start = this.currpage
          currSize.pageSize = val
          getProjectFather(currSize).then(res => {
            this.tableList = res.result
          })
        this.pageSize = val;
          console.log(`每页 ${val} 条`);
        },
      handleCurrentChange(val) {
        const currIndex = {}
          currIndex.start = val
          currIndex.pageSize = this.pageSize
          getProjectFather(currIndex).then(res => {
            this.tableList = res.result
          })
          this.currpage = val;
          console.log(`当前页: ${val}`);
        },
    }
  }
</script>
<style scoped>
  .title-UserList{
    height: 60px;
    padding: 20px;
    background-color: #fff;
  }
  .storg{
    font-size: 20px;
    font-weight: 500;
    color: #333;
  }
  .newList{
    float: left;
    margin-top: 2rem;
    margin-bottom: 3rem;
  }
  .pagination_artic{
    margin-top: 2rem;
    float: right;
  }
</style>

