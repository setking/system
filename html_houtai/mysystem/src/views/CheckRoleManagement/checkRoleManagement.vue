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
        <div slot="footer" class="checkFooter">
            <el-button @click="canceleditForm">取 消</el-button>
            <el-button v-show="editType == '0'" type="primary" @click="editFormData">确 定</el-button>
            <el-button v-show="editType == '1'" type="primary" @click="createForm">确 定</el-button>

        </div>
    </div>
</template>
<script>

import {getClient, editClient, createClient} from '../../config/api'
  export default {
    data() {
      return {
          editType: 0,
          restaurant_id: null,
          editFormTip: false,
          form: {
          imageUrl: null,
          user: null,
          Phone: null,
          },
          TEL_REGEXP: /^1[34578]\d{9}$/,
      }
    },
    created() {
       if (this.$route.query.restaurant_id) {
          this.restaurant_id = this.$route.query.restaurant_id
          this.editType = this.$route.query.restaurant_id.editType
          
        } else {

        }
        this.initData()
    },
    methods: {
      initData() {
        console.log(this.restaurant_id)
        if (this.restaurant_id.editType == '0') {
            const viewList = {}
            viewList.uid = this.restaurant_id.uid
            getClient(viewList).then(res => { 
              this.form.imageUrl = res.uHeadImg
              this.form.Phone = res.uMobile
              this.form.user = res.uRealName
            }) 
            
        }
      },
      editFormQuery() {
        this.editFormTip = false
        this.$router.go(-1)
      },
      canceleditForm() {
        this.editFormTip = true
      },
      editFormData() {
        const formCre = {}
        formCre.uid = this.restaurant_id.uid
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
          this.$router.go(-1)
        })
        }
      },
      createForm() {
        const formCre = {}
        formCre.uMobile = this.form.Phone
        formCre.uType = '2' 
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
           this.$router.go(-1)
          })

        }
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
</style>
