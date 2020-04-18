<template>
<div>
    <div class="title-UserList">
        <p class="storg">名单</p><br>
        <p>平台名单用户，可由系统用户导入，或外部导入，名单用户可登录APP.</p>
    </div>
    <!-- 查询 -->
    <div class="filter-container">
      <el-input v-model="formData.UID" placeholder="UID" style="width: 200px;" class="filter-item" @keyup.enter.native="search(formData)" />
      <el-input v-model="formData.date" placeholder="注册时间" style="width: 200px;" class="filter-item" @keyup.enter.native="search(formData)" />
      <el-input v-model="formData.name" placeholder="用户信息" style="width: 200px;" class="filter-item" @keyup.enter.native="search(formData)" />
      
      
      <el-button v-waves class="filter-item" type="primary" @click="search(formData)">
          查询
      </el-button>
      <el-button v-waves class="filter-item" type="primary" @click="addFilter()">
          新建
      </el-button>
      <el-button v-waves class="filter-item" type="primary" @click="resert()">
          刷新
      </el-button>
      <el-button v-waves class="filter-item" type="primary" @click="exportExcel ()">
          导出
      </el-button>
    </div> 

    <!-- 列表 -->
    <el-table
    id="out-table1"
    v-loading="listLoading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    ref="filterTable"
    :data="tableList"
    style="width: 100%">
    <el-table-column
      prop="UID"
      label="UID"
    >
    </el-table-column>
    <el-table-column
      prop="name"
      label="用户信息">
    </el-table-column>
    <el-table-column
      prop="date"
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
      label="额度"
      sortable>
    </el-table-column>
    <el-table-column
      prop="tree"
      label="渠道">
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 编辑信息 -->
  <el-dialog title="修改信息" :visible.sync="dialogVisible">
    <el-form :model="selectTable">
        <el-form-item label="UID" label-width="100px">
            <el-input v-model="selectTable.UID" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户信息" label-width="100px">
            <el-input v-model="selectTable.name"></el-input>
        </el-form-item>
        <el-form-item label="注册时间" label-width="100px">
            <el-input v-model="selectTable.date"></el-input>
        </el-form-item>
        <el-form-item label="最后登录" label-width="100px">
            <el-input v-model="selectTable.finadate" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="额度" label-width="100px">
            <el-input v-model="selectTable.money"></el-input>
        </el-form-item>
        <el-form-item label="渠道" label-width="100px">
            <el-input v-model="selectTable.tree"></el-input>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="updateShop">确 定</el-button>
    </div>
  </el-dialog>
  <!-- 添加信息 -->
  <el-dialog title="添加信息" :visible.sync="addVisible">
      <el-form :model="addTable">
          <el-form-item label="UID" label-width="100px">
              <el-input v-model="addTable.UID" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户信息" label-width="100px">
              <el-input v-model="addTable.name"></el-input>
          </el-form-item>
          <el-form-item label="注册时间" label-width="100px">
              <el-input v-model="addTable.date"></el-input>
          </el-form-item>
          <el-form-item label="最后登录" label-width="100px">
              <el-input v-model="addTable.finadate" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="额度" label-width="100px">
              <el-input v-model="addTable.money"></el-input>
          </el-form-item>
          <el-form-item label="渠道" label-width="100px">
              <el-input v-model="addTable.tree"></el-input>
          </el-form-item>
      </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="addVisible = false">取 消</el-button>
      <el-button type="primary" @click="addList">确 定</el-button>
    </div>
  </el-dialog>
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
    :total="tableList.length">
  </el-pagination>
</div>

</template>

