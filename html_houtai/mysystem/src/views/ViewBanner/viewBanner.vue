<template>
  <div>
    <el-button style="float:right;" @click="$router.back(-1)" plain>上一页</el-button>

    <div class="uploadPicture">
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="活动名称" prop="name">
          <el-input disabled style="width:20rem;" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="链接">
          <el-input disabled style="width:20rem;" v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item label="上传图片" prop="imageUrl">
          <el-upload
            disabled
            class="avatar-uploader"
            action="http://39.100.92.34:8081/jzb_houtai/upload/uploadPicture"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <!-- <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar"> -->
            <el-popover v-if="form.imageUrl" placement="right" title trigger="click">
              <!-- <el-image avatar slot="reference" :src="ruleForm.imageUrl" :alt="ruleForm.imageUrl"  style="width:100%;height:100%;"></el-image> -->
              <img slot="reference" :src="form.imageUrl" class="avatar" />
              <el-image :src="form.imageUrl"></el-image>
            </el-popover>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="状态">
          <!-- <el-tooltip class="item" effect="dark" content="启用则小程序显示banner" placement="top">
            <el-switch
              disabled
              class="switchStyle1"
              :active-value="0"
              :inactive-value="1"
              active-text="已启用"
              inactive-text="已禁用"
              v-model="form.delivery"
            ></el-switch>
          </el-tooltip>-->
          <span v-if="form.delivery == '0'">可用</span>
          <span v-if="form.delivery == '1'">禁用</span>
          <!-- <el-button id="myBtn2" size="mini" v-if="form.delivery == '0'" type="success">可用</el-button>
          <el-button id="myBtn3" size="mini" v-if="form.delivery == '1'" type="info">禁用</el-button> -->
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { viewBanner } from "../../config/api";
export default {
  data() {
    return {
      restaurant_id: 1,
      form: {
        name: "",
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
        this.form.delivery = Number(res.useStatus);
      });
    },
    handleAvatarSuccess(res, file) {
      this.form.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg';
      // const isLt2M = file.size / 1024 / 1024 < 2;
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 2MB!');
      // }
      // return isJPG && isLt2M;
    },
    cancel() {
      this.$router.push({ path: "indentlist" });
      this.dialogVisible = false;
    }
  }
};
</script>
<style scoped>
.uploadPicture {
  width: 17rem;
  margin: 5% auto;
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
