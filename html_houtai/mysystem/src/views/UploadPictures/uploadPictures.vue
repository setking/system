<template>
    <div class="uploadPicture">
        <el-form ref="form" :rules="rules"  :model="form" label-width="80px">
        <el-form-item label="活动名称" prop="name">
            <el-input style="width:20rem;" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="链接">
            <el-input style="width:20rem;" v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item label="上传图片" prop="imageUrl">
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
        <el-form-item label="状态">
                        <el-tooltip class="item" effect="dark" content="启用则小程序显示banner" placement="top">
                          <el-switch  class="switchStyle" :active-value="0" :inactive-value="1"  active-text="已启用" inactive-text="已禁用"  v-model="form.delivery">
                          </el-switch>
                        </el-tooltip>
            
        </el-form-item>
        <el-form-item class="formSubmit">
            <el-button @click="dialogVisible = true">取消</el-button>
            <el-button type="primary" @click="onSubmit()">确定</el-button>
            
        </el-form-item>
        </el-form>
        <!-- 取消提示 -->
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%">
        <span>取消后所编辑的信息将不被保存</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="cancel()">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>

import {NewBanner} from '../../config/api'
  export default {
    data() {
      return {
        restaurant_id: 0,
        dialogVisible: false,
        form: {
          name: '',
          delivery: '0',
          imageUrl: "",
          url: ""
        },
         rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
          ],
          imageUrl: [
            { required: true, message: '请上传图片', trigger: 'change' }
          ],
        }
      }
    },
    created() {
       if (this.$route.query.bannerType) {
          this.restaurant_id = this.$route.query.bannerType
          
        } else {

        }
        this.initData()
    },
    methods: {
      initData() {
        console.log(this.restaurant_id)
      },
      handleAvatarSuccess(res, file) {
        this.form.imageUrl = res.msg
      },
            onSubmit() {
              const uploadList = {}
              uploadList.bannerPic = this.form.imageUrl
              uploadList.useStatus = this.form.delivery
              uploadList.bannerName = this.form.name
              uploadList.bannerLink = this.form.url
              uploadList.bannerType =  this.restaurant_id
              uploadList.bannerid = this.restaurant_id
              if (this.form.name == '' || this.form.imageUrl == '') {
                this.$message({
                message: '您有未填的项',
                type: 'warning'
              });
              } else {
                NewBanner(uploadList).then(res => { 
                    this.$message({
                    message: '上传成功',
                    type: 'success'
                  });
                  this.$router.go(-1)
                }).catch(err => {
                  this.$message.error('上传失败');
                })
      
              }
              
            },
      beforeAvatarUpload(file) {
        // const isJPG = file.type === 'image/png,image/jpg';   
        // const isLt2M = file.size / 1024 / 1024 < 2;
        console.log(file)

        // if (!isJPG) {
        //   this.$message.error('上传图片格式错误!');
        // } 
        // if (!isLt2M) {
        //   this.$message.error('上传头像图片大小不能超过 2MB!');
        // }
        // return isJPG;
      },
      cancel() {
           this.$router.go(-1)
           this.dialogVisible = false
      }
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
</style>
