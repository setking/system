<template>
    <div>

        <el-row> 
            <el-col>
                <div class="grid-content">
                    <div class="client_img">
                        <img src="../../assets/img/yonghu.png" alt="找不到图片">
                    </div>
                    <dir class="client">
                        <div>
                            <span class="client_Num">{{countList.client ? countList.client : '0'}}</span><br />
                            <span class="client_Name">客户</span>
                        </div>
                        
                    </dir>
                    
                </div>
            </el-col>
            <el-col>
                <div class="grid-content">
                    <div class="client_img">
                        <img src="../../assets/img/gongchengbu.png" alt="找不到图片">
                    </div>
                    <dir class="client">
                        <div>
                            <span class="client_Num">{{countList.supervisor ? countList.supervisor : '0'}}</span><br /> 
                            <span class="client_Name">工程部</span>
                        </div>
                        
                    </dir>
                    
                </div>
            </el-col>
            <el-col>
                <div class="grid-content">
                    <div class="client_img">
                        <img src="../../assets/img/shejishi.png" alt="找不到图片">
                    </div>
                    <dir class="client">
                        <div>
                            <span class="client_Num">{{countList.architect ? countList.architect : '0'}}</span><br />
                            <span class="client_Name">设计师</span>
                        </div>
                        
                    </dir>
                    
                </div>
            </el-col>
            <el-col>
                <div class="grid-content">
                    <div class="client_img">
                        <img src="../../assets/img/gongzhang.png" alt="找不到图片">
                    </div>
                    <dir class="client">
                        <div>
                            <span class="client_Num">{{countList.engineeringManager ? countList.engineeringManager : '0'}}</span><br />
                            <span class="client_Name">工长</span>
                        </div>
                        
                    </dir>
                    
                </div>
            </el-col>
        </el-row>
        <el-row> 
            <el-col>
                <div class="grid-content">
                    <div class="client_img">
                        <img src="../../assets/img/xianmu.png" alt="找不到图片">
                    </div>
                    <dir class="client">
                        <div>
                            <span class="client_Num">{{countList.statistics ? countList.statistics : '0'}}</span><br />
                            <span class="client_Name">项目总数</span>
                        </div>
                        
                    </dir>
                    
                </div>
            </el-col>
            <el-col>
                <div class="grid-content">
                    <div class="client_img">
                        <img src="../../assets/img/daikaigong.png" alt="找不到图片">
                    </div>
                    <dir class="client">
                        <div>
                            <span class="client_Num">{{countList.workStart ? countList.workStart : '0'}}</span><br />
                            <span class="client_Name">待开工</span>
                        </div>
                        
                    </dir>
                     
                </div>
            </el-col>
            <el-col>
                <div class="grid-content">
                    <div class="client_img">
                        <img src="../../assets/img/shigong.png" alt="找不到图片">
                    </div>
                    <dir class="client">
                        <div>
                            <span class="client_Num">{{countList.working ? countList.working : '0'}}</span><br />
                            <span class="client_Name">施工中</span>
                        </div>
                        
                    </dir>
                    
                </div>
            </el-col>
            <el-col>
                <div class="grid-content">
                    <div class="client_img">
                        <img src="../../assets/img/jungong.png" alt="找不到图片">
                    </div>
                    <dir class="client">
                        <div>
                            <span class="client_Num">{{countList.workingEnd ? countList.workingEnd : '0'}}</span><br />
                            <span class="client_Name">竣工</span>
                        </div>
                        
                    </dir>
                    
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import {homeList} from '../../config/api'
export default {
    data() {
        return {
            countList: {}
        }
    },
    created() {
        this.initData()
    },
    methods: {
        initData() {
           const foodList =  homeList()
           foodList.then(res => {
               this.countList = res
               console.log(this.countList)
           })
           console.log(foodList)
      },
    }
}
</script>
<style scoped>
  .el-row {
    margin-bottom: 20px;
  }
  .el-row :last-child{
    margin-bottom: 0; 
  } 
  .el-col {
    border-radius: 4px;
    background: #fff;
    margin: 1rem;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    display: flex;
    align-items: center;
    height: 14rem;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .client_img{
      width: 50%; 
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
  }
  .client{
      width: 50%;
      height: 25rem;
      display: flex;
      justify-content: center;
      align-items: center;
  }
  .client div{
      width: 25rem;
      text-align: center;
  }
  .client_Num{
      font-size: 4rem;
      width: 10rem;
  }
  .client_Name{
      font-size: 2rem;
      width: 10rem;
  }
  .el-col-24{
      width: 22%;
      height: 14rem;
      
  }
  .font-color{
      color: #ffffff;
  }
</style>

