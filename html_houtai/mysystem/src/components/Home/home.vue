<template>
    <div class="wrapper">
        <v-head></v-head>
         
        <v-sidebar></v-sidebar>
                <div  class="content-box" :class="{'content-collapse':collapse}">
                    <v-tags></v-tags>
                        <keep-alive :include="['decorateDetails','userlist',
                        'indentlist','shoplist','administratorsettings','rolemanagement',
                        'configureClient','configureClientTwo','configurationForeman','configurationDesigner',
                        'configurationEngineering'
                        ]">  
                            <router-view class="content-view" v-if="isRouterAlive"></router-view>
                        </keep-alive>
                </div>
    </div>
</template>
<script>
import vHead from './head.vue';
import vSidebar from './sidebar.vue';
import vTags from './tags.vue'; 
import vFooter from './footer.vue';
import bus from './bus';
export default {
    provide () {
        return { 
            reload: this.reload
        }
    },
    data() {
        return {
            collapse: false,
            isRouterAlive: true,
            HomeLoading: false
        }
    },
    components: {
        vHead, vSidebar, vTags, vFooter
    },
    created() {
        bus.$on('collapse', msg => {
            this.collapse = msg;
        })
        // 登录过期提示
        // this.$alert('你的登录已过期', {
        //   confirmButtonText: '确定',
        //   showClose: false,
        //   callback: () => {
        //       this.$router.replace({ path: "/" });
        //   }
        // });
    },
    methods: {
        reload () {
            this.isRouterAlive = false
            setTimeout(() => {
                this.HomeLoading = false
            }, 1.5 * 1000)
            this.$nextTick(function() {
                this.isRouterAlive = true
                this.HomeLoading = true
            })
            
        }
    }
}
</script>
