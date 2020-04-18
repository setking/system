<template>
<div class="sider-List">
    <div class="sidebar">
        <el-menu  
        default-active="activeIndex"
        :collapse="collapse"
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        @select="handleSelect"
        active-text-color="#ffd04b"
        unique-opened router>
                    <el-menu-item index="mangen">
                            <i class="iconfont icon-shuju"></i><span slot="title">数据统计</span>
                    </el-menu-item>
                    <el-menu-item index="userlist">
                            <i class="iconfont icon-kehuguanli1"></i><span slot="title">客户管理</span>
                    </el-menu-item>
                    <el-menu-item index="indentlist">
                            <i class="iconfont icon-xiangmuguanli"></i><span slot="title">项目管理</span>
                    </el-menu-item>
                    <el-menu-item index="articlelist">
                            <i class="iconfont icon-liucheng"></i><span slot="title">项目阶段流程设置</span>
                    </el-menu-item>
                    <el-menu-item index="shoplist">
                            <i class="iconfont icon-haogongchang1"></i><span slot="title">工长管理</span>
                    </el-menu-item>
                    <el-menu-item index="administratorsettings">
                            <i class="iconfont icon-shejishi1"></i><span slot="title">设计师</span>
                    </el-menu-item>
                    <el-menu-item index="rolemanagement">
                            <i class="iconfont icon-gongchengbu"></i><span slot="title">工程部</span>
                    </el-menu-item>

                    <el-submenu  index="index5">
                        <template slot="title">
                            <i  class="iconfont icon-m_ic_yypz"></i><span slot="title">运营配置</span> 
                        </template>
                        <el-submenu  index="index6">
                        <template slot="title">
                            <i  class="iconfont icon-bannerguanli"></i><span slot="title">banner管理</span>
                        </template>
                        <el-menu-item index="pageBanner">
                           工长小程序
                        </el-menu-item>
                        <el-menu-item index="manageBanner">
                        管理端小程序
                        </el-menu-item>
                        <el-menu-item index="clientBanner">
                            客户端小程序
                        </el-menu-item>
                    </el-submenu>
                    </el-submenu>

                    <el-submenu  index="index7"> 
                        <template slot="title">
                            <i  class="iconfont icon-xitongquanxian"></i><span>系统管理</span>
                        </template>
                        <el-menu-item index="systemPage">
                            管理员设置
                        </el-menu-item>
                        <el-menu-item index="roleList">
                            角色列表
                        </el-menu-item>
                        <el-menu-item index="accessthemenu">
                            菜单设置
                        </el-menu-item>
                        <el-menu-item index="informmanagement">
                            日志管理
                        </el-menu-item>
                    </el-submenu>
        </el-menu>
    </div> 
    </div>
</template>

<script>
    import bus from './bus';
    import { mapState } from 'vuex'
    export default {
        data() {
            return {
                collapse: false,
            }
        },
        computed: {
			defaultActive: function(){
				return this.$route.path.replace('/');
			}
		},
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        },
        methods: {
            handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 50px;
        bottom:0; 
        overflow-y: scroll;
        
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
   .sidebar::-ms-scrollbar{
       width: 250;
   }
    .sidebar > ul {
        padding-top: 20px;
        height:97.8%;
    }
    /* .el-menu-item.is-active {
        background-color: #247bb4 !important;
        } */ 
</style>
