<template>
<div>
    <!-- 查询 -->
    <div class="search_all">
      <div>
              <div class="search_listOne">
        <div class="filter-container">
          手机号:
          <el-input v-model="formData.uMobile" placeholder="请输入手机号" style="width: 200px;" class="filter-item"  oninput = "value=value.replace(/[^\d]/g,'')" maxlength="11" />
        </div> 
        <div class="filter-container">
          姓名:
          <el-input v-model="formData.uNickName" placeholder="请输入姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="search(formData)" />
        </div> 
        <!-- <div class="filter-container">
          性别:
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>  -->
        <div class="filter-container">
          <el-button v-waves class="filter-item search_items" type="primary" @click="search()">
            查询
        </el-button>
        </div> 
        
        <!-- <div class="filter-container">
          状态:
          <el-select v-model="auditorValue" placeholder="请选择">
            <el-option
              v-for="item in auditor"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select> 
        </div> -->
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
              <span class="demonstration"> 添加时间:</span>
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
      </div> 
      </div>
      <!-- <div style="padding-top:.5rem;">
          <el-button v-show="recycles" v-waves class="filter-item search_items" type="primary" @click="recycle()">
            回收站
            </el-button><br><br> 
          <el-button v-waves class="filter-item search_items" type="primary" @click="search()">
            查询
        </el-button>
      </div> -->
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
    style="width: 100%">
    <el-table-column
     v-if="hideRow"
      prop="uid"
    >
    </el-table-column>
    <el-table-column
    align="center"
      prop="sortNumer"
      label="序号"
    >
    </el-table-column>
    
    <el-table-column
    align="center"
      prop="uRealName"
      label="姓名">
    </el-table-column>
    <el-table-column align="center" prop="uMobile" label="手机号" width="180">
    </el-table-column>
    <!-- <el-table-column align="center" label="性别" width="180">
      <template slot-scope="scope">
          <p>{{ scope.row.uSex == '0'? '女' : '男' }}</p>
      </template>
    </el-table-column> -->
    <el-table-column
    align="center"
      prop="projectCount"
      label="项目数量"
      >
    </el-table-column>
    <el-table-column
    align="center"
      prop="createTime"
      label="添加时间">
    </el-table-column> 
        <!-- <el-table-column 
    align="center"
      label="状态">
      <template slot-scope="scope">
            <el-button size="mini" v-if="scope.row.useStatus == '0'" type="success">可用</el-button>
            <el-button size="mini" v-if="scope.row.useStatus == '1'"  type="info">禁用</el-button>
      </template>
    </el-table-column>  -->
    <el-table-column align="center" label="操作">
      <template slot-scope="scope"> 
        <el-button
        v-show="showEdit"
          size="mini"
          type="primary"
          plain
          @click="celent_more(scope.$index, scope.row)">设计师详情</el-button>
        <!-- <el-button
        v-show="deletMenu" 
          type="danger"
          size="mini"
          @click="celent_delet(scope.$index, scope.row)">删除</el-button> -->
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
    :total="pageTotal">
  </el-pagination>
<!-- 删除提示 -->
  <el-dialog
  title="删除提示"
  :visible.sync="DeletTip"
  width="30%">
  <span>您确定要删除这条信息吗?</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="DeletTip = false">取 消</el-button>
    <el-button type="primary" @click="deletVisible()">确 定</el-button>
  </span>
</el-dialog>
</div>

</template>

