<template>
  <div class="uploadPicture">
    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="活动名称" prop="name">
        <el-input style="width:20rem;" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="链接">
        <el-input style="width:20rem;" v-model="form.url"></el-input>
      </el-form-item>
      <el-form-item label="上传图片" prop="imageUrl">
        <el-upload
          class="avatar-uploader"
          :action="serverUrl"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="状态"  prop="delivery">
        <!-- <el-tooltip class="item" effect="dark" content="启用则小程序显示banner" placement="top">
                <el-switch  class="switchStyle1" :active-value="0" :inactive-value="1"  active-text="已启用" inactive-text="已禁用"  v-model="form.delivery">
              </el-switch>
        </el-tooltip>-->
        <template>
          <el-radio v-model="form.delivery" label="0">可用</el-radio>
          <el-radio v-model="form.delivery" label="1">禁用</el-radio>
        </template>
      </el-form-item>
      <el-form-item class="formSubmit">
        <el-button @click="cancelEdit()">取消</el-button>
        <el-button type="primary" @click="onSubmit()">确定</el-button>
      </el-form-item>
    </el-form>
    <!-- 删除提示 -->
    <el-dialog title="提示" :visible.sync="deletVisible" width="30%">
      <span>您确定要撤销编辑吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deletVisible = false">取 消</el-button>
        <el-button type="primary" @click="deletList()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { createBanner, viewBanner } from "../../config/api";
export default {
  data() {
    return {
      serverUrl: "http://39.100.92.34:8081/jzb_houtai/upload/uploadPicture",
      // serverUrl:'http://192.168.1.20:8080/upload/uploadPicture',
      deletVisible: false,
      restaurant_id: 1,
      uploadPic: null,
      form: {
        name: "",
        delivery: "0",
        imageUrl: "",
        url: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 2, max: 15, message: "长度在 2 到 15 个字符", trigger: "blur" }
        ],
        imageUrl: [{ required: true, message: "请上传图片", trigger: "change" }]
      }
    };
  },
  created() {
    if (this.$route.query.restaurant_id) {
      this.restaurant_id = this.$route.query.restaurant_id;
    } else {
    }
    this.initData();
  },
  methods: {
    initData() {
      console.log(this.restaurant_id);
      const viewList = {};
      viewList.id = this.restaurant_id;
      viewBanner(viewList).then(res => {
        this.form.name = res.bannerName;
        this.form.url = res.bannerLink;
        this.form.imageUrl = res.bannerPic;
        this.form.bannertype = res.bannerType;
        // this.form.delivery = Number(res.useStatus);
        this.form.delivery = res.useStatus;
        console.log(res.useStatus);
      });
    },

    handleAvatarSuccess(res, file) {
      if (res.msg) {
        this.form.imageUrl = res.msg;
      }
      console.log(res.msg);
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/png,image/jpg';
      // const isLt2M = file.size / 1024 / 1024 < 2;
      // if (!isJPG) {
      //   this.$message.error('图片格式错误!');
      // }
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 2MB!');
      // }
      // return isJPG;
    },
    onSubmit() {
      const uploadList = {};
      uploadList.bannerPic = this.form.imageUrl;
      uploadList.useStatus = this.form.delivery;
      uploadList.bannerName = this.form.name;
      uploadList.bannerLink = this.form.url;
      uploadList.bannerid = this.restaurant_id;
      uploadList.bannerType = this.form.bannertype;
      console.log(uploadList);
      if (this.form.name == "" || this.form.imageUrl == "") {
        this.$message({
          message: "您有未填的项",
          type: "warning"
        });
      } else {
        createBanner(uploadList)
          .then(res => {
            this.$message({
              message: "上传成功",
              type: "success"
            });
            this.$router.go(-1);
          })
          .catch(err => {
            this.$message.error("上传失败");
          });
      }
    },
    cancelEdit() {
      this.deletVisible = true;
    },
    deletList() {
      this.$router.go(-1);
    }
  }
};
</script>
<style scoped>
.uploadPicture {
  width: 20rem;
  margin: 5% auto;
}
</style>
