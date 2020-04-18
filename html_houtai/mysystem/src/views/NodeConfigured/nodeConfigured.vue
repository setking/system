<template>
  <div>
    <div class="toDAtaTitle">
      <span>选择项目工作节点</span>
    </div>
    <div class="toData">
      <tree-transfer  :title="titles" 
                      :from_data='fromData' 
                      :to_data='toData' 
                      :defaultProps="{label:'label'}" 
                      @addBtn='add' 
                      @removeBtn='remove' 
                      :mode='mode' 
                      height='50rem' 
                      width="60rem"
                      openAll>
      </tree-transfer>
    </div>
    <div class="allBtn">

      <el-button @click="cancel()">取消</el-button>
      <el-button @click="accomplish()" type="primary">完成</el-button>
    </div>
    <!-- 取消提示 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span>取消后所编辑的信息将不被保存</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="disableCancel()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    import treeTransfer from 'el-tree-transfer' // 引入
    import {addProject, getTreeNodes} from '../../config/api'
import { setInterval } from 'timers';
import { type } from 'os';
    export default {

    data(){
      return{
        formList: '',
        dialogVisible: false,
        titles: ["轻辅施工", " 轻辅施工"],
        mode: "transfer", // transfer addressList
        Datalist: '',
        fromData:[],
        toData:[]
      }
    },
    created() {
        if (this.$route.query.formData) {
          this.formList = this.$route.query.formData
          
        }
        this.initData()
    },
    methods:{
      initData() {
        getTreeNodes().then(res => {
          this.fromData = res
          console.log(res)
        })
      },
      // 切换模式 现有树形穿梭框模式transfer 和通讯录模式addressList
      changeMode() {
        if (this.mode == "transfer") {
          this.mode = "addressList";
        } else {
          this.mode = "transfer";
        }
      },
      // 监听穿梭框组件添加
      add(fromData,toData,obj){
        // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
        // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
        // console.log("fromData:", fromData);
        // console.log("toData:", toData);
        // console.log("obj:", obj);
        this.fromData = fromData
        this.toData = toData
      },
      // 监听穿梭框组件移除
      remove(fromData,toData,obj){
        // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
        // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
        // console.log("fromData:", fromData);
        // console.log("toData:", toData);
        // console.log("obj:", obj);
        this.fromData = fromData
        this.toData = toData
        this.Datalist = obj
      },
      cancel() {
        this.dialogVisible = true
      },
      accomplish() {
        let treelist = this.toData
        let treeSort = []
        let treeData = []
        let treeStr = {}
        let sortList = {}
        let TreeArg = null
        let TreeItem = null
        treelist.forEach(item => {
          treeSort.push( item.id +　'~' +  item.sort) 
          item.children.forEach(arg => {
            treeSort.push(arg.id +　'~' + arg.sort)
          })
        })
        treeSort.forEach(args => {
          sortList += args + "-"
        })
        if (Object.keys(sortList).length !== 0) {
          TreeItem = sortList.substring(15, sortList.length-1)
        }
        const toDataList = {}
        toDataList.projectName = this.formList.projectName
        toDataList.projectAddr = this.formList.projectAddr
        toDataList.projectContract = this.formList.imageUrl
        toDataList.clientid1 = this.$store.state.nickNameID 
        toDataList.clientid2 = this.$store.state.nickNameTwoID 
        toDataList.foremanid = this.$store.state.foremanID 
        toDataList.designerid = this.$store.state.designerNameID 
        toDataList.engineerid = this.$store.state.engineerID 
        toDataList.createTimeStart = this.formList.value1
        toDataList.nodeIds = TreeItem


        console.log(toDataList)
         addProject(toDataList).then(res => {
           this.$router.push({ path: 'indentlist'})
           console.log(res)
         })
         },
      disableCancel() {
        this.$router.push({ path: 'decorateDetails'})
        this.dialogVisible = false

      }
    },
    components:{ treeTransfer } // 注册 
    }

</script>
<style scoped>
.toData{
  width: 60rem;
  height: 50rem;
  background-color: #fff;
  margin: 0 auto;
}
.toDAtaTitle {
  width: 60rem;
  height: 4rem;
  margin: 0 auto;
  font-size: 1.5rem;
}
.allBtn {
  width: 60rem;
  height: 3rem;
  margin: 3rem auto;
  display: flex;
  justify-content: flex-end;
}
</style>
