<template>
  <div>
    <!-- 图片上传组件辅助-->

    <el-upload
      class="uploaderPic"
      :action="serverUrl"
      :headers="header"
      :show-file-list="false"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :before-upload="beforeUpload"
    ></el-upload>
    <quill-editor
      v-model="content"
      ref="myQuillEditor"
      :options="editorOption"
      @change="onEditorChange($event)"
    ></quill-editor>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction
  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],
  ["link", "image"],
  ["clean"]
];
export default {
  data() {
    return {
      serverUrl: "http://39.100.92.34:8081/jzb_houtai/upload/uploadPicture", // 这里写你要上传的图片服务器地址
      // serverUrl:'http://192.168.1.20:8080/upload/uploadPicture',
      header: {
        // token: sessionStorage.token
      }, // 有的图片服务器要求请求头需要有token
      quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
      content: null,
      contentList: null,
      editorOption: {
        placeholder: "",
        theme: "snow", // or 'bubble'
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              image: function(value) {
                if (value) {
                  // 触发input框选择图片文件
                  document.querySelector(".uploaderPic input").click();
                } else {
                  this.quill.format("image", false);
                }
              }
            }
          }
        }
      }
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.content = this.$store.state.childData;
      // console.log("子组件数据", this.content)
    },
    onEditorChange({ editor, html, text }) {
      //内容改变事件
      if (this.content) {
        this.contentList = this.content + html;
      } else if ((this.content = null)) {
        this.contentList = html;
      }
      // console.log(this.contentList)
      this.$emit("childByValue", this.content);
    },
    // 富文本图片上传前
    beforeUpload() {
      // 显示loading动画
      this.quillUpdateImg = true;
    },

    uploadSuccess(res, file) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      console.log(res.msg);
      let quill = this.$refs.myQuillEditor.quill;
      // 如果上传成功
      if (res.status == 200) {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片  res.url为服务器返回的图片地址
        quill.insertEmbed(length, "image", res.msg);
        // 调整光标到最后
        quill.setSelection(length + 1);
      } else {
        this.$message.error("图片插入失败");
      }
      // loading动画消失
      this.quillUpdateImg = false;
    },
    // 富文本图片上传失败
    uploadError() {
      // loading动画消失
      this.quillUpdateImg = false;
      this.$message.error("图片插入失败");
    }
  },
  computed: {
    ...mapGetters(["getChildernList"])
  },
  watch: {
    getChildernList: function(li) {
      //li就是改变后的wifiList值
      this.content = li;
      console.log("改变", li);
    }
  }
};
</script>

<style scoped>
.ql-editor.ql-blank,
.ql-editor {
  height: 350px;
}
.uploaderPic {
  position: absolute;
  top: -600rem;
}
</style>