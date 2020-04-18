<template>
    <div class="editor">
        <div>
            <el-form  :label-position="labelPosition" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="180px" class="demo-ruleForm"> 
                <el-form-item label="标题" prop="title">
                    <el-input style="width:20rem;" v-model="ruleForm.title"></el-input>
                </el-form-item>
                <el-form-item label="主图（180*80）" prop="region">
                    <el-upload
                    class="avatar-uploader"
                    action="http://39.100.92.34:8081/jzb_houtai/upload/uploadPicture"
                    :show-file-list="false"
                    accept=".BMP,.bmp,.jpg,.JPG,.wbmp,.jpeg,.png,.PNG,.JPEG,.WBMP,.GIF,.gif,.ICON,.icon,.jepg,.JEPG"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="ruleForm.imageUrl" :src="ruleForm.imageUrl" class="avatar">
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
          <Editor v-on:childByValue="childByValue"/>
            
        </div>  
        <div class="save-button">
            <el-row>
                <el-button @click="cancelSave()">取消</el-button>
                <el-button @click="getData" type="primary">保存</el-button>
            </el-row>
        </div>
    </div> 
</template>
<script>
import {viewStand, addsSand} from '../../config/api'
import Editor from '../../components/Editor/editor.vue'
export default {
      data(){
     return {
            labelPosition: 'left',
            dataRow: {},
            flowid: 1,
            getDataList: null,
            ruleForm: {
            title: null,
            imageUrl: null,
            },
            rules: {
            title: [
                { required: true, message: '请输入标题', trigger: 'blur' },
                { min: 3, max: 50, message: '长度在 3 到 5 个字符', trigger: 'blur' }
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
        }
        ,computed: {
            editor() {
                return this.$refs.myQuillEditor.quill;
            },
        },methods: {
        handleAvatarSuccess(res, file) {
            this.ruleForm.imageUrl = res.msg  
        },
        beforeAvatarUpload(file) {
            // const isJPG = file.type === 'image/jpeg';
            // const isLt2M = file.size / 1024 / 1024 < 20;

            // if (!isJPG) {
            // this.$message.error('上传头像图片只能是 JPG 格式!');
            // }
            // if (!isLt2M) {
            // this.$message.error('上传头像图片大小不能超过 20MB!');
            // }
            // return isJPG && isLt2M;
        },
        onEditorReady(editor) { // 准备编辑器 
        },
        onEditorBlur(){}, // 失去焦点事件
        onEditorFocus(editor){ // 获得焦点事件
            // editor.enable(false); // 在获取焦点的时候禁用
            },
        onEditorChange(){}, // 内容改变事件
        cancelSave(){
             this.$router.go(-1)
        },
        childByValue: function (childValue) {
        // childValue是子组件传过来的值
        this.getDataList = childValue 
      },
        getData(){
            const editStand = {}
            editStand.fstandardTitle = this.ruleForm.title
            editStand.fstandardPic = this.ruleForm.imageUrl
            editStand.fstandardContent = this.getDataList
            editStand.flowid = this.flowid
            console.log(editStand)
            if (editStand.fstandardTitle == null|| editStand.fstandardPic == null || editStand.fstandardContent == null) {
                 this.$message({
                        showClose: true,
                        message: '您有未输入项',
                        type: 'warning'
                        });
            } else {

                addsSand(editStand).then(res => {
                    this.$message({
                        message: '添加成功!',
                        type: 'success'
                        });
                     this.$router.go(-1)
                })
            }
        }
    }
}
</script>
<style scoped>
.editor{
    line-height: 3rem;
    font-size: 1.3rem;
}
.nowPic{
    line-height: 3rem;
    font-size: 1.3rem; 
    text-align: left;
}

  .save-button{
      width: 100%;
      display: flex;
      justify-content: center;
      margin-top: 3rem;
  }
</style>