<script> 
import FileSave from 'file-saver' 
import XLSX from 'xlsx'
export default {
    inject: ['reload'],
    data() {
      return {
        dialogVisible: false,//编辑信息显示隐藏
        addVisible: false,//增加信息显示隐藏
        listLoading: false,//加载效果显示隐藏
        selectTable: {},//编辑信息显
        addTable: {},//增加信息
        pageSize: 10,//分页每页展示条数
        currpage: 1,//当前展示页码
        formData: { //表单查询
            UID: '',
            date: '',
            name: '',
        },
        tableList: [],//数据存储数组
        tableData: [ //模拟数据
          {
          UID: '1',
          date: '2016-05-02',
          finadate: '2018-6-7',
          name: '王小虎',
          money: '20000',
          tree: '0'
        },{
            UID: '2',
          date: '2016-05-02',
          finadate: '2018-6-8',
          name: '王二虎',
          money: '30000',
          tree: '0'
        },{
            UID: '3',
          date: '2016-05-02',
          finadate: '2018-6-9',
          name: '王三虎',
          money: '40000',
          tree: '0'
        },{
            UID: '4',
          date: '2016-05-02',
          finadate: '2018-6-10',
          name: '王四虎',
          money: '50000',
          tree: '0'
        },{
            UID: '5',
          date: '2016-05-02',
          finadate: '2018-6-11',
          name: '王五虎',
          money: '60000',
          tree: '0'
        },{
            UID: '6',
          date: '2016-05-02',
          finadate: '2018-6-12',
          name: '王虎',
          money: '70000',
          tree: '0'
        },
        {
          UID: '1',
          date: '2016-05-02',
          finadate: '2018-6-7',
          name: '李小虎',
          money: '20000',
          tree: '0'
        },{
            UID: '2',
          date: '2016-05-02',
          finadate: '2018-6-8',
          name: '李二虎',
          money: '30000',
          tree: '0'
        },{
            UID: '3',
          date: '2016-05-02',
          finadate: '2018-6-9',
          name: '李三虎',
          money: '40000',
          tree: '0'
        },{
            UID: '4',
          date: '2016-05-02',
          finadate: '2018-6-10',
          name: '李四虎',
          money: '50000',
          tree: '0'
        },{
            UID: '5',
          date: '2016-05-02',
          finadate: '2018-6-11',
          name: '李五虎',
          money: '60000',
          tree: '0'
        },{
            UID: '6',
          date: '2016-05-02',
          finadate: '2018-6-12',
          name: '李虎',
          money: '70000',
          tree: '0'
        },
        {
          UID: '1',
          date: '2016-05-02',
          finadate: '2018-6-7',
          name: '孙小虎',
          money: '20000',
          tree: '0'
        },{
            UID: '2',
          date: '2016-05-02',
          finadate: '2018-6-8',
          name: '孙二虎',
          money: '30000',
          tree: '0'
        },{
            UID: '3',
          date: '2016-05-02',
          finadate: '2018-6-9',
          name: '孙三虎',
          money: '40000',
          tree: '0'
        },{
            UID: '4',
          date: '2016-05-02',
          finadate: '2018-6-10',
          name: '孙四虎',
          money: '50000',
          tree: '0'
        },{
            UID: '5',
          date: '2016-05-02',
          finadate: '2018-6-11',
          name: '孙五虎',
          money: '60000',
          tree: '0'
        },{
            UID: '6',
          date: '2016-05-02',
          finadate: '2018-6-12',
          name: '孙虎',
          money: '70000',
          tree: '0'
        },
        {
          UID: '1',
          date: '2016-05-02',
          finadate: '2018-6-7',
          name: '钱小虎',
          money: '20000',
          tree: '0'
        },{
            UID: '2',
          date: '2016-05-02',
          finadate: '2018-6-8',
          name: '钱二虎',
          money: '30000',
          tree: '0'
        },{
            UID: '3',
          date: '2016-05-02',
          finadate: '2018-6-9',
          name: '钱三虎',
          money: '40000',
          tree: '0'
        },{
            UID: '4',
          date: '2016-05-02',
          finadate: '2018-6-10',
          name: '钱四虎',
          money: '50000',
          tree: '0'
        },{
            UID: '5',
          date: '2016-05-02',
          finadate: '2018-6-11',
          name: '钱五虎',
          money: '60000',
          tree: '0'
        },{
            UID: '6',
          date: '2016-05-02',
          finadate: '2018-6-12',
          name: '钱虎',
          money: '70000',
          tree: '0'
        },
        ]
      }
    },
    created() {
    this.search({});
  },
    methods: {
      //编辑
      handleEdit(index, row) {
          this.selectTable = row;
          this.dialogVisible = true;
      },
      //删除
      handleDelete(index, row) {
        this.tableList.splice(index, 1);
      },
      //增加
      resetTemp() {
      this.addTable = {
          UID: '',
          date: '',
          finadate: '',
          name: '',
          address: '',
          money: '',
          tree: ''
      }
    },
      addFilter() {
        this.resetTemp() 
        this.addVisible = true
      },
      addList() {
          this.tableList.push(this.addTable)
          this.addVisible = false;
      },
      //页面刷新
      resert() {
          this.reload()
      },
      //确定
      updateShop() {
          this.dialogVisible = false;
      },
      //分页
      handleSizeChange(val) {
        this.pageSize = val;
          console.log(`每页 ${val} 条`);
        },
      handleCurrentChange(val) {
          this.currpage = val;
          console.log(`当前页: ${val}`);
        },
      //查询
      search({UID, data, name}) {
          this.listLoading = true
          this.tableList =  this.tableData.filter(item => {
          let matchUID = true; // UID 筛选
          let matchdata = true; // data 筛选
          let matchname = true; // name 筛选

          if (UID) {
             // 模糊搜索;
            const ListUID = UID
              .replace(' ', '') // 删掉空格
              .split(''); // 切割成 单个字
            matchUID = ListUID.every(key => item.UID.includes(key));
          }
          if (data) {
            matchdata = item.data == data; 
          }
          if (name) {
            // 模糊搜索;
            const keys = name
              .toUpperCase() // 转大写
              .replace(' ', '') // 删掉空格
              .split(''); // 切割成 单个字

            matchname = keys.every(key => item.name.toUpperCase().includes(key));
          }
           // 加载动画定时关闭
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
          return matchUID && matchdata && matchname;
        });
      },
      exportExcel () {
         /* generate workbook object from table */
         var wb = XLSX.utils.table_to_book(document.querySelector('#out-table1'))
         /* get binary string as output */
         var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
         try { 
             FileSave.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '互腾.xlsx')
         } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) } 
         return wbout
     },
    }
  }
</script>
<style scoped>
  #out-table1{
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
  .celent_pagination{
    float: right;
  }
</style>

