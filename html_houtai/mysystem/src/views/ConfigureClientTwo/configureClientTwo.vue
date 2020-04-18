<template>
  <div>
    <!-- 查询 -->
    <div class="search_all">
      <div>
        <div class="search_listOne">
          <div class="filter-container">
            手机号:
            <el-input
              v-model="formData.uMobile"
              placeholder="请输入手机号"
              style="width: 200px;"
              oninput="value=value.replace(/[^\d]/g,'')"
              class="filter-item"
            />
          </div>
          <div class="filter-container">
            姓名:
            <el-input
              v-model="formData.uNickName"
              placeholder="请输入姓名"
              style="width: 200px;"
              class="filter-item"
            />
          </div>
          <div class="filter-container">
            性别:
            <el-select v-model="formData.value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="filter-container">
            <el-button
              style="float:right;margin-left:1rem;margin-right:1rem;"
              @click="$router.back(-1)"
              plain
            >上一页</el-button>
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
            项目数量:
            <el-input-number
              v-model="formData.projectCountMin"
              controls-position="right"
              @change="handleChange"
              :min="0"
              :max="Infinity"
            ></el-input-number>
          </div>
          <div class="filter-container">
            ——
            <el-input-number
              v-model="formData.projectCountMax"
              controls-position="right"
              @change="handleChange"
              :min="0"
              :max="Infinity"
            ></el-input-number>
          </div>
          <div class="filter-container">
            <div class="block">
              <span class="demonstration">注册时间:</span>
              <el-date-picker
                value-format="yyyy-MM-dd HH:mm:ss"
                v-model="formData.value6"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </div>
          </div>
        </div>
      </div>
      <!-- <div>
        <el-button style="float:right;margin-left:1rem;margin-right:1rem;" @click="$router.back(-1)" type="success">返回</el-button>
          <el-button v-waves class="filter-item search_items" type="primary" @click="search(formData)">
            查询
        </el-button>
      </div>-->
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
      style="width: 100%"
    >
      <el-table-column prop="uid" v-if="showRow"></el-table-column>
      <el-table-column prop="sortNumer" label="序号"></el-table-column>
      <el-table-column prop="uRealName" label="姓名"></el-table-column>
      <el-table-column prop="uMobile" label="手机号"></el-table-column>
      <el-table-column label="性别">
        <template slot-scope="scope">
          <p>{{ scope.row.uSex === '0'? '女' : '男' }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="projectCount" label="项目数量"></el-table-column>
      <el-table-column prop="createTime" label="注册时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            @click="celent_more(scope.$index, scope.row)"
          >加入项目</el-button>
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
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import FileSave from "file-saver";
import { addClient } from "../../config/api";
export default {
  name: "configureClientTwo",
  data() {
    return {
      pageTotal: 1,
      showRow: false,
      dialogVisible: false, //编辑信息显示隐藏
      addVisible: false, //增加信息显示隐藏
      listLoading: false, //加载效果显示隐藏
      selectTable: {}, //编辑信息显
      addTable: {}, //增加信息
      pageSize: 10, //分页每页展示条数
      currpage: 1, //当前展示页码
      num8: 1,
      num9: 1,
      formData: {
        //表单查询
        uMobile: "",
        uNickName: "",
        projectCountMin: 0,
        projectCountMax: 0,
        value: "",
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
      clientid1Name: null
    };
  },
  created() {
    this.initDataList();
  },
  activated() {
    this.clientid1Name = this.$store.state.nickName;
  },
  computed: {
    ...mapGetters(["getNIckName"])
  },
  watch: {
    getNIckName: function(li) {
      //li就是改变后的wifiList值
      this.clientid1Name = li;
      console.log("改变", li);
    }
  },
  methods: {
    initDataList() {
      const CurrentList = {};
      CurrentList.start = this.currpage;
      CurrentList.pageSize = this.pageSize;
      CurrentList.uType = "0";
      CurrentList.useStatus = "0";
      console.log(CurrentList);
      const addCelentUserList = addClient(CurrentList);
      addCelentUserList
        .then(res => {
          console.log("res", res);
          this.pageTotal = res.pageTotal;
          this.tableList = res.result;
          this.listLoading = false;
        })
        .catch(err => {
          console.log("数据获取错误");
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
      currSize.uType = "0";
      if (this.formData.uMobile !== "") {
        currSize.uMobile = this.formData.uMobile;
      }

      if (this.formData.projectCountMin !== "") {
        currSize.projectCountMin = this.formData.projectCountMin;
      }

      if (this.formData.projectCountMax !== "") {
        currSize.projectCountMax = this.formData.projectCountMax;
      }

      if (this.formData.value !== "") {
        currSize.uSex = this.formData.value;
      }

      if (this.formData.uNickName !== "") {
        currSize.uNickName = this.formData.uNickName;
      }

      if (this.formData.value6 !== undefined) {
        if (this.formData.value6 !== null) {
          currSize.createTimeStart = this.formData.value6[0];
          currSize.createTimeEnd = this.formData.value6[1];
        }
      }
      addClient(currSize).then(res => {
        this.tableList = res.result;
      });
      this.pageSize = val;
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      const currIndex = {};
      currIndex.start = val;
      currIndex.pageSize = this.pageSize;
      currIndex.uType = "0";
      if (this.formData.uMobile !== "") {
        currIndex.uMobile = this.formData.uMobile;
      }

      if (this.formData.projectCountMin !== "") {
        currIndex.projectCountMin = this.formData.projectCountMin;
      }

      if (this.formData.projectCountMax !== "") {
        currIndex.projectCountMax = this.formData.projectCountMax;
      }

      if (this.formData.value !== "") {
        currIndex.uSex = this.formData.value;
      }

      if (this.formData.uNickName !== "") {
        currIndex.uNickName = this.formData.uNickName;
      }

      if (this.formData.value6 !== undefined) {
        if (this.formData.value6 !== null) {
          currIndex.createTimeStart = this.formData.value6[0];
          currIndex.createTimeEnd = this.formData.value6[1];
        }
      }
      addClient(currIndex).then(res => {
        this.tableList = res.result;
      });
      this.currpage = val;
      console.log(`当前页: ${val}`);
    },
    //查询
    search() {
      this.listLoading = true;
      const searchCount = {};
      const searchData = this.formData;
      searchCount.start = "1";
      searchCount.pageSize = this.pageSize;
      searchCount.uType = "0";

      if (this.formData.uMobile !== "") {
        searchCount.uMobile = this.formData.uMobile;
      }

      if (this.formData.projectCountMin !== "") {
        searchCount.projectCountMin = this.formData.projectCountMin;
      }

      if (this.formData.projectCountMax !== "") {
        searchCount.projectCountMax = this.formData.projectCountMax;
      }

      if (this.formData.value !== "") {
        searchCount.uSex = this.formData.value;
      }

      if (this.formData.uNickName !== "") {
        searchCount.uNickName = this.formData.uNickName;
      }

      if (this.formData.value6 !== undefined) {
        if (this.formData.value6 !== null) {
          searchCount.createTimeStart = this.formData.value6[0];
          searchCount.createTimeEnd = this.formData.value6[1];
        }
      }

      console.log(searchCount);

      const sortList = addClient(searchCount);
      let usDataList = [];
      sortList.then(res => {
        this.tableList = res.result;
        this.pageTotal = res.pageTotal;
        this.currpage = 1;
        console.log(this.tableList);
      });
      this.listLoading = false;
    },
    celent_more(index, row) {
      console.log("客户信息:", this.clientid1Name);
      if (this.clientid1Name == row.uRealName) {
        this.$message("客户信息不能重复");
      } else {
        this.$router.push({
          path: "decorateDetails",
          query: { uNick_NameTwo: row.uRealName }
        });
        this.$store.commit("checkNIckNameTwo", row.uRealName);
        this.$store.commit("checkNIckNameTwoID", row.uid);
      }
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

