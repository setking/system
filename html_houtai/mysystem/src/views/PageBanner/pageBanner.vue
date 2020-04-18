<template>
  <div>
    <!-- 查询 -->
    <div class="search_all">
      <!-- <div> 
      </div>-->
      <div style="padding-top:2rem;">
        <el-button v-show="showAdd" @click="uploadPicture()" type="primary">新建</el-button>
      </div>
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
      <el-table-column prop="bannerid" v-if="showRow"></el-table-column>
      <el-table-column align="center" prop="sortNum" label="序号"></el-table-column>
      <el-table-column align="center" prop="bannerName" label="名称"></el-table-column>
      <el-table-column align="center" prop="createTime" label="上传时间"></el-table-column>
      <el-table-column align="center" prop="bannerLink" label="链接"></el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <!-- <el-switch
            v-show="scope.row.useStatus == '0'"
            disabled
            class="switchStyle"
            active-text="已启用"
            inactive-text="已禁用"
            :value="true"
          ></el-switch>
          <el-switch
            v-show="scope.row.useStatus == '1'"
            disabled
            class="switchStyle"
            active-text="已启用"
            inactive-text="已禁用"
            :value="false"
          ></el-switch> -->
          <el-button id="myBtn2" size="mini" v-if="scope.row.useStatus == '0'" type="success">可用</el-button>
          <el-button id="myBtn3" size="mini" v-if="scope.row.useStatus == '1'" type="info">禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <el-button
            v-show="showMore"
            size="mini"
            type="primary"
            plain
            @click="to_jobContent(scope.$index, scope.row)"
          >查看</el-button>

          <el-button
            v-show="showEdit"
            size="mini"
            type="primary"
            plain
            @click="handleEdit(scope.$index, scope.row)"
          >修改</el-button>
          <el-button
            v-show="showDelet"
            size="mini"
            type="danger"
            plain
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 删除提示 -->
    <el-dialog title="提示" :visible.sync="deletVisible" width="30%">
      <span>您确定要删除这条信息吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deletVisible = false">取 消</el-button>
        <el-button type="primary" @click="deletList()">确 定</el-button>
      </span>
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
      :total="pageTotal"
    ></el-pagination>
  </div>
</template>

<script>
import { bannerList, deletBanner } from "../../config/api";
export default {
  inject: ["reload"],
  data() {
    return {
      useStatusTrue: true,
      useStatusFalse: false,
      showEdit: true,
      showDelet: true,
      showMore: true,
      showAdd: true,
      deletVisible: false,
      deletTable: 1,
      showRow: false,
      pageTotal: 1,
      value3: true,
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
        UID: "",
        date: "",
        finadate: ""
      },
      tableList: [], //数据存储数组
      tableData: [],
      value: "",
      value6: ""
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      let storyList = [];
      storyList = sessionStorage.getItem("menuName");
      let storyMenu = storyList.split(",");
      console.log("story数据", storyMenu);
      if (!storyMenu.includes("工长小程序-编辑")) {
        this.showEdit = false;
      }
      if (!storyMenu.includes("工长小程序-删除")) {
        this.showDelet = false;
      }
      if (!storyMenu.includes("工长小程序-查看")) {
        this.showMore = false;
      }
      if (!storyMenu.includes("工长小程序-新建")) {
        this.showAdd = false;
      }
      this.listLoading = true;
      const CurrentList = {};
      CurrentList.start = this.currpage;
      CurrentList.pageSize = this.pageSize;
      CurrentList.type = "1";
      bannerList(CurrentList).then(res => {
        console.log(res);
        this.tableList = res.result;
        this.pageTotal = res.pageTotal;
      });
      this.listLoading = false;
    },
    addList() {
      this.tableList.push(this.addTable);
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
      const currSize = {};
      currSize.start = this.currpage;
      currSize.pageSize = val;
      currSize.type = "1";
      bannerList(currSize).then(res => {
        this.tableList = res.result;
      });
      this.pageSize = val;
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      const currIndex = {};
      currIndex.start = val;
      currIndex.pageSize = this.pageSize;
      currIndex.type = "1";
      bannerList(currIndex).then(res => {
        this.tableList = res.result;
      });
      this.currpage = val;
      console.log(`当前页: ${val}`);
    },
    //查询
    search({ UID, money, name }) {
      this.listLoading = true;
      this.tableList = this.tableData.filter(item => {
        let matchUID = true; // UID 筛选
        let matchmoney = true; // data 筛选
        let matchname = true; // name 筛选
        if (UID) {
          // 模糊搜索;
          const ListUID = UID.replace(" ", "") // 删掉空格
            .split(""); // 切割成 单个字
          matchUID = ListUID.every(key => item.UID.includes(key));
        }
        if (money) {
          matchmoney = item.money == money;
        }
        if (name) {
          // 模糊搜索;
          const keys = name
            .toUpperCase() // 转大写
            .replace(" ", "") // 删掉空格
            .split(""); // 切割成 单个字

          matchname = keys.every(key => item.name.toUpperCase().includes(key));
        }
        // 加载动画定时关闭
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
        return matchUID && matchmoney && matchname;
      });
    },
    uploadPicture() {
      this.$router.push({ path: "uploadPictures", query: { bannerType: "1" } });
    },
    //编辑
    handleEdit(index, row) {
      this.$router.push({
        path: "editorBanner",
        query: { restaurant_id: row.bannerid }
      });
    },
    //删除
    handleDelete(index, row) {
      this.deletTable = row;
      this.deletVisible = true;
    },
    deletList() {
      const deletData = {};
      deletData.id = this.deletTable.bannerid;
      deletBanner(deletData).then(res => {
        this.initData();
        console.log(res);
      });
      this.deletVisible = false;
    },
    //查看
    to_jobContent(index, row) {
      this.$router.push({
        path: "viewBanner",
        query: { restaurant_id: row.bannerid }
      });
    }
  }
};
</script>
<style>
#out-table {
  margin-top: 30px;
}
#myBtn2 {
  color: #fff;
  background-color: #67c23a;
  border-color: #67c23a;
}
#myBtn3 {
  color: #fff;
  background-color: #909399;
  border-color: #909399;
}
</style>

