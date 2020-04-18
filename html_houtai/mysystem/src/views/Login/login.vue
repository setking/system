<template>
        <div class="banner">
          <div class="content-log">
            <div class="login-from">
            <el-form class="login-form" status-icon :rules="loginRules" ref="loginForm" :model="loginForm" label-width="0">
              <el-form-item>
                <div class="login-title">

                  家装宝后台管理系统
                </div>
            </el-form-item>
            <el-form-item prop="username">
            <el-input size="small" @keyup.enter.native="handleLogin" v-model="loginForm.username" auto-complete="off" placeholder="请输入用户名">
                <i slot="prefix" class="icon-yonghu"></i>
            </el-input>
            </el-form-item>
            <el-form-item prop="password">
            <el-input size="small" @keyup.enter.native="handleLogin" :type="passwordType" v-model.trim="loginForm.password" auto-complete="off" placeholder="请输入密码">
                <i class="el-icon-view el-input__icon" :style="fontstyle" slot="suffix" @click="showPassword"></i>
                <i slot="prefix" class="icon-mima"></i>
            </el-input>
            </el-form-item>
            <el-form-item  class="verifycode" prop="verifycode" style="width:300px;">
            <!-- 注意：prop与input绑定的值一定要一致，否则验证规则中的value会报undefined，因为value即为绑定的input输入值 -->
            <el-input  @keyup.enter.native="handleLogin" v-model="loginForm.verifycode" placeholder="请输入验证码" class="identifyinput"></el-input>
            <div class="identifybox">
                <div @click="refreshCode">
                <s-identify :identifyCode="identifyCode"></s-identify>
                </div>
                <!-- <el-button @click="refreshCode" type='text' class="textbtn">看不清，换一张</el-button> -->
            </div>
            </el-form-item>
            <el-form-item>
            <el-button type="primary" size="small" @click.native.prevent="handleLogin" class="login-submit">登录</el-button>
            </el-form-item>
        </el-form> 
          </div>
          </div>
        <Footer></Footer>
        </div>
</template>
<script>
import SIdentify from '../../components/verificationCode'
import {loginfouser} from '../../config/api'  
import Footer from '../../components/Home/footer'
export default {
  name: 'userlogin',
  data() {
    // 用户名自定义验证规则
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入正确的用户名'))
      } else {
        console.log('user', value)
        callback()
      }
    }
    // 验证码自定义验证规则
    const validateVerifycode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      } else if (value !== this.identifyCode) {
        console.log('validateVerifycode:', value)
        callback(new Error('验证码不正确!'))
      } else {
        callback()
      }
    }
    return {
      fontstyle: {
      },
      loginForm: {
        username: '',
        password: '',
        verifycode: ''
      },
      identifyCodes: '1234567890',
      identifyCode: '',
      loginRules: { // 绑定在form表单中的验证规则
        username: [
           { required: true, message: '用户名', trigger: 'blur' },
            { min: 1, message: '用户名长度为4位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度最少为6位', trigger: 'blur' }
        ],
        verifycode: [
          { required: true, trigger: 'blur', validator: validateVerifycode }
        ]
      },
      passwordType: 'password'
    }
  },
  components: {
    SIdentify,Footer
  },
  created() {
  },
  mounted() {
    // 验证码初始化
    this.identifyCode = ''
    this.makeCode(this.identifyCodes, 4)
  },
  computed: {
  },
  props: [],
  methods: {
    // 通过改变input的type使密码可见
    showPassword() {
      this.fontstyle === '' ? (this.fontstyle = 'color: red') : (this.fontstyle = '') // 改变密码可见按钮颜色
      this.passwordType === ''
        ? (this.passwordType = 'password')
        : (this.passwordType = '')
    },
    // 点击登入按钮
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
            var loginList = {}
            loginList.backNickName = this.loginForm.username 
            loginList.password = this.loginForm.password 
            const relogin = loginfouser(loginList)   
            relogin.then(res => {
              if (res.status == 200) {
                sessionStorage.setItem("userName", res.loginUser.backNickName);
                console.log(res.status)
                this.$router.replace({ path: "mangen" }); 
                sessionStorage.setItem("menuName", res.loginUser.menuName) 
              } else if(res.status == 404) {
                this.$message.error(res.loginUser);
              } else if (res.status == 401) {
                this.$message.error('登录失败,请联系管理员');  
              }
            })
            .catch(err => {
              this.$message.error('网络错误！');
              console.log(err)
            })
            console.log('login',relogin);    
        }
      })
    },
    // 生成随机数
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    // 切换验证码
    refreshCode() {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    // 生成四位随机验证码
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ]
      }
      console.log(this.identifyCode)
    }
  }
}
</script>
<style scoped>
.login-title{
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 2rem;
}
.content-log{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.banner{
  width: 100%;
  height: 100%;
  background-image: url("../../assets/img/banner.jpg")
}
.iconstyle{
  color:#409EFF;
}
.login-form {
  width: 300px;
}
.verifycode {
  position: relative;
}
.identifyinput{
  width: 150px;
}
.identifybox{
  position: absolute;
  top: 0;
  right: 0;
}
.login-submit{
  width: 300px;
  background: #FF841A;
  border: none;
}
.login-from{
  width: 30rem;
  height: 30rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1rem;
  box-shadow: .5rem .5rem .5rem gray;
  background: #fff;
}
</style>