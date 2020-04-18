<template>

    <div  style="padding-top:.5rem;" class="editor">
        <el-button style="float:right;" @click="$router.back(-1)" plain>上一页</el-button>
        <div>
            <span>施工准备阶段 —— {{projectTitle}}</span><br />
            <span>标准描述</span>
        </div>
        <div>
            <span>现场图片</span>
            <ul class="picListClass"> 
                <li v-for="sencesPic, index in picList">
                    <el-popover 
                    placement="left"
                    title=""
                    trigger="click"
                    width="1000">
                        <img :src="sencesPic"/>
                        <img slot="reference" class="ScenePic" :src="sencesPic">
                    </el-popover>
                    <!-- <img slot="reference" class="ScenePic" :src="sencesPic"> -->
                </li>
            </ul>
        </div>
        <div class="edit_container">
            <Editor/>
        </div>  
        <!-- <div class="projectCancel">
                    <el-row>
                            <el-button @click="cancelSave()">上一页</el-button>
                    </el-row>
        </div> -->

    </div>
    
</template>
<script>
import {ansbyid} from '../../config/api'
import Editor from '../../components/Editor/editor'
export default {
      data(){
     return {
            picList: [],
            childData: "",
            flowid: 1,
            pid: 1,
            projectTitle: null,
        }
        },
        created() {
            if (this.$route.query.flow_id || this.$route.query.pid) {
                this.flowid = this.$route.query.flow_id
                this.pid = this.$route.query.pid
          
        } else {

        }
            this.initData()
        },
        components: {
        Editor
        },
        computed: {
            editor() {
                return this.$refs.myQuillEditor.quill;
            },
        },methods: {
        initData(){ 
            const flowList = {}
            flowList.flowid = this.flowid
            flowList.pid = this.pid
            ansbyid(flowList).then(res => {
                this.childData  = res.fstandardContent
                this.picList = res.sencePictureSrc
                this.projectTitle = res.fstandardTitle
                console.log(res)
                // console.log("父组件数据", this.childData)
                this.$store.commit('childernList',this.childData);    
            })
        },
        cancelSave(){
            this.$router.go(-1);
        },
    },
    destroyed: function() {
        this.childData = ""
        this.$store.commit('childernList',this.childData);
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
.projectCancel{
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 4rem;
}
.picListClass{
    display: flex;
    flex-wrap: wrap;
}
.picListClass li{
    list-style: none;
}
.ScenePic{
    margin: 1.5rem;
    width: 10rem;
    height: 10rem; 
}
</style>