<script> 
import FileSave from 'file-saver' 
import XLSX from 'xlsx'
import {designerList, deletDesigner} from '../../config/api'
export default {
    name: 'administratorsettings',
    data() {
      return {
        showEdit: true,
        hideRow: false,
        pageTotal: 1,
        deletMenu: true,//删除权限
        recycles: true,//回收站权限
        dialogVisible: false,//编辑信息显示隐藏
        addVisible: false,//增加信息显示隐藏
        listLoading: false,//加载效果显示隐藏
        selectTable: {},//编辑信息显
        DeletTip: false,//删除提示
        DeletId: null,//删除的id
        addTable: {},//增加信息
        pageSize: 10,//分页每页展示条数
        currpage: 1,//当前展示页码
        num8: 1,
        num9: 1,
        TEL_REGEXP: /^1[34578]\d{9}$/,
        formData: { //表单查询
            uMobile: null,
            uNickName: null,
            projectCountMin: 0,
            projectCountMax: 0,
            value6: '',
        },
        tableList: [],//数据存储数组
        tableData: [],
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
            ],
        auditor: [
              {
                value: '1',
                label: '可用'
              },
              {
                value: '0',
                label: '禁用'
              }
            ],
        value: '',
        auditorValue: null,  
      }
    },
    created() {
    this.initData();
  },
    activated() {
      this.func()
    },
    methods: {
      func() {
          const searchCount = {}
          const searchData = this.formData
                searchCount.start = '1'
                searchCount.pageSize = this.pageSize 
                searchCount.useStatus = "0"

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
                if (this.auditorValue !== null) { 
                  searchCount.useStatus = this.auditorValue
                }
                console.log(this.formData.value6)
                if (this.formData.value6 !== undefined) {
                  if(this.formData.value6 !== null){
                    searchCount.createTimeStart = this.formData.value6[0]
                    searchCount.createTimeEnd = this.formData.value6[1]

                  }
                }
                
                console.log(searchCount)


          const sortList = designerList(searchCount)
              sortList.then(res => {
                this.tableList = res.result
                this.pageTotal = res.pageTotal
                this.currpage = 1
                console.log( this.tableList)
            })      
      },
      initData() {
         let storyList = []
        storyList = sessionStorage.getItem("menuName")  
        let storyMenu = storyList.split(",") 
        console.log("story数据", storyMenu)
        if (!storyMenu.includes('设计师-设计师详情')) {
          this.showEdit = false     
        }
        if (!storyMenu.includes('设计师-回收站')) {
          this.recycles = false     
        }
        if (!storyMenu.includes('设计师-删除')) {
          this.deletMenu = false     
        }
        console.log(" this.uKName",  this.uKName)
        const CurrentList = {}
        CurrentList.start = this.currpage
        CurrentList.pageSize = this.pageSize
        CurrentList.useStatus = "0" 
        const celentUserList = designerList(CurrentList)
        celentUserList.then(res => {
          console.log(res)
          this.pageTotal = res.pageTotal
          this.tableList = res.result
            this.listLoading = false
        })
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
          currSize.useStatus = "0" 
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
                if (this.auditorValue !== null) { 
                  currSize.useStatus = this.auditorValue
                }
                console.log(this.formData.value6)
                if (this.formData.value6 !== undefined) {
                  if(this.formData.value6 !== null){
                    currSize.createTimeStart = this.formData.value6[0]
                    currSize.createTimeEnd = this.formData.value6[1]

                  }
                }
          designerList(currSize).then(res => {
            this.tableList = res.result
          })
        this.pageSize = val;
          console.log(`每页 ${val} 条`);
        },
      handleCurrentChange(val) {
        const currIndex = {}
          currIndex.start = val
          currIndex.pageSize = this.pageSize
          currIndex.useStatus = "0" 
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
                if (this.auditorValue !== null) { 
                  currIndex.useStatus = this.auditorValue
                }
                console.log(this.formData.value6)
                if (this.formData.value6 !== undefined) {
                  if(this.formData.value6 !== null){
                    currIndex.createTimeStart = this.formData.value6[0]
                    currIndex.createTimeEnd = this.formData.value6[1]

                  }
                }
          designerList(currIndex).then(res => {
            this.tableList = res.result
          })
          this.currpage = val;
          console.log(`当前页: ${val}`);
        },
      //查询
      search() {
          this.listLoading = true
          const searchCount = {}
          const searchData = this.formData
                searchCount.start = '1'
                searchCount.pageSize = this.pageSize 
                searchCount.useStatus = "0"

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
                if (this.auditorValue !== null) { 
                  searchCount.useStatus = this.auditorValue
                }
                console.log(this.formData.value6)
                if (this.formData.value6 !== undefined) {
                  if(this.formData.value6 !== null){
                    searchCount.createTimeStart = this.formData.value6[0]
                    searchCount.createTimeEnd = this.formData.value6[1]

                  }
                }
                
                console.log(searchCount)


          const sortList = designerList(searchCount)
              sortList.then(res => {
                this.tableList = res.result
                this.pageTotal = res.pageTotal
                this.currpage = 1
                console.log( this.tableList)
            }) 
            this.listLoading = false
      },
      // recycle() { 
      //     this.$router.push({ path: 'administratorSettingsRecycle'}) 
      // },
      celent_more(index, row) {
         this.$router.push({ path: 'designerDetails', query: { restaurant_id: row.uid }})

      },
      // celent_delet(index, row) {
      //   this.DeletId = row.uid
      //   this.DeletTip = true
      // },
      // deletVisible() {
      //   const deletData = {}
      //   deletData.uid = this.DeletId
      //   deletData.status = '2'
      //   deletDesigner(deletData).then(res => { 
      //     this.initData();
      //     this.DeletTip = false
      //   })
      // }
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

