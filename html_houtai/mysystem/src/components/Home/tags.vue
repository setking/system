<template>
        <div class="header_container">
            <el-breadcrumb separator="/" class="breadcrumb_top">
                <el-breadcrumb-item>当前位置</el-breadcrumb-item>
                <el-breadcrumb-item v-for="(item, index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

</template>

<script>
    import bus from './bus';
    import {mapActions, mapState} from 'vuex'
    export default {
        data() {
            return {
            }
        },
    }

</script>


<style>
	.header_container{
        width: 100%;
		background-color: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 20px;
    }
    .breadcrumb_top{
        height: 3rem;
        line-height: 3rem;
    }
</style>
