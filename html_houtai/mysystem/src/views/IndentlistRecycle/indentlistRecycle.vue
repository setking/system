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
      <div class="filter-container">
        <el-button style="float:right;" @click="$router.back(-1)" plain>上一页</el-button>
      </div>
      <!-- <div class="searchBtn">
          <el-button v-waves class="filter-item search_items" type="primary" @click="search(formData)">
            查询
        </el-button>
        <el-button @click="$router.back(-1)" type="success">返回</el-button>
      </div>-->
    </div>

    <div>
      <br />
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
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="mini"
            plain
            @click="celent_delet(scope.$index, scope.row)"
          >恢复</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="celientFooter">
      <div></div>
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
          :total="pageTotal"
        ></el-pagination>
      </div>
    </div>
    <!-- 删除提示 -->
    <el-dialog title="提示" :visible.sync="DeletTip" width="30%">
      <span>是否确认恢复？ 恢复信息后可到“项目列表”查看并编辑被恢复的信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="DeletTip = false">取 消</el-button>
        <el-button v-show="deletVisibleType == '0'" type="primary" @click="deletVisible()">确 定</el-button>
        <el-button v-show="deletVisibleType == '1'" type="primary" @click="deletVisibleList()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FileSave from "file-saver";
import { zbProject, deletIndentList } from "../../config/api";
export default {
  inject: ["reload"],
  data() {
    return {
      DeletTip: false, //删除提示
      showPage: true,
      showMenu: true,
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
      celientList: null,
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
      ]
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      const CurrentList = {};
      CurrentList.start = this.currpage;
      CurrentList.pageSize = this.pageSize;
      CurrentList.useStatus = "2";
      const celentUserList = zbProject(CurrentList);
      celentUserList.then(res => {
        this.pageTotal = res.pageTotal;
        this.tableList = res.result;
        console.log(res);
      });
    },
    testPhone() {
      let TEL_REGEXP = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/;
      if (
        this.formData.clientidPhone == "" ||
        this.formData.clientidPhone.length < 11 ||
        this.formData.clientidPhone.test(TEL_REGEXP)
      ) {
        this.$message.error("手机号格式不正确");
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
      const currSize = {};
      currSize.start = this.currpage;
      currSize.pageSize = val;
      currSize.useStatus = "2";
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
      currIndex.useStatus = "2";
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
      searchCount.useStatus = "2";

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
    celent_delet(index, row) {
      this.deletVisibleType = "0";
      this.DeletId = row.projectid;
      this.DeletTip = true;
    },
    deletVisible() {
      const deletData = {};
      deletData.pid = this.DeletId;
      deletData.status = "0";
      deletIndentList(deletData).then(res => {
        this.initData();
        this.DeletTip = false;
      });
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
    //批量删除
    deletList() {
      this.deletVisibleType = "1";
      this.DeletTip = true;
    },
    deletVisibleList() {
      const deletCelientList = {};
      deletCelientList.pid = this.celientList;
      deletCelientList.status = "0";
      deletIndentList(deletCelientList).then(res => {
        this.initData();
        this.DeletTip = false;
      });
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
.celientFooter {
  display: flex;
  justify-content: space-between;
  margin-top: 3rem;
}

.href_items {
  margin-top: 2rem;
}
.searchBtn {
  padding-top: 0.5rem;
  width: 15rem;
}
.celent_pagination {
  float: right;
}
</style>

