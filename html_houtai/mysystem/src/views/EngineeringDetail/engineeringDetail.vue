<template>
<div>
    <br>
    <el-button style="float:right;" @click="$router.back(-1)" plain>上一页</el-button>
    <table style="padding-top:1rem;" class="client_table">
      <tr>
        <th rowspan="3">
          <!-- <img style="width:6rem;height:6rem;" :src="dataList.uHeadImg" alt="" srcset=""> -->
         
            <img @click="showBigImg = true" :src="dataList.uHeadImg" style="width:6rem;height:6rem;">
           
        </th>
        <th>
          姓名
        </th>
        <td>
          {{dataList.uRealName}}
        </td>
        <th>
          手机号
        </th>
        <td>
          {{dataList.uMobile}}
        </td>
        <th>
          性别
        </th>
        <td class="tableTd">
         {{dataList.uSex == 0? '女' : '男'}}
        </td>
      </tr>
      <tr>
        <th>
          昵称
        </th>
        <td>
         {{dataList.uNickName}}
        </td>
        <th>
          微信手机号
        </th>
        <td>
          {{dataList.uMobile}}
        </td>
        <th>
          项目数量
        </th>
        <td class="tableTd">
           {{dataList.projectCount}}
        </td>
      </tr>
      <tr>
        <th>
          注册时间
        </th>
        <td colspan="5">
           {{dataList.createTime}}
        </td>
      </tr>
    </table>

    <!-- 列表 -->
    <el-table
    id="out-table0"
    v-loading="listLoading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    ref="filterTable"
    :data="tableList"
    style="width: 100%">
    <el-table-column
      prop="projectid"
      v-if="hideRow"
    >
    </el-table-column>
    <el-table-column
      prop="sortNumer"
      label="序号"
    >
    </el-table-column>
    <el-table-column
      prop="projectName"
      label="项目名称">
    </el-table-column>
    <el-table-column
      prop="designerName"
      label="设计部">
    </el-table-column>
    <el-table-column
      prop="foremanName"
      label="工长"
      sortable>
    </el-table-column>
    <el-table-column
      prop="clientid1Name"
      label="客户"
      sortable>
    </el-table-column>
    <el-table-column
      prop="createTimeStart"
      label="项目开始时间">
    </el-table-column>
    <el-table-column
      prop="projectStatus"
      label="状态">
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="primary"
          plain
          @click="more_sys(scope.$index, scope.row)">项目详情</el-button>
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
    :total="pageTotal">
  </el-pagination>
    <!-- 图片放大 -->
  <el-dialog
  :visible.sync="showBigImg"
  width="40rem"
  style="height:40rem;"
  >
  <div class="bigHead">
    <img style="width:40rem;" :src="dataList.uHeadImg">
  </div>
</el-dialog>
</div>

</template>

<script> 
import {clientList, zbProject} from '../../config/api'
export default {
    inject: ['reload'],
    data() {
      return {
        showBigImg:false,
        hideRow: false,
        pageTotal: 1,
        restaurant_id: 1,
        listLoading: false,//加载效果显示隐藏
        pageSize: 10,//分页每页展示条数
        currpage: 1,//当前展示页码
         restaurants: [],
        tableList: [],//数据存储数组
        tableData: [],
        dataList: {},
      }
    },
    created() {
      if (this.$route.query.restaurant_id) {
          this.restaurant_id = this.$route.query.restaurant_id
          
        } else {

        }
      this.initData()
  },
    methods: {
      initData(){
        this.listLoading = true
        const CurrentList = {}
        const zbList = {}
        zbList.start = this.currpage
        zbList.pageSize = this.pageSize
        zbList.engineerid	 = this.restaurant_id
        CurrentList.start = this.currpage
        CurrentList.pageSize = this.pageSize
        CurrentList.uType = "2"
        CurrentList.useStatus = "0"
        CurrentList.uid	 = this.restaurant_id
          zbProject(zbList).then(arg => {
            console.log(arg) 
            this.tableList = arg.result
            this.pageTotal = arg.pageTotal
          })
        clientList(CurrentList).then(res => {
          console.log(res)
          this.dataList = res.result[0]
          console.log(this.dataList)
        })
        this.listLoading = false
      },
      more_sys(index, row) {
        console.log(row.projectid)
        this.$router.push({ path: 'projectDetails', query: { restaurant_id: row.projectid }})
      },
      addList() {
          this.tableList.push(this.addTable)
          this.addVisible = false;
      },
      //确定
      updateShop() {
          this.dialogVisible = false;
      },
      //分页
      handleSizeChange(val) {
        const currSize = {}
          currSize.start = this.currpage
          currSize.pageSize = val
          currSize.engineerid	 = this.restaurant_id
          currSize.uType = "2"
          zbProject(currSize).then(res => {
            this.tableList = res.result
          })
        this.pageSize = val;
          console.log(`每页 ${val} 条`);
        },
      handleCurrentChange(val) {
        const currIndex = {}
          currIndex.start = val
          currIndex.pageSize = this.pageSize
          currIndex.engineerid	 = this.restaurant_id
          currIndex.uType = "2" 
          zbProject(currIndex).then(res => {
            this.tableList = res.result
          })
          this.currpage = val;
          console.log(`当前页: ${val}`);
        },
    }
  }
</script>
<style scoped>
  .client_table{
      width: 100%;
      height: 10rem;
  }
  .client_table th,td{
    background-color: #fff; 
  }
  #out-table0{
      margin-top: 30px;
  }
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
  .filter-container{
    margin-top: 20px;
  }
  .mare_pagination{
    margin-top: 3rem;
    float: right;
  }
</style>

