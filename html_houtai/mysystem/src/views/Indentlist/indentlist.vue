<template>
  <div>
    <!-- 查询 -->
    <div class="search_all">
      <div>
        <div class="search_listOne">
          <div class="filter-container">
            项目名称:
            <el-input
              v-model="formData.projectName"
              placeholder="请输入项目名称"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="search(formData)"
            />
          </div>
          <div class="filter-container">
            客户:
            <el-input
              v-model="formData.clientidName"
              placeholder="请输入客户姓名"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="search(formData)"
            />
          </div>
          <div class="filter-container">
            工长:
            <el-input
              v-model="formData.foremanName"
              placeholder="请输入工长姓名"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="search(formData)"
            />
          </div>
          <div class="filter-container">
            设计师:
            <el-input
              v-model="formData.designerName"
              placeholder="请输入设计师姓名"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="search(formData)"
            />
          </div>

          <div class="filter-container">
            <el-button
              v-waves
              class="filter-item search_items"
              type="primary"
              @click="search(formData)"
            >查询</el-button>
          </div>
        </div>
        <div class="search_listOne">
          <div class="filter-container">
            工程部:
            <el-input
              v-model="formData.engineerName"
              placeholder="请输入工程部名称"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="search(formData)"
            />
          </div>
          <div class="filter-container">
            项目状态:
            <el-select v-model="formData.projectStatus" placeholder="请选择">
              <el-option
                v-for="item in projectType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="filter-container">
            客户电话:
            <el-input
              v-model="formData.clientidPhone"
              placeholder="请输入手机号"
              style="width: 200px;"
              class="filter-item"
              oninput="value=value.replace(/[^\d]/g,'')"
              maxlength="11"
            />
          </div>
          <div class="filter-container">
            <div class="block">
              <span class="demonstration">开始时间:</span>
              <el-date-picker
                v-model="formData.value6"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="elBtnSearch">
        <el-button
          v-waves
          class="filter-item search_items"
          type="primary"
          @click="search(formData)"
        >查询</el-button>
      </div>-->
    </div>
    <div style="margin-top:1rem;margin-bottom:1rem;">
      <el-button
        v-show="recycles"
        v-waves
        class="filter-item search_items"
        type="primary"
        @click="recycle()"
      >回收站</el-button>
      <el-button v-show="showPage" @click="launchProject()" class="href_items" type="primary">新建</el-button>
      <el-button v-show="deletMenu" @click="deletList()" type="primary">批量删除</el-button>
    </div>

    <!-- 列表 -->
    <el-table
      id="out-table"
      v-loading="listLoading"
      ref="multipleTable"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
      :data="tableList"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="projectid" v-if="hideRow"></el-table-column>
      <el-table-column align="center" prop="sortNumer" label="序号"></el-table-column>
      <el-table-column align="center" prop="projectName" label="项目名称"></el-table-column>
      <el-table-column align="center" prop="clientid1Name" label="客户1"></el-table-column>
      <el-table-column align="center" prop="clientid1Phone" label="客户1电话"></el-table-column>
      <el-table-column align="center" prop="clientid2Name" label="客户2"></el-table-column>
      <el-table-column align="center" prop="clientid2Phone" label="客户2电话"></el-table-column>

      <el-table-column align="center" prop="designerName" label="设计师"></el-table-column>
      <el-table-column align="center" prop="foremanName" label="工长"></el-table-column>
      <el-table-column align="center" prop="engineerName" label="工程部"></el-table-column>
      <el-table-column align="center" prop="createTimeStart" label="项目开始时间"></el-table-column>
      <el-table-column align="center" prop="projectStatus" label="状态"></el-table-column>
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <el-button
            v-show="editorData"
            type="primary"
            plain
            size="mini"
            @click="celent_edit(scope.$index, scope.row)"
          >修改</el-button>
          <el-button
            v-show="showMenu"
            size="mini"
            type="primary"
            plain
            @click="celent_more(scope.$index, scope.row)"
          >项目详情</el-button>
          <el-button
            v-show="deletMenu"
            type="danger"
            plain
            size="mini"
            @click="celent_delet(scope.$index, scope.row)"
          >删除</el-button>
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
      :total="pageTotal"
    ></el-pagination>

    <!-- 删除提示 -->
    <el-dialog title="删除提示" :visible.sync="DeletTip" width="30%">
      <span>是否确认删除？ 删除后可到“回收站”查看并恢复被删除的信息?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="DeletTip = false">取 消</el-button>
        <el-button v-show="deletVisibleType == '0'" type="primary" @click="deletVisible()">确 定</el-button>
        <el-button v-show="deletVisibleType == '1'" type="primary" @click="deletVisibleList()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 取消提示 -->
    <el-dialog title="取消提示" :visible.sync="editFormTip" width="30%">
      <span>取消后所编辑的信息将不被保存</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editFormTip = false">取 消</el-button>
        <el-button type="primary" @click="editFormQuery">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog title="编辑用户信息" :visible.sync="editForm" width="40rem">
      <el-form :model="form" label-position="right" label-width="10rem">
        <el-form-item label="项目名称">
          <el-input style="width:16rem" v-model="form.projectName" placeholder="请输入项目名称"></el-input>
        </el-form-item>
        <el-form-item label="开始时间">
          <div class="block">
            <el-date-picker
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="form.value1"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="项目地址">
          <el-input style="width:16rem" v-model="form.projectLocal" placeholder="请输入项目地址"></el-input>
        </el-form-item>
        <el-form-item label="合同图片">
          <!-- action="http://192.168.1.20:8080/upload/uploadPicture" -->
          <el-upload
            accept=".png, .jpg, .jpeg, .pdf"
            class="avatar-uploader"
            action="http://39.100.92.34:8081/jzb_houtai/upload/uploadPicture"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="canceleditForm">取 消</el-button>

        <el-button type="primary" @click="editFormData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import FileSave from "file-saver";
