<template>
    <div class="uploadPicture">
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
                    placeholder="选择日期">
                    </el-date-picker>
                </div>
  </el-form-item>
  <el-form-item label="项目地址">
    <el-input style="width:16rem" v-model="form.projectLocal" placeholder="请输入项目地址"></el-input>
  </el-form-item>
    <el-form-item label="合同图片">
        <!-- action="http://192.168.1.20:8080/upload/uploadPicture" -->
      <el-upload
        class="avatar-uploader"
        action="http://39.100.92.34:8081/jzb_houtai/upload/uploadPicture"
        accept=".BMP,.bmp,.jpg,.JPG,.wbmp,.jpeg,.png,.PNG,.JPEG,.WBMP,.GIF,.gif,.ICON,.icon,.jepg,.JEPG.txt,.doc,.wps,.html,.pdf"
        :show-file-list="false"
        :on-success="handleAvatarSuccess">
        <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar">
        <i v-show="docType == '0'" v-else class="el-icon-plus avatar-uploader-icon"></i>
        <img v-show="docType == '1'"  v-if="!form.imageUrl" class="upImage" src="../../assets/img/upPdf.png">
      </el-upload>
    </el-form-item>
  </el-form>
  <div slot="footer" class="checkFooter">
    <el-button @click="canceleditForm">取 消</el-button>

    <el-button type="primary" @click="editFormData">确 定</el-button>

  </div>
  </div>
</template>
<script>

import {zbProject, updateProject} from '../../config/api'
  export default {
    data() {
      return {
          docType: 0,
          restaurant_id: 1,
          editFormTip: false,
           form: {
          projectName: null,
          value1: null,
          projectLocal: null,
          imageUrl: null,
        },
          TEL_REGEXP: /^1[34578]\d{9}$/,
      }
    },
    created() {
       if (this.$route.query.restaurant_id) {
          this.restaurant_id = this.$route.query.restaurant_id
          
        } else {

        }
        this.initData()
    },
    methods: {
      initData() {
        console.log(this.restaurant_id)
        const viewList = {}
        viewList.projectid = this.restaurant_id
        viewList.useStatus = '0'
        viewList.start = '1'
        viewList.pageSize = '10'
        zbProject(viewList).then(res => {
          this.form.projectName = res.result[0].projectName
          this.form.value1 = res.result[0].createTimeStart
          this.form.projectLocal = res.result[0].projectAddr
          
          console.log(res.result[0].projectContract)

          let strs = []
          strs = res.result[0].projectContract.split(".")
          let strsType = strs.pop()
          if (strsType == "pdf") {
            console.log("文件类型是pdf")
            this.docType = '1'
          } else {
             this.docType = '0'
             this.form.imageUrl = res.result[0].projectContract
          }
        })
      },
      editFormQuery() {
        this.editFormTip = false
        this.$router.go(-1)
      },
      canceleditForm() {
        this.editFormTip = true
      },
      handleAvatarSuccess(res, file) {
        console.log()
        this.form.imageUrl = URL.createObjectURL(file.raw);
      },
      // 图片删除
      beforeAvatarUpload(file) {
        // console.log(file.type)
        // const isJPG = file.type === 'image/jpg' || 'image/png' || 'image/jpeg';

        // if (!isJPG) {
        //   this.$message.error('上传头像图片格式错误!');
        // }
        // return isJPG;
      },
      editFormData() {
        const formCre = {}
        formCre.projectid = this.restaurant_id
        formCre.projectName = this.form.projectName
        formCre.createTimeStart = this.form.value1
        formCre.projectAddr = this.form.projectLocal
        formCre.projectContract = this.form.imageUrl
        if (this.form.projectName == "" || this.form.value1 == "" || this.form.projectLocal == "") {
          this.$message({
          message: '请填写完成',
          type: 'warning'
        });
        } else {
        updateProject(formCre).then(res => {
          console.log(res)
          this.$router.go(-1)
        })
        }
      },
      
    }
  }
</script>
<style scoped>
.uploadPicture{
    width: 17rem;
    margin: 5% auto;
}

  .formSubmit div{
      width: 15rem;
      display: flex;
  }
    .switchStyle .el-switch__label {
    position: absolute;
    display: none;
    color: #fff;
    }
    .switchStyle .el-switch__label--left {
    z-index: 9;
    left: 1.7rem;
    }
    .switchStyle .el-switch__label--right {
    z-index: 9;
    left: -.4rem;  
    }
    .switchStyle .el-switch__label.is-active {
    display: block;
    }
    .switchStyle.el-switch .el-switch__core,
    .el-switch .el-switch__label {
    width: 6rem !important;
    }
    .checkFooter{
      width: 100%;
      padding-left: 10rem;
    }
    .upImage{
      width: 178px;
    }
</style>
