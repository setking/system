
<template>
  <div class="block">
    <div>
      {{value1}}
    </div>
    <el-date-picker
      v-model="value1"
      value-format="yyyy-MM-dd"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>


        <!-- 列表 -->
    <el-table
    id="out-table0"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    ref="filterTable"
    :data="tableData.slice((currpage - 1) * pageSize, currpage * pageSize)"
    style="width: 100%">
    <el-table-column
      prop="UID"
      label="星宿"
    >
    </el-table-column>
    <el-table-column
      prop="value"
      label="用户信息">
    </el-table-column>
    <el-table-column
      prop="date"
      :filters="[{text: '2010-05-02', value: '2011--05-02'}, {text: '2012-05-02', value: '2013-05-02'}, {text: '2014-05-02', value: '2015-05-02'}, {text: '2016-05-02', value: '2016-05-02'}]"
      :filter-method="filterHandler"
      label="注册时间">
    </el-table-column>
    <el-table-column
      prop="finadate"
      label="最后登录"
      sortable 
    >
    </el-table-column>
    <el-table-column
      prop="money"
      label="欠款"
      sortable>
    </el-table-column>
    <el-table-column
      prop="tree"
      label="诨名">
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
    :total="tableData.length">
  </el-pagination>
  </div>
</template>
 
<script>
    export default {
        data() {
            return {
                value1: '',
        pageSize: 10,//分页每页展示条数
                currpage: 1,//当前展示页码
                tableList: [],//数据存储数组
                tableData: []
            }
        },
        created() {
        },
        methods: {
                handleSizeChange(val) {
                  this.pageSize = val;
                    console.log(`每页 ${val} 条`);
                  },
                handleCurrentChange(val) {
                    this.currpage = val;
                    console.log(`当前页: ${val}`);
                  },
        }
    }
</script>
<style scoped>
  .celent_pagination{
    float: right;
  }
</style>