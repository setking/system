<template>
<div>
    <!-- 查询 -->
    <div class="search_all">
      <div>
              <div class="search_listOne">
        <div class="filter-container">
          模块名称:
          <el-input v-model="formData.logModule" placeholder="请输入模块名" style="width: 200px;" class="filter-item" @keyup.enter.native="search(formData)" />
        </div> 
        <div class="filter-container">
          用户名:
          <el-input v-model="formData.logName" placeholder="请输入姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="search(formData)" />
        </div> 
        <div class="filter-container">
            <div class="block">
              <span class="demonstration"> 操作时间:</span>
              <el-date-picker
              value-format="yyyy-MM-dd"
                v-model="formData.value6"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </div> 
          <div class="filter-container">
          <el-button v-waves class="filter-item search_items" type="primary" @click="search(formData)">
            查询
        </el-button>
        </div> 
    </div> 
      </div>
      <!-- <div>
          <el-button v-waves class="filter-item search_items" type="primary" @click="search(formData)">
            查询
        </el-button>
      </div> -->
    </div>

    

    <!-- 列表 -->
    <!-- :data="tableList.slice((currpage - 1) * pageSize, currpage * pageSize)" -->
    <el-table
    id="out-table"
    :data="tableList"
    v-loading="listLoading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    ref="filterTable"
    style="width: 100%">
    <el-table-column
    align="center"
      prop="sortNumber"
      label="序号"
    >
    </el-table-column>
    <el-table-column
    align="center"
      prop="logName"
      label="用户名">
    </el-table-column>
    <el-table-column align="center" prop="logModule" label="操作模块">
    </el-table-column>
    <el-table-column align="center" prop="createTime" label="操作日期">
    </el-table-column>
    <el-table-column
    align="center"
      prop="logRecord"
      label="操作内容"
      > 
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
    :total="pageTotal">
  </el-pagination>
</div>

</template>

<script> 
import {logList} from '../../config/api'
export default {
    inject: ['reload'],
    data() {
      return {
        pageTotal: 1,
        dialogVisible: false,//编辑信息显示隐藏
        addVisible: false,//增加信息显示隐藏
        listLoading: false,//加载效果显示隐藏
        selectTable: {},//编辑信息显
        addTable: {},//增加信息
        pageSize: 10,//分页每页展示条数
        currpage: 1,//当前展示页码
        num8: 1,
        num9: 1,
        formData: { //表单查询
            logModule: '',
            logName: '',
            value6: '',
        },
        tableList: [],//数据存储数组
        tableData: [],
        value: '',
        
      }
    },
    created() {
    this.initData();
  },
    methods: {
      initData() {
        const CurrentList = {}
        CurrentList.start = this.currpage
        CurrentList.pageSize = this.pageSize
        logList(CurrentList).then(res => {
          this.pageTotal = res.pageTotal 
          this.tableList = res.result
          console.log(res)
        }).catch(err => {
          this.$message.error('网络错误');
        })
      },
      addList() {
          this.tableList.push(this.addTable)
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
        const currSize = {}
          currSize.start = this.currpage
          currSize.pageSize = val
          if (this.formData.logModule !== '') {
                  currSize.logModule = this.formData.logModule
                }
               if (this.formData.logName !== '') {
                  currSize.logName = this.formData.logName
                }
                if (this.formData.value6 !== undefined) {
                  if(this.formData.value6 !== null){
                    currSize.timeStart = this.formData.value6[0]
                    currSize.timeEnd = this.formData.value6[1]  

                  }
                }
          logList(currSize).then(res => {
            this.tableList = res.result
          })
        this.pageSize = val;
          console.log(`每页 ${val} 条`);
        },
      handleCurrentChange(val) {
        const currIndex = {}
          currIndex.start = val
          currIndex.pageSize = this.pageSize
          if (this.formData.logModule !== '') {
                  currIndex.logModule = this.formData.logModule
                }
               if (this.formData.logName !== '') {
                  currIndex.logName = this.formData.logName
                }
                if (this.formData.value6 !== undefined) {
                  if(this.formData.value6 !== null){
                    currIndex.timeStart = this.formData.value6[0]
                    currIndex.timeEnd = this.formData.value6[1] 

                  }
                }
          logList(currIndex).then(res => {
            this.tableList = res.result
          })
          this.currpage = val;
          console.log(`当前页: ${val}`);
        },
      //查询
      search() {
        const searchCount = {}
          const searchData = this.formData
                searchCount.start = '1'
                searchCount.pageSize = this.pageSize 

                if (this.formData.logModule !== '') {
                  searchCount.logModule = this.formData.logModule
                }
               if (this.formData.logName !== '') {
                  searchCount.logName = this.formData.logName
                }
                if (this.formData.value6 !== undefined) {
                  if(this.formData.value6 !== null){
                    searchCount.timeStart = this.formData.value6[0]
                    searchCount.timeEnd = this.formData.value6[1] 

                  }
                }
                logList(searchCount).then(res => {
                  this.tableList = res.result
                  this.pageTotal = res.pageTotal
                  this.currpage = 1
                })
          console.log(searchData)
      },
    }
  }
</script>
<style scoped>
  #out-table{
    margin-top: 30px;
  }
  .filter-container{
    margin-top: 20px;
    margin-left: 1rem;
  }
  .search_listOne{
    width: 100%;
    display: flex;
  }
</style>

