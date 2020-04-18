<template>
  <div>
    <el-form
      show-message="false"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm ruleForm_item"
    >
      <el-form-item class="addEngineering" label="项目名称" prop="projectName">
        <el-input v-model="ruleForm.projectName" placeholder="请输入项目名称"></el-input>
      </el-form-item>
      <el-form-item label="开始时间" prop="value1">
        <div class="block">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="ruleForm.value1"
            type="datetime"
            placeholder="选择日期"
          ></el-date-picker>
        </div>
      </el-form-item>
      <el-form-item class="addEngineering" label="项目地址" prop="projectAddr">
        <el-input v-model="ruleForm.projectAddr" placeholder="请输入项目地址"></el-input>
      </el-form-item>
      <el-form-item label="合同图片" prop="imageUrl">
        <el-upload
          class="avatar-uploader"
          action="http://39.100.92.34:8081/jzb_houtai/upload/uploadPicture"
          accept=".BMP, .bmp, .jpg, .JPG, .wbmp, .jpeg, .png, .PNG, .JPEG, .WBMP, .GIF, .gif, .ICON, .icon, .jepg, .JEPG.txt, .doc, .wps, .html, .pdf"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-show="docType == 1" src="../../assets/img/upPdf.png" class="avatar" />
          <img
            v-show="docType == 0"
            v-if="ruleForm.imageUrl"
            :src="ruleForm.imageUrl"
            class="avatar"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <!-- v-model="ruleForm.clientid1Name -->
      <el-form-item class="addEngineering classColor" label="客户1" prop="clientid1Name">
        <span class="engineeringSpan" style="display: flex;">
          <el-input disabled color="red" :value="ruleForm.clientid1Name" placeholder="请添加客户"></el-input>
          <el-button @click="addClient()" class="addPrimary" type="primary" plain>添加客户</el-button>
        </span>
      </el-form-item>
      <el-form-item class="addEngineering classColor" label="客户2" prop="clientid2Name">
        <span class="engineeringSpan" style="display: flex;">
          <el-input disabled :value="ruleForm.clientid2Name" placeholder="请添加客户"></el-input>
          <el-button @click="addClientTwo()" class="addPrimary" type="primary" plain>添加客户</el-button>
        </span>
      </el-form-item>
      <el-form-item class="addEngineering classColor" label="工长" prop="foremanName">
        <span class="engineeringSpan" style="display: flex;">
          <el-input disabled :value="ruleForm.foremanName" placeholder="请添加工长"></el-input>
          <el-button @click="addForeman()" class="addPrimary" type="primary" plain>添加工长</el-button>
        </span>
      </el-form-item>
      <el-form-item class="addEngineering classColor" label="设计师" prop="designerName">
        <span class="engineeringSpan" style="display: flex;">
          <el-input disabled :value="ruleForm.designerName" placeholder="请添加设计师"></el-input>
          <el-button @click="addDesigner()" class="addPrimary" type="primary" plain>添加设计师</el-button>
        </span>
      </el-form-item>
      <el-form-item class="addEngineering classColor" label="工程部" prop="engineerName">
        <span class="engineeringSpan" style="display: flex;">
          <el-input disabled :value="ruleForm.engineerName" placeholder="请添加工程部"></el-input>
          <el-button @click="addEngineering()" class="addPrimary" type="primary" plain>添加工程部</el-button>
        </span>
      </el-form-item>
      <el-form-item style="width:25rem;">
        <el-button @click="dialogVisible = true">取消</el-button>
        <el-button type="primary" @click.native.prevent="submitForm">下一步</el-button>
      </el-form-item>
    </el-form>
    <!-- 取消提示 -->
    <el-dialog title="取消" :visible.sync="dialogVisible" width="30%">
      <span>您确定要取消吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="outQueck()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "decorateDetails",
  data() {
    return {
      uNick_Name: "",
      uNick_NameTwo: "",
      docType: null,
      dialogVisible: false,
      upPic: null,
      ruleForm: {
        projectName: "",
        value1: "",
        projectAddr: "",
        imageUrl: "",
        clientid1Name: "",
        clientid2Name: "",
        foremanName: "",
        designerName: "",
        engineerName: ""
      },
      rules: {
        projectName: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ],
        value1: [{ required: true, message: "请输入日期", trigger: "blur" }],
        projectAddr: [
          { required: true, message: "请输入项目地址", trigger: "blur" }
        ],
        imageUrl: [
          { required: true, message: "合同图片不能为空", trigger: "blur" }
        ],
        clientid1Name: [
          { required: true, message: "请输入客户名称", trigger: "blur" }
        ],
        foremanName: [
          { required: true, message: "请输入工长名称", trigger: "blur" }
        ],
        designerName: [
          { required: true, message: "请输入设计师名称", trigger: "blur" }
        ],
        engineerName: [
          { required: true, message: "请输入工程部名称", trigger: "blur" }
        ]
      }
    };
  },
  created() {},
  activated() {
    this.func();
  },
  methods: {
    func() {
      this.ruleForm.clientid1Name = this.$store.state.nickName;
      this.ruleForm.clientid2Name = this.$store.state.nickNameTwo;
      this.ruleForm.foremanName = this.$store.state.foreman;
      this.ruleForm.designerName = this.$store.state.designerName;
      this.ruleForm.engineerName = this.$store.state.engineer;
    },
    handleAvatarSuccess(res, file) {
      console.log(res.msg);
      let strs = [];
      strs = res.msg.split(".");
      let strsType = strs.pop();
      if (strsType == "pdf") {
        console.log("文件类型是pdf");
        this.docType = 1;
      } else {
        this.docType = 0; 
      }
      if (res.status == 200) {
        this.ruleForm.imageUrl = res.msg;
      } else {
        this.$message.error("上传失败");
      }
      // console.log(res)
      // this.$message.error(res.msg);
      this.upPic = res.msg;
    },
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.ruleForm.imageUrl == "") {
            this.$message({
              message: "请选择合同图片",
              type: "warning"
            });
          } else {
            console.log(this.ruleForm);
            console.log(valid);
            this.$router.push({
              path: "nodeConfigured",
              query: { formData: this.ruleForm }
            });
          }
        } else {
          this.$message({
            message: "您还有未填项",
            type: "warning"
          });
        }
      });
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
      // return  isLt2M;
    },
    outQueck() {
      this.dialogVisible = false;
      this.$router.push({ path: "indentlist" });
    },
    addClient() {
      this.$router.push({ path: "configureClient" });
    },
    addClientTwo() {
      this.$router.push({ path: "configureClientTwo" });
    },
    addForeman() {
      this.$router.push({ path: "configurationForeman" });
    },
    addDesigner() {
      this.$router.push({ path: "configurationDesigner" });
    },
    addEngineering() {
      this.$router.push({ path: "configurationEngineering" });
    }
  }
};
</script>

