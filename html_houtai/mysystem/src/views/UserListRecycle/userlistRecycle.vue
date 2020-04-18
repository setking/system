<template>
<div>
    <!-- 查询 -->
    <div class="search_all">
      <div>
        <div class="search_listOne">
        <div class="filter-container">
          手机号:
          <el-input v-model="formData.uMobile" placeholder="请输入手机号" style="width: 200px;" class="filter-item" oninput = "value=value.replace(/[^\d]/g,'')" maxlength="11"/>
        </div> 
        <div class="filter-container">
          姓名:
          <el-input v-model="formData.uNickName" placeholder="请输入姓名" style="width: 200px;" class="filter-item"/>
        </div> 
        <div class="filter-container">
          性别:
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in formData.options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>  
        <div class="filter-container">
          <el-button v-waves class="filter-item search_items" type="primary" @click="search(formData)">
            查询
        </el-button>
        </div>  
        
    </div>
      <div class="search_listOne">
          <div class="filter-container">
            项目数量:
            <el-input-number v-model="formData.projectCountMin" controls-position="right" @change="handleChange" :min="0" :max="formData.projectCountMax"></el-input-number>   
          </div>
          <div class="filter-container">
            ——
            <el-input-number v-model="formData.projectCountMax" controls-position="right" @change="handleChange" :min="0" :max="Infinity"></el-input-number> 
          </div> 
          <div class="filter-container">
            <div class="block">
              <span class="demonstration"> 注册时间:</span>
              <el-date-picker
                value-format="yyyy-MM-dd HH:mm:ss"
                v-model="formData.value6"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </div> 
      </div> 
      </div>
      <div class="filter-container" style="float:right;">
        <el-button @click="$router.back(-1)" plain>上一页</el-button> 
        </div> 
      <!-- <div style="padding-top:.5rem;">
          <el-button v-waves class="filter-item search_items" type="primary" @click="search(formData)">
            查询
        </el-button>
        <el-button @click="$router.back(-1)" type="success">返回</el-button>
      </div> -->
    </div>
    
    
    <div>
      <br>
      <el-button @click="deletList()" type="primary">批量恢复</el-button>
    </div>
    <!-- 列表 -->
    <el-table
    id="out-table"
    v-loading="listLoading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    ref="multipleTable"
    tooltip-effect="dark"
    @selection-change="handleSelectionChange"
    :data="tableList"
    style="width: 100%">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column
      prop="sortNumer"
      align="center"
      label="序号"
    >
    </el-table-column>
    <el-table-column
      prop="uRealName"
      align="center"
      label="姓名">
    </el-table-column>
    <el-table-column align="center" prop="uMobile" label="手机号">
    </el-table-column>
    <el-table-column  v-if="hideRow" prop="uid" width="0">
    </el-table-column>
    <el-table-column align="center" label="性别">
      <template slot-scope="scope">
          <p>{{ scope.row.uSex == '0'? '女' : '男' }}</p>
      </template>
    </el-table-column>
    <el-table-column
    align="center"
      prop="projectCount"
      label="项目数量"
      >
    </el-table-column>
    <el-table-column
    align="center"
      prop="createTime"
      label="注册时间">
    </el-table-column> 
    <el-table-column align="center" label="操作" width="180">
      <template slot-scope="scope">
        <el-button
        v-show="showMenu"
          size="mini"
          @click="celent_more(scope.$index, scope.row)">用户详情</el-button>
        <el-button
          type="danger"
          size="mini"
          plain
          @click="celent_delet(scope.$index, scope.row)">恢复</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="celientFooter">
    <div>
      
    </div>
    <div>
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
  </div>
<!-- 恢复提示 -->
  <el-dialog
  title="提示"
  :visible.sync="DeletTip"
  width="30%">
  <span>是否确认恢复？ 恢复信息后可到“客户列表”查看并编辑被恢复的信息</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="DeletTip = false">取 消</el-button>
    <el-button v-show="deletVisibleType == '0'" type="primary" @click="deletVisible()">确 定</el-button>
    <el-button v-show="deletVisibleType == '1'" type="primary" @click="deletVisibleList()">确 定</el-button>
  </span>
</el-dialog>
</div>

</template>

