<template>
    <div class="editor">
        <div>
            <el-form  :label-position="labelPosition" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="180px" class="demo-ruleForm"> 
                <el-form-item label="标题" prop="title">
                    <el-input disabled style="width:20rem;" v-model="ruleForm.title"></el-input>
                </el-form-item>
                <el-form-item label="主图（180*80）" prop="region">
                    <el-upload
                    disabled
                    class="avatar-uploader"
                    action="http://39.100.92.34:8081/jzb_houtai/upload/uploadPicture" 
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    
                    <el-popover
                    v-if="ruleForm.imageUrl"
                    placement="right"
                    title=""
                    trigger="click">
                    <!-- <el-image avatar slot="reference" :src="ruleForm.imageUrl" :alt="ruleForm.imageUrl"  style="width:100%;height:100%;"></el-image> -->
                    <img slot="reference" :src="ruleForm.imageUrl" class="avatar">
                    <el-image :src="ruleForm.imageUrl"></el-image> 
                        
                    </el-popover>
                    <!-- <img v-if="ruleForm.imageUrl" :src="ruleForm.imageUrl" class="avatar"> -->
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    
                    </el-upload>
                </el-form-item>
                <el-form-item
                prop="textList"
                label="内容说明（1000字以内）"
                >
                </el-form-item>
                </el-form>
        </div>
        <div class="edit_container">
          <Editor v-model="article"/>
            
        </div>   
            <el-row class="cancelGo">
                <el-button @click="cancelSave()">上一页</el-button> 
            </el-row>
    </div>
</template>
<script>
import {viewStand} from '../../config/api'
import Editor from '../../components/Editor/editor.vue'
export default {
      data(){
     return {
            labelPosition: 'left',
            dataRow: {},
            flowid: 1,
            article:"",
            ruleForm: {
            title: '',
            imageUrl: '',
            },
            childData: "",
            rules: {
            title: [
                { required: true, message: '请输入标题', trigger: 'blur' },
                { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ],
            region: [
                { required: true, message: '请上传图片', trigger: 'blur' },
            ],
            textList: [
                { required: true, message: '内容说明', trigger: 'blur' },
            ],
            }
        }
        },
        components: {
        Editor
        },
        created() {
            if (this.$route.query.father_id) {
          this.flowid = this.$route.query.father_id
          
        } else {

        }
            this.initData()
        }
        ,computed: {
            editor() {
                return this.$refs.myQuillEditor.quill;
            },
        },methods: {
        initData(){
            console.log(this.flowid)
            const flowList = {}
            flowList.flowid = this.flowid
            viewStand(flowList).then(res => {
                console.log(res)
                this.ruleForm.title = res.fstandardTitle
                this.ruleForm.imageUrl = res.fstandardPic
                this.childData  = res.fstandardContent
                console.log("父组件数据", this.childData)
                this.$store.commit('childernList',this.childData);
            })
        },
        handleAvatarSuccess(res, file) {
            this.ruleForm.imageUrl = res.msg   
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 20;

            if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 20MB!');
            }
            return isJPG && isLt2M;
        },
        cancelSave(){
            this.$router.go(-1);
        },
    }
}
</script>
<style scoped>
.editor{
    padding-top: 2rem;
}
.nowPic{
    line-height: 3rem;
    font-size: 1.3rem; 
    text-align: left;
}
 
  .cancelGo{
      position: absolute;
      right: 1rem;
      top: 4rem;
  }
  /* .el-popover{
    widows: 55rem;
    height: 90%;
    overflow-y: scroll;
}  */
</style>

