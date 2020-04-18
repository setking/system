<template>
<div>
    <!-- 查询 -->
    <div class="search_all">
      <div>
        <div class="search_listOne">
        <div class="filter-container">
          手机号:
          <el-input v-model="formData.uMobile" placeholder="请输入手机号" style="width: 200px;" class="filter-item" oninput = "value=value.replace(/[^\d]/g,'')" maxlength="11" />
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
      <!-- <div style="padding-top:.5rem;">
        <el-button v-waves class="filter-item search_items" type="primary" @click="search(formData)">
            查询
        </el-button>
      </div> -->
    </div>
    <div style="margin-top:1rem;margin-bottom:1rem;">
        <el-button v-show="recycles" v-waves class="filter-item search_items" type="primary" @click="recycle()">
            回收站
        </el-button>
        <el-button v-show="newList" v-waves class="filter-item search_items" type="primary" @click="createProject()">
            新建
        </el-button>
        <el-button v-show="deletMenu" @click="deletList()" type="primary">批量删除</el-button>
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
    <el-table-column  v-if="hideRow" prop="uid">
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
    <el-table-column align="center" label="操作" width="250">
      <template slot-scope="scope">
        <el-button
        v-show="editorData"
          type="primary"
          plain
          size="mini"
          @click="celent_edit(scope.$index, scope.row)">修改</el-button>
        <el-button
        v-show="showMenu"
          size="mini"
          type="primary"
          plain
          @click="celent_more(scope.$index, scope.row)">客户详情</el-button>
        <el-button
        v-show="deletMenu"
          type="danger"
          plain
          size="mini"
          @click="celent_delet(scope.$index, scope.row)">删除</el-button>
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
  <span>是否确认删除？ 删除后可到“回收站”查看并恢复被删除的信息?</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="DeletTip = false">取 消</el-button>
    <el-button v-show="deletVisibleType == '0'" type="primary" @click="deletVisible()">确 定</el-button>
    <el-button v-show="deletVisibleType == '1'" type="primary" @click="deletVisibleList()">确 定</el-button>
  </span>
</el-dialog>
<!-- 取消提示 -->
  <el-dialog
  title="取消提示"
  :visible.sync="editFormTip"
  width="30%">
  <span>取消后所编辑的信息将不被保存</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editFormTip = false">取 消</el-button>
    <el-button type="primary" @click="editFormQuery">确 定</el-button>
  </span>
</el-dialog>
<!-- 编辑 -->
<el-dialog title="编辑用户信息" :visible.sync="editForm" width="40rem">
  <el-form :model="form" label-position="right" label-width="10rem">
    <el-form-item label="上传头像：">
        <!-- action="http://192.168.1.20:8080/upload/uploadPicture" -->
      <el-upload
        accept=".png,.jpg,.jpeg"
        class="avatar-uploader"
        action="http://39.100.92.34:8081/jzb_houtai/upload/uploadPicture"
        
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>
    <el-form-item label="姓    名：">
    <el-input style="width:16rem" v-model="form.user" placeholder="请输入姓名"></el-input>
  </el-form-item>
  <el-form-item label="手机号：">
    <el-input style="width:16rem" v-model="form.Phone" placeholder="请输入手机号" oninput = "value=value.replace(/[^\d]/g,'')" maxlength="11"></el-input>
  </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="canceleditForm">取 消</el-button>

    <el-button v-show="editType == '0'" type="primary" @click="editFormData">确 定</el-button>
    <el-button v-show="editType == '1'" type="primary" @click="createForm">确 定</el-button>

  </div>
</el-dialog>
</div>

</template>