<script> 
import FileSave from 'file-saver' 
import {clientList, deletUserList} from '../../config/api'
export default {
    inject: ['reload'],
    data() {
      return {
        deletVisibleType: null,
        DeletTip: false,
        showMenu: true,
        pageTotal: 1,
        hideRow: false,
        dialogVisible: false,//编辑信息显示隐藏
        addVisible: false,//增加信息显示隐藏
        listLoading: false,//加载效果显示隐藏
        selectTable: {},//编辑信息显
        addTable: {},//增加信息
        pageSize: 10,//分页每页展示条数 
        currpage: 1,//当前展示页码
        DeletId: null,//删除的id
        celientList: null,
        formData: { //表单查询
            uMobile: null,
            uNickName: null,
            projectCountMin: 0,
            projectCountMax: 0,
            value6: '',
            options: [
              {
                value: '',
                label: '全部'
              },
              {
                value: '1',
                label: '男'
              },
              {
                value: '0',
                label: '女'
              }
            ]
        },
        tableList: [],//数据存储数组
        tableData:[],
        value: '',
        
      }
    },
    created() {
    this.initData()
  },
    methods: {
      initData() {
        let storyList = []
        storyList = sessionStorage.getItem("menuName")  
        let storyMenu = storyList.split(",") 
        if (!storyMenu.includes('客户管理-用户详情')) {
          this.showMenu = false    
        } 
        const CurrentList = {}
        CurrentList.start = this.currpage
        CurrentList.pageSize = this.pageSize
        CurrentList.uType = "0"
        CurrentList.useStatus = "2" 
        const celentUserList = clientList(CurrentList)
        celentUserList.then(res => {
          console.log(res)
          this.pageTotal = res.pageTotal
          this.tableList = res.result
            this.listLoading = false
        })
      },
      testPhone() {
          let TEL_REGEXP = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/;
          if (this.formData.uMobile == "" || this.formData.uMobile.length < 11 || this.formData.uMobile.test(TEL_REGEXP)) {  
            this.$message.error('手机号格式不正确');
          }
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
        this.pageSize = val;
          console.log(`每页 ${val} 条`);
          const currSize = {}
          currSize.start = this.currpage
          currSize.pageSize = val
          currSize.uType = "0"
          currSize.useStatus = "2" 
          if (this.formData.uMobile !== null) {
                  currSize.uMobile = this.formData.uMobile
                  
                }

                if (this.formData.projectCountMin !== null) {
                  currSize.projectCountMin = this.formData.projectCountMin
                }

                if (this.formData.projectCountMax !== null) {
                  currSize.projectCountMax = this.formData.projectCountMax
                }

                if (this.formData.value !== "") {
                  currSize.uSex = this.value 
                }

                if (this.formData.uNickName !== null) {
                  currSize.uNickName = this.formData.uNickName
                }
                console.log(this.formData.value6)
                if (this.formData.value6 !== undefined) {
                  if(this.formData.value6 !== null){
                    currSize.createTimeStart = this.formData.value6[0]
                    currSize.createTimeEnd = this.formData.value6[1]

                  }
                }
          clientList(currSize).then(res => {
            this.tableList = res.result
          })
        },
      handleCurrentChange(val) {
          const currIndex = {}
          currIndex.start = val
          currIndex.pageSize = this.pageSize
          currIndex.uType = "0"
          currIndex.useStatus = "2" 
          if (this.formData.uMobile !== null) {
                  currIndex.uMobile = this.formData.uMobile
                  
                }

                if (this.formData.projectCountMin !== null) {
                  currIndex.projectCountMin = this.formData.projectCountMin
                }

                if (this.formData.projectCountMax !== null) {
                  currIndex.projectCountMax = this.formData.projectCountMax
                }

                if (this.formData.value !== "") {
                  currIndex.uSex = this.value 
                }

                if (this.formData.uNickName !== null) {
                  currIndex.uNickName = this.formData.uNickName
                }
                console.log(this.formData.value6)
                if (this.formData.value6 !== undefined) {
                  if(this.formData.value6 !== null){
                    currIndex.createTimeStart = this.formData.value6[0]
                    currIndex.createTimeEnd = this.formData.value6[1]

                  }
                }
          clientList(currIndex).then(res => {
            this.tableList = res.result
          })
          this.currpage = val;
          console.log(`当前页: ${val}`);
        },
      //查询
      search() {
        console.log(this.formData.value6)
          this.listLoading = true
          const searchCount = {}
          const searchData = this.formData
                searchCount.start = '1'
                searchCount.pageSize = this.pageSize 
                searchCount.uType = "0"
                searchCount.useStatus = "2" 

                if (this.formData.uMobile !== null) {
                  searchCount.uMobile = this.formData.uMobile
                  
                }

                if (this.formData.projectCountMin !== null) {
                  searchCount.projectCountMin = this.formData.projectCountMin
                }

                if (this.formData.projectCountMax !== null) {
                  searchCount.projectCountMax = this.formData.projectCountMax
                }

                if (this.formData.value !== "") {
                  searchCount.uSex = this.value 
                }

                if (this.formData.uNickName !== null) {
                  searchCount.uNickName = this.formData.uNickName
                }
                console.log(this.formData.value6)
                if (this.formData.value6 !== undefined) {
                  if(this.formData.value6 !== null){
                    searchCount.createTimeStart = this.formData.value6[0]
                    searchCount.createTimeEnd = this.formData.value6[1]

                  }
                }
          const sortList = clientList(searchCount)
              sortList.then(res => {
                this.tableList = res.result
                this.pageTotal = res.pageTotal
                this.currpage = 1
                console.log( this.tableList)
            })
            this.listLoading = false
      },
      celent_more(index, row) {
        console.log(row.uid)
         this.$router.push({ path: 'userlimit', query: { restaurant_id: row.uid }}) 

      },
      //获取批量数据
      handleSelectionChange(val) {
        let checkList = null
        for (let d = 0; d < val.length; d++) {
          checkList += val[d].uid + '-';
        }
          console.log(checkList)
          
        if (checkList !== null) {
          this.celientList = checkList.substring(4, checkList.length - 1)   
          console.log(this.celientList)
        }
      },
      celent_delet(index, row) {
        this.deletVisibleType = '0'
        this.DeletId = row.uid
        this.DeletTip = true
      },
      //批量删除
      deletList(){
        this.deletVisibleType = '1'
        this.DeletTip = true
      },
      //删除确认
      deletVisible() {
        const deletData = {}
        deletData.uid = this.DeletId
        deletData.status = '0' 
        deletUserList(deletData).then(res => {
          this.initData();
          this.DeletTip = false
        })
      },
      //批量删除确认
      deletVisibleList() {
        const deletCelientList = {}
        deletCelientList.uid = this.celientList
        deletCelientList.status = '0'
        deletUserList(deletCelientList).then(res => {
          this.initData();
          this.DeletTip = false
        })
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
  .celientFooter{
    display: flex;
    justify-content: space-between;
    margin-top: 3rem;
  }

</style>

