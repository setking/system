<template>
<div>
  <br>
  <el-button style="float:right;" @click="$router.go(-1)" plain>上一页</el-button>
    <table style="padding-top:.5rem;" class="client_table">
      <tr>
        <th>
          项目名称
        </th>
        <td>
          {{dataList.projectName}}
        </td>
        <th>
          项目地址
        </th>
        <td>
          {{dataList.projectAddr}}
        </td>
        <th>
          开始时间
        </th>
        <td>
          {{dataList.createTimeStart}}
        </td>
        <th>
          项目合同
        </th>
      </tr>
      <tr>
        <th>
          客户1
        </th>
        <td>
          {{dataList.clientid1Name}}
        </td>
        <th>
          客户1电话
        </th>
        <td>
          {{dataList.clientid1Phone}}
        </td>
        <th>
          项目状态
        </th>
        <td>
          {{dataList.projectStatus}}
        </td>
        <th rowspan="3">
            <el-popover
                v-show="docType == '0'"
                placement="right"
                trigger="click">
                <img slot="reference" :src="dataList.projectContract"  style="width:6rem;height:6rem;">
                  <img :src="dataList.projectContract">
        </el-popover>
        <a v-if="docType == '1'" :href="dataList.projectContract" target="_blank">
          <svg t="1568708924678" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2044" width="50" height="50"><path d="M145.6 0C100.8 0 64 36.8 64 81.6v860.8C64 987.2 100.8 1024 145.6 1024h732.8c44.8 0 81.6-36.8 81.6-81.6V324.8L657.6 0h-512z" fill="#8C181A" p-id="2045"></path><path d="M960 326.4v16H755.2s-100.8-20.8-97.6-107.2c0 0 3.2 91.2 96 91.2H960z" fill="#6B0D12" p-id="2046"></path><path d="M657.6 0v233.6c0 27.2 17.6 92.8 97.6 92.8H960L657.6 0z" fill="#FFFFFF" opacity=".5" p-id="2047"></path><path d="M302.4 784h-52.8v65.6c0 6.4-4.8 11.2-12.8 11.2-6.4 0-11.2-4.8-11.2-11.2V686.4c0-9.6 8-17.6 17.6-17.6h59.2c38.4 0 60.8 27.2 60.8 57.6 0 32-22.4 57.6-60.8 57.6z m-1.6-94.4h-51.2v73.6h51.2c22.4 0 38.4-14.4 38.4-36.8s-16-36.8-38.4-36.8z m166.4 171.2h-48c-9.6 0-17.6-8-17.6-17.6v-156.8c0-9.6 8-17.6 17.6-17.6h48c59.2 0 99.2 41.6 99.2 96s-38.4 96-99.2 96z m0-171.2h-41.6v148.8h41.6c46.4 0 73.6-33.6 73.6-75.2 1.6-40-25.6-73.6-73.6-73.6z m260.8 0h-92.8V752h91.2c6.4 0 9.6 4.8 9.6 11.2s-4.8 9.6-9.6 9.6h-91.2v76.8c0 6.4-4.8 11.2-12.8 11.2-6.4 0-11.2-4.8-11.2-11.2V686.4c0-9.6 8-17.6 17.6-17.6h99.2c6.4 0 9.6 4.8 9.6 11.2 1.6 4.8-3.2 9.6-9.6 9.6z" fill="#FFFFFF" p-id="2048"></path></svg>
        </a>
          
        </th>
      </tr>
      <tr>
        <th>
          工长
        </th>
        <td>
          {{dataList.foremanName}}
        </td>
        <th>
          设计师
        </th>
        <td>
          {{dataList.designerName}}
        </td>
        <th>
          工程部
        </th>
        <td>
          {{dataList.engineerName}}
        </td>
      </tr>
      <tr>
        <th>
          客户2
        </th>
        <td>
          {{dataList.clientid2Name}}
        </td>
        <th>
          客户2电话
        </th>
        <td colspan="3">
          {{dataList.clientid2Phone}}
        </td>
      </tr>
    </table>
    <div class="page_title">项目阶段</div>
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
      prop="parentName"
      label="阶段名称">
    </el-table-column>
    <el-table-column
    align="center"
      prop="flowName"
      label="工作节点">
    </el-table-column>
    <el-table-column
    align="center"
      prop="pflowServiceStatus"
      label="状态"
    >
    </el-table-column>
    <el-table-column
    align="center"
      prop="timeStart"
      label="节点开始时间"
      >
    </el-table-column>
    <el-table-column
    align="center"
      prop="timeEnd"
      label="节点结束时间">
    </el-table-column>
    <el-table-column align="center" label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="primary"
          plain
          @click="handleEdit(scope.$index, scope.row)">节点详情</el-button>
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
</div>

</template>

<script> 
import FileSave from 'file-saver' 
import {zbProject, getProject} from '../../config/api' 
export default {
    inject: ['reload'],
    data() {
      return {
        docType: 0,
        pageTotal: 1,
        showRow: false,
        restaurant_id: 1,
        listLoading: false,//加载效果显示隐藏
        pageSize: 10,//分页每页展示条数
        currpage: 1,//当前展示页码
         restaurants: [],
        tableList: [],//数据存储数组
        tableData: [], //模拟数据
        dataList: {},
      }
    },
    created() {
      if (this.$route.query.restaurant_id) {
          this.restaurant_id = this.$route.query.restaurant_id
          
        } else {

        }
    this.initData();
  },
    methods: {
      initData() {
        this.listLoading = true
        const CurrentList = {}
        const zbList = {}
        zbList.start = this.currpage
        zbList.pageSize = this.pageSize
        zbList.projectid = this.restaurant_id
        CurrentList.start = this.currpage
        CurrentList.pageSize = this.pageSize
        CurrentList.uType = "0"
        CurrentList.projectid = this.restaurant_id
        console.log(this.restaurant_id)
        zbProject(CurrentList).then(res => {
          this.dataList = res.result[0]
          // console.log('用户数据',this.dataList.projectContract)
          let strs = []
          strs = res.result[0].projectContract.split(".")
          let strsType = strs.pop()
          if (strsType == "pdf") {
            console.log("文件类型是pdf")
            this.docType = '1'
          } else {
             this.docType = '0'
          }
          
        })
        getProject(zbList).then(res => {
          console.log(res)
          this.tableList = res
          this.tableList = res.result
          this.pageTotal = res.pageTotal
        })
        this.listLoading = false
      },
      handleEdit(index, row) {
        console.log(row.flowid)
        this.$router.push({ path: 'launchProject', query: {flow_id: row.flowid, pid: this.restaurant_id}}) 
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
          currSize.projectid = this.restaurant_id
          getProject(currSize).then(res => {
            this.tableList = res.result
          })
        this.pageSize = val;
          console.log(`每页 ${val} 条`);
        },
      handleCurrentChange(val) {
          const currIndex = {}
          currIndex.start = val
          currIndex.pageSize = this.pageSize
           currIndex.projectid = this.restaurant_id
          getProject(currIndex).then(res => {
            this.tableList = res.result
          })
          this.currpage = val;
          console.log(`当前页: ${val}`);
        },
    }
  }
</script>
<style scoped> 
  .page_title{
    width: 100%;
    text-align: left; 
    padding-top: 2rem;
    font-size: 1.5rem;
  }
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