import { zbProject, deletIndentList, updateProject } from "../../config/api";
export default {
  name: "indentlist",
  data() {
    return {
      deletVisibleType: null,
      editForm: false,
      showMenu: true,
      editFormTip: false,
      DeletTip: false, //删除提示
      showPage: true, //新建权限
      recycles: true, //回收站权限
      editorData: true, //修改权限
      deletMenu: true, //删除权限
      pageTotal: 1,
      DeletId: null, //删除的id
      hideRow: false,
      restaurant_id: 1,
      dialogVisible: false, //编辑信息显示隐藏
      addVisible: false, //增加信息显示隐藏
      listLoading: false, //加载效果显示隐藏
      pageSize: 10, //分页每页展示条数
      currpage: 1, //当前展示页码
      num8: 1,
      num9: 1,
      projectRowId: null,
      celientList: null,
      TEL_REGEXP: /^1[34578]\d{9}$/,
      formData: {
        //表单查询
        projectName: "",
        clientidName: "",
        foremanName: "",
        designerName: "",
        engineerName: "",
        projectStatus: "",
        clientidPhone: "",
        value6: ""
      },
      tableList: [], //数据存储数组
      tableData: [], //模拟数据

      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "1",
          label: "男"
        },
        {
          value: "0",
          label: "女"
        }
      ],
      projectType: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "0",
          label: "待开工"
        },
        {
          value: "1",
          label: "进行中"
        },
        {
          value: "2",
          label: "竣工"
        }
      ],
      form: {
        projectName: null,
        value1: null,
        projectLocal: null,
        imageUrl: null
      }
    };
  },
  created() {
    this.initData();
  },
  activated() {
    this.func();
  },
  methods: {
    func() {
      this.listLoading = true;
      const searchCount = {};
      searchCount.start = "1";
      searchCount.pageSize = this.pageSize;
      searchCount.uType = "0";
      searchCount.useStatus = "0";

      if (this.formData.projectName !== "") {
        searchCount.projectName = this.formData.projectName;
      }

      if (this.formData.clientidName !== "") {
        searchCount.clientid1Name = this.formData.clientidName;
      }
      if (this.formData.foremanName !== "") {
        searchCount.foremanName = this.formData.foremanName;
      }
      if (this.formData.designerName !== "") {
        searchCount.designerName = this.formData.designerName;
      }
      if (this.formData.engineerName !== "") {
        searchCount.engineerName = this.formData.engineerName;
      }
      if (this.formData.projectStatus !== "") {
        searchCount.projectStatus = this.formData.projectStatus;
      }
      if (this.formData.clientidPhone !== "") {
        searchCount.clientid1Phone = this.formData.clientidPhone;
      }
      if (this.formData.value6 !== undefined) {
        if (this.formData.value6 !== null) {
          searchCount.createTimeStart = this.formData.value6[0];
          searchCount.createTimeEnd = this.formData.value6[1];
        }
      }

      console.log(searchCount);

      const sortList = zbProject(searchCount);
      let usDataList = [];
      sortList.then(res => {
        this.tableList = res.result;
        this.pageTotal = res.pageTotal;
        this.currpage = 1;
        console.log(this.tableList);
      });
      this.listLoading = false;
    },
    initData() {
      let storyList = [];
      storyList = sessionStorage.getItem("menuName");
      let storyMenu = storyList.split(",");
      if (!storyMenu.includes("项目管理-项目详情")) {
        this.showMenu = false;
      }
      if (!storyMenu.includes("项目管理-新建")) {
        this.showPage = false;
      }
      if (!storyMenu.includes("项目管理-回收站")) {
        this.recycles = false;
      }
      if (!storyMenu.includes("项目管理-修改")) {
        this.editorData = false;
      }
      if (!storyMenu.includes("项目管理-删除")) {
        this.deletMenu = false;
      }
      const CurrentList = {};
      CurrentList.start = this.currpage;
      CurrentList.pageSize = this.pageSize;
      CurrentList.useStatus = "0";
      const celentUserList = zbProject(CurrentList);
      celentUserList.then(res => {
        this.pageTotal = res.pageTotal;
        this.tableList = res.result;
        console.log(res);
      });
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
      const currSize = {};
      currSize.start = this.currpage;
      currSize.pageSize = val;
      currSize.useStatus = "0";
      if (this.formData.projectName !== "") {
        currSize.projectName = this.formData.projectName;
      }

      if (this.formData.clientidName !== "") {
        currSize.clientid1Name = this.formData.clientidName;
      }
      if (this.formData.foremanName !== "") {
        currSize.foremanName = this.formData.foremanName;
      }
      if (this.formData.designerName !== "") {
        currSize.designerName = this.formData.designerName;
      }
      if (this.formData.engineerName !== "") {
        currSize.engineerName = this.formData.engineerName;
      }
      if (this.formData.projectStatus !== "") {
        currSize.projectStatus = this.formData.projectStatus;
      }
      if (this.formData.clientidPhone !== "") {
        currSize.clientid1Phone = this.formData.clientidPhone;
      }
      if (this.formData.value6 !== undefined) {
        if (this.formData.value6 !== null) {
          currSize.createTimeStart = this.formData.value6[0];
          currSize.createTimeEnd = this.formData.value6[1];
        }
      }
      zbProject(currSize).then(res => {
        this.tableList = res.result;
      });
      this.pageSize = val;
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      const currIndex = {};
      currIndex.start = val;
      currIndex.pageSize = this.pageSize;
      currIndex.useStatus = "0";

      if (this.formData.projectName !== "") {
        currIndex.projectName = this.formData.projectName;
      }

      if (this.formData.clientidName !== "") {
        currIndex.clientid1Name = this.formData.clientidName;
      }
      if (this.formData.foremanName !== "") {
        currIndex.foremanName = this.formData.foremanName;
      }
      if (this.formData.designerName !== "") {
        currIndex.designerName = this.formData.designerName;
      }
      if (this.formData.engineerName !== "") {
        currIndex.engineerName = this.formData.engineerName;
      }
      if (this.formData.projectStatus !== "") {
        currIndex.projectStatus = this.formData.projectStatus;
      }
      if (this.formData.clientidPhone !== "") {
        currIndex.clientid1Phone = this.formData.clientidPhone;
      }
      if (this.formData.value6 !== undefined) {
        if (this.formData.value6 !== null) {
          currIndex.createTimeStart = this.formData.value6[0];
          currIndex.createTimeEnd = this.formData.value6[1];
        }
      }
      zbProject(currIndex).then(res => {
        this.tableList = res.result;
      });
      this.currpage = val;
      console.log(`当前页: ${val}`);
    },
    //查询
    search() {
      this.listLoading = true;
      const searchCount = {};
      searchCount.start = "1";
      searchCount.pageSize = this.pageSize;
      searchCount.uType = "0";
      searchCount.useStatus = "0";

      if (this.formData.projectName !== "") {
        searchCount.projectName = this.formData.projectName;
      }

      if (this.formData.clientidName !== "") {
        searchCount.clientid1Name = this.formData.clientidName;
      }
      if (this.formData.foremanName !== "") {
        searchCount.foremanName = this.formData.foremanName;
      }
      if (this.formData.designerName !== "") {
        searchCount.designerName = this.formData.designerName;
      }
      if (this.formData.engineerName !== "") {
        searchCount.engineerName = this.formData.engineerName;
      }
      if (this.formData.projectStatus !== "") {
        searchCount.projectStatus = this.formData.projectStatus;
      }
      if (this.formData.clientidPhone !== "") {
        searchCount.clientid1Phone = this.formData.clientidPhone;
      }
      if (this.formData.value6 !== undefined) {
        if (this.formData.value6 !== null) {
          searchCount.createTimeStart = this.formData.value6[0];
          searchCount.createTimeEnd = this.formData.value6[1];
        }
      }

      console.log(searchCount);

      const sortList = zbProject(searchCount);
      let usDataList = [];
      sortList.then(res => {
        this.tableList = res.result;
        this.pageTotal = res.pageTotal;
        this.currpage = 1;
        console.log(this.tableList);
      });
      this.listLoading = false;
    },
    recycle() {
      this.$router.push({ path: "indentlistRecycle" });
    },
    celent_more(index, row) {
      console.log(row.projectid);
      this.$router.push({
        path: "projectDetails",
        query: { restaurant_id: row.projectid }
      });
    },
    celent_edit(index, row) {
      this.$router.push({
        path: "checkIndentlist",
        query: { restaurant_id: row.projectid }
      });
      // console.log(row.projectid)
      // this.projectRowId = row.projectid
      // const projectRow = {}
      // projectRow.projectid = this.projectRowId
      // projectRow.start = '1'
      // projectRow.pageSize = '10'
      // projectRow.useStatus = '0'
      // zbProject(projectRow).then(res => {
      //   this.form.projectName = res.result[0].projectName
      //   this.form.value1 = res.result[0].createTimeStart
      //   this.form.projectLocal = res.result[0].projectAddr
      //   this.form.imageUrl = res.result[0].projectContract
      //   console.log(res.result[0])
      // })
      // this.editForm = true
    },
    launchProject() {
      this.$router.push({ path: "decorateDetails" });
    },
    //获取批量数据
    handleSelectionChange(val) {
      let checkList = null;
      for (let d = 0; d < val.length; d++) {
        checkList += val[d].projectid + "-";
      }
      console.log(checkList);

      if (checkList !== null) {
        this.celientList = checkList.substring(4, checkList.length - 1);
        console.log(this.celientList);
      }
    },
    //删除
    celent_delet(index, row) {
      this.deletVisibleType = "0";
      this.DeletId = row.projectid;
      this.DeletTip = true;
    },
    //批量删除
    deletList() {
      this.deletVisibleType = "1";
      this.DeletTip = true;
    },
    //删除确认
    deletVisible() {
      const deletData = {};
      deletData.pid = this.DeletId;
      deletData.status = "2";
      deletIndentList(deletData).then(res => {
        this.initData();
        this.DeletTip = false;
      });
    },
    //批量删除确认
    deletVisibleList() {
      const deletCelientList = {};
      deletCelientList.pid = this.celientList;
      deletCelientList.status = "2";
      deletIndentList(deletCelientList).then(res => {
        this.initData();
        this.DeletTip = false;
      });
    },
    handleAvatarSuccess(res, file) {
      this.form.imageUrl = URL.createObjectURL(file.raw);
    },
    editFormData() {
      const formCre = {};
      formCre.projectid = this.projectRowId;
      formCre.projectName = this.form.projectName;
      formCre.createTimeStart = this.form.value1;
      formCre.projectAddr = this.form.projectLocal;
      formCre.projectContract = this.form.imageUrl;
      console.log(this.form);
      if (
        this.form.projectName == "" ||
        this.form.value1 == "" ||
        this.form.projectLocal == "" ||
        this.form.imageUrl == ""
      ) {
        this.$message({
          message: "请填写完成",
          type: "warning"
        });
      } else {
        updateProject(formCre).then(ret => {
          this.initData();
          this.editForm = false;
        });
      }
    },
    canceleditForm() {
      this.editFormTip = true;
    },
    editFormQuery() {
      this.editForm = false;
      this.editFormTip = false;
    }
  }
};
</script>
<style scoped>
#out-table {
  margin-top: 30px;
}
.filter-container {
  margin-top: 20px;
  margin-left: 1rem;
}
.search_listOne {
  width: 100%;
  display: flex;
}
</style>