<script> 
import FileSave from 'file-saver' 
import {clientList, deletUserList, createClient, editClient, getClient} from '../../config/api' 
export default {
    name: 'userlist',
    data() {
      return { 
        deletVisibleType: null,
        editType: null,
        editForm: false,
        showMenu: true,
        recycles: true,
        newList: true,
        editorData: true,
        deletMenu: true,
        editFormTip: false,
        pageTotal: 1,
        hideRow: false,
        dialogVisible: false,//编辑信息显示隐藏
        addVisible: false,//增加信息显示隐藏
        listLoading: false,//加载效果显示隐藏
        selectTable: {},//编辑信息显
        addTable: {},//增加信息
        pageSize: 10,//分页每页展示条数 
        currpage: 1,//当前展示页码
        DeletTip: false,//删除提示
        DeletId: null,//删除的id
        celientDu: {},
        TEL_REGEXP: /^1[34578]\d{9}$/,
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
         form: {
          imageUrl: null,
          user: null,
          Phone: null,
        },
        tableList: [],//数据存储数组
        tableData:[],
        value: '',
        
      }
    },
    created() {
    this.initData()
  },
  activated() {
      this.func()
    },
    methods: {
      func() {
        this.listLoading = true
          const searchCount = {}
          const searchData = this.formData
                searchCount.start = '1'
                searchCount.pageSize = this.pageSize 
                searchCount.uType = "0"
                searchCount.useStatus = "0" 

                if (this.formData.uMobile !== null || undefined) {
                  searchCount.uMobile = this.formData.uMobile
                  
                }

                if (this.formData.projectCountMin !== null || undefined) {
                  searchCount.projectCountMin = this.formData.projectCountMin
                }

                if (this.formData.projectCountMax !== null || undefined) {
                  searchCount.projectCountMax = this.formData.projectCountMax
                }

                if (this.formData.value !== "" || undefined) {
                  searchCount.uSex = this.value 
                }

                if (this.formData.uNickName !== null || undefined) {
                  searchCount.uNickName = this.formData.uNickName
                }
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
      async initData() {
        let storyList = []
        storyList = sessionStorage.getItem("menuName")  
        let storyMenu = storyList.split(",") 
        if (!storyMenu.includes('客户管理-客户详情')) {
          this.showMenu = false    
        } 
        if (!storyMenu.includes('客户管理-回收站')) {
          this.recycles = false    
        }
        if (!storyMenu.includes('客户管理-新建')) {
          this.newList = false    
        }
        if (!storyMenu.includes('客户管理-修改')) {
          this.editorData = false    
        }
        if (!storyMenu.includes('客户管理-删除')) {
          this.deletMenu = false    
        }
        const CurrentList = {}
        CurrentList.start = this.currpage
        CurrentList.pageSize = this.pageSize
        CurrentList.uType = "0"
        CurrentList.useStatus = "0" 
        const celentUserList = clientList(CurrentList)
        await celentUserList.then(res => {
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
        this.pageSize = val;
          console.log(`每页 ${val} 条`);
          const currSize = {}
          currSize.start = this.currpage
          currSize.pageSize = val
          currSize.uType = "0"
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
          this.listLoading = true
          const searchCount = {}
          const searchData = this.formData
                searchCount.start = '1'
                searchCount.pageSize = this.pageSize 
                searchCount.uType = "0"
                searchCount.useStatus = "0" 

                if (this.formData.uMobile !== null || undefined) {
                  searchCount.uMobile = this.formData.uMobile
                  
                }

                if (this.formData.projectCountMin !== null || undefined) {
                  searchCount.projectCountMin = this.formData.projectCountMin
                }

                if (this.formData.projectCountMax !== null || undefined) {
                  searchCount.projectCountMax = this.formData.projectCountMax
                }

                if (this.formData.value !== "" || undefined) {
                  searchCount.uSex = this.value 
                }

                if (this.formData.uNickName !== null || undefined) {
                  searchCount.uNickName = this.formData.uNickName
                }
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
      
      recycle() {
          this.$router.push({ path: 'userlistRecycle'}) 
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
      //删除
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
        deletData.status = '2'
        deletUserList(deletData).then(res => {
          this.initData();
          this.DeletTip = false
        })
      },
      //批量删除确认
      deletVisibleList() {
        const deletCelientList = {}
        deletCelientList.uid = this.celientList
        deletCelientList.status = '2'
        deletUserList(deletCelientList).then(res => {
          this.initData();
          this.DeletTip = false
        })
      },
      celent_edit(index, row){
        this.$router.push({ path: 'checkuserlist', query: { restaurant_id: row.uid }}) 
        // this.editType = '0'
        // console.log(row.uid)
        // this.celientDu.uid = row.uid
        // getClient(this.celientDu).then(res => {
        //   this.form.imageUrl = res.uHeadImg
        //   this.form.Phone = res.uMobile
        //   this.form.user = res.uNickName
        // })
        // this.editForm = true
      },
      editFormData() {
        const formCre = {}
        formCre.uid = this.celientDu.uid
        formCre.uMobile = this.form.Phone
        formCre.uNickName = this.form.user
        formCre.uHeadImg = this.form.imageUrl
        if (this.form.imageUrl == "" || this.form.user == "") {
          this.$message({
          message: '请填写完成',
          type: 'warning'
        });
        }  else if (!(this.TEL_REGEXP.test(this.form.Phone))) {  
            this.$message.error('请输入正确的手机号！');
          } else {
        editClient(formCre).then(res => {
          console.log(res)
          this.form.Phone = null;
          this.form.user = null;
          this.form.imageUrl = null;
          this.initData()
          this.editForm = false 
        })
        }
      },
      createProject() {
        // this.editType = '1'
        // this.editForm = true
        this.$router.push({ path: 'newUserList'}) 
      },
      createForm() {
        const formCre = {}
        formCre.uMobile = this.form.Phone
        formCre.uType = '0'
        formCre.uNickName = this.form.user
        formCre.uSex = '1'
        formCre.uHeadImg = this.form.imageUrl
        if (this.form.imageUrl == null || this.form.user == null) {
          this.$message({
          message: '请填写完成',
          type: 'warning'
        });
        }  else if (!(this.TEL_REGEXP.test(this.form.Phone))) {   
            this.$message.error('请输入正确的手机号！');
          } else {
          createClient(formCre).then(ret => {
            console.log(ret);
            this.form.Phone = null;
            this.form.user = null
            this.form.imageUrl = null
            this.initData()
            this.editForm = false
          })

        }
      },
      canceleditForm() {
        this.editFormTip = true
      },
      editFormQuery() {
          this.form.Phone = null;
          this.form.user = null
          this.form.imageUrl = null
        this.editForm = false
        this.editFormTip = false
      },

      handleAvatarSuccess(res, file) {
        this.form.imageUrl = URL.createObjectURL(file.raw);
      },
      // 图片删除
      beforeAvatarUpload(file) {
        console.log(file.type)
        const isJPG = file.type === 'image/jpg' || 'image/png' || 'image/jpeg';

        if (!isJPG) {
          this.$message.error('上传头像图片格式错误!');
        }
        return isJPG;
      }
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
    align-items: center;
    margin-bottom: 20px;
  }

</style>

