import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = r => require.ensure([], () => r(require('../src/views/Login/login.vue')), 'login');
const mangen = r => require.ensure([], () => r(require('../src/views/Mangen/mangen.vue')), 'mangen');
const index = r => require.ensure([], () => r(require('../src/views/Index/index.vue')), 'index');
const indentlist = r => require.ensure([], () => r(require('../src/views/Indentlist/indentlist.vue')), 'indentlist');
const userlist = r => require.ensure([], () => r(require('../src/views/UserList/userlist.vue')), 'list');
const articlelist = r => require.ensure([], () => r(require('../src/views/Articlelist/articlelist.vue')), 'articlelist');
const shoplist = r => require.ensure([], () => r(require('../src/views/Shoplist/shoplist.vue')), 'shoplist');
const administratorsettings = r => require.ensure([], () => r(require('../src/views/AdministratorSettings/administratorsettings.vue')), 'administratorsettings');
const userlimit = r => require.ensure([], () => r(require('../src/views/UserLimit/userlimit')), 'userlimit');
const panel = r => require.ensure([], () => r(require('../src/views/Panel/panel')), 'panel');
const rolemanagement = r => require.ensure([], () => r(require('../src/views/RoleManagement/rolemanagement')), 'rolemanagement');
const accessthemenu = r => require.ensure([], () => r(require('../src/views/AccessTheMenu/accessthemenu')), 'accessthemenu');
const informmanagement = r => require.ensure([], () => r(require('../src/views/InformManagement/informmanagement')), 'informmanagement');
const appreleased = r => require.ensure([], () => r(require('../src/views/AppReleased/appreleased')), 'appreleased');
const projectDetails = r => require.ensure([], () => r(require('../src/views/ProjectDetails/projectDetails')), 'projectDetails');
const launchProject = r => require.ensure([], () => r(require('../src/views/LaunchProject/launchProject')), 'launchProject');
const decorateDetails = r => require.ensure([], () => r(require('../src/views/DecorateDetails/decorateDetails')), 'decorateDetails');
const jobContent = r => require.ensure([], () => r(require('../src/views/JobContent/jobContent')), 'jobContent');
const configureClient = r => require.ensure([], () => r(require('../src/views/ConfigureClient/configureClient')), 'configureClient');
const configureClientTwo = r => require.ensure([], () => r(require('../src/views/ConfigureClientTwo/configureClientTwo')), 'configureClientTwo');
const configurationForeman = r => require.ensure([], () => r(require('../src/views/ConfigurationForeman/configurationForeman')), 'configurationForeman');
const configurationDesigner = r => require.ensure([], () => r(require('../src/views/ConfigurationDesigner/configurationDesigner')), 'configurationDesigner');
const configurationEngineering = r => require.ensure([], () => r(require('../src/views/ConfigurationEngineering/configurationEngineering')), 'configurationEngineering');
const nodeConfigured = r => require.ensure([], () => r(require('../src/views/NodeConfigured/nodeConfigured')), 'nodeConfigured');
const masterDetails = r => require.ensure([], () => r(require('../src/views/MasterDetails/masterDetails')), 'masterDetails');
const designerDetails = r => require.ensure([], () => r(require('../src/views/DesignerDetails/designerDetails')), 'designerDetails');
const engineeringDetail = r => require.ensure([], () => r(require('../src/views/EngineeringDetail/engineeringDetail')), 'engineeringDetail');
const pageBanner = r => require.ensure([], () => r(require('../src/views/PageBanner/pageBanner')), 'pageBanner');
const manageBanner = r => require.ensure([], () => r(require('../src/views/ManageBanner/manageBanner')), 'manageBanner');
const clientBanner = r => require.ensure([], () => r(require('../src/views/ClientBanner/clientBanner')), 'clientBanner');
const uploadPictures = r => require.ensure([], () => r(require('../src/views/UploadPictures/uploadPictures')), 'uploadPictures');
const viewBanner = r => require.ensure([], () => r(require('../src/views/ViewBanner/viewBanner')), 'viewBanner');
const editorBanner = r => require.ensure([], () => r(require('../src/views/EditorBanner/editorBanner')), 'editorBanner');
const systemPage = r => require.ensure([], () => r(require('../src/views/SystemPage/systemPage')), 'systemPage');
const addStandard = r => require.ensure([], () => r(require('../src/views/AddStandard/addStandard')), 'addStandard');
const viewStandard = r => require.ensure([], () => r(require('../src/views/ViewStandard/viewStandard')), 'viewStandard');
const editorStandard = r => require.ensure([], () => r(require('../src/views/EditorStandard/editorStandard')), 'editorStandard');
const roleList = r => require.ensure([], () => r(require('../src/views/RoleList/roleList')), 'roleList');

const checkuserlist = r => require.ensure([], () => r(require('../src/views/CheckUserlist/checkuserlist.vue')), 'checkuserlist');
const newUserList = r => require.ensure([], () => r(require('../src/views/NewUserList/newUserList.vue')), 'newUserList');
const checkIndentlist = r => require.ensure([], () => r(require('../src/views/CheckIndentlist/checkIndentlist')), 'checkIndentlist');
const checkShopList = r => require.ensure([], () => r(require('../src/views/CheckShopList/checkShopList')), 'checkShopList');
const checkRoleManagement = r => require.ensure([], () => r(require('../src/views/CheckRoleManagement/checkRoleManagement')), 'checkRoleManagement');



//回收站
const userlistRecycle = r => require.ensure([], () => r(require('../src/views/UserListRecycle/userlistRecycle')), 'userlistRecycle');
const indentlistRecycle = r => require.ensure([], () => r(require('../src/views/IndentlistRecycle/indentlistRecycle')), 'indentlistRecycle');
const shopListRecycle = r => require.ensure([], () => r(require('../src/views/ShopListRecycle/shopListRecycle')), 'shopListRecycle');
const administratorSettingsRecycle = r => require.ensure([], () => r(require('../src/views/AdministratorSettingsRecycle/administratorSettingsRecycle')), 'administratorSettingsRecycle');
const roleManagementRecycle = r => require.ensure([], () => r(require('../src/views/RoleManagementRecycle/roleManagementRecycle')), 'roleManagementRecycle');

const router = new Router({
  routes: [
    {
      path: '/',
      component: login
    },
    {
      path: '/index',
      component: index,
      children: [
        {
          path: '/mangen',
          component: mangen,
          meta: ['数据统计'],
        },
        {
          path: '/userlist',
          component: userlist,
          meta: ['客户管理'],
        },
        {
          path: '/userlistRecycle',
          component: userlistRecycle,
          meta: ['客户管理', '回收站'],
        },
        {
          path: '/userlimit',
          component: userlimit,
          meta: ['客户管理', '客户详情'],
        },
        {
          path: '/checkuserlist',
          component: checkuserlist,
          meta: ['客户管理', '修改信息'],
        },
        {
          path: '/newUserList',
          component: newUserList,
          meta: ['客户管理', '添加用户'],
        },
        {
          path: '/panel',
          component: panel,
          meta: ['用户管理', '名单'],
        },
        {
          path: '/indentlist',
          component: indentlist,
          meta: ['项目管理'],
        },
        {
          path: '/checkIndentlist',
          component: checkIndentlist,
          meta: ['项目管理', '修改项目'],
        },
        {
          path: '/indentlistRecycle',
          component: indentlistRecycle,
          meta: ['项目管理', '回收站'],
        },
        {
          path: '/projectDetails',
          component: projectDetails,
          meta: ['项目管理', '项目详情'],
        },
        {
          path: '/launchProject',
          component: launchProject,
          meta: ['装修详情'],
        },
        {
          path: '/decorateDetails',
          component: decorateDetails,
          meta: ['发起项目'],
        },
        {
          path: '/configureClient',
          component: configureClient,
          meta: ['配置客户'],
        },
        {
          path: '/configureClientTwo',
          component: configureClientTwo,
          meta: ['配置客户'],
        },
        {
          path: '/shoplist',
          component: shoplist,
          meta: ['工长管理'],
        },
        {
          path: '/checkShopList',
          component: checkShopList,
          meta: ['工长修改'],
        },
        {
          path: '/shopListRecycle',
          component: shopListRecycle,
          meta: ['工长管理', '回收站'],
        },
        {
          path: '/masterDetails',
          component: masterDetails,
          meta: ['工长管理', '工长详情'],
        },
        {
          path: '/configurationForeman',
          component: configurationForeman,
          meta: ['配置工长'],
        },
        {
          path: '/administratorsettings',
          component: administratorsettings,
          meta: ['设计师管理'],
        },
        {
          path: '/administratorSettingsRecycle',
          component: administratorSettingsRecycle,
          meta: ['设计师管理', '回收站'],
        },
        {
          path: '/designerDetails',
          component: designerDetails,
          meta: ['设计师管理', '设计师详情'],
        },
        {
          path: '/rolemanagement',
          component: rolemanagement,
          meta: ['工程部管理'],
        },
        {
          path: '/checkRoleManagement',
          component: checkRoleManagement,
          meta: ['工程部修改'],
        },
        {
          path: '/roleManagementRecycle',
          component: roleManagementRecycle,
          meta: ['工程部管理', '回收站'],
        },
        {
          path: '/engineeringDetail',
          component: engineeringDetail,
          meta: ['工程部管理', '工程部详情'],
        },
        {
          path: '/configurationDesigner',
          component: configurationDesigner,
          meta: ['配置设计师'],
        },
        {
          path: '/configurationEngineering',
          component: configurationEngineering,
          meta: ['配置工程部'],
        },
        {
          path: '/nodeConfigured',
          component: nodeConfigured,
          meta: ['配置项目阶段节点'],
        },
        {
          path: '/articlelist',
          component: articlelist,
          meta: ['项目阶段流程设置'],
        },
        {
          path: '/jobContent',
          component: jobContent,
          meta: ['项目阶段流程设置', '工作内容设置'],
        },
        {
          path: '/addStandard',
          component: addStandard,
          meta: ['项目阶段流程设置', '工作内容设置','增加装修标准'],
        },
        {
          path: '/viewStandard',
          component: viewStandard,
          meta: ['项目阶段流程设置', '工作内容设置','查看装修标准'],
        },
        {
          path: '/editorStandard',
          component: editorStandard,
          meta: ['项目阶段流程设置', '工作内容设置','编辑装修标准'],
        },
        {
          path: '/pageBanner',
          component: pageBanner,
          meta: ['运营管理', ' banner管理', '工长端banner管理'],
        },
        {
          path: '/manageBanner',
          component: manageBanner,
          meta: ['运营管理', ' banner管理','管理端小程序banner管理'],
        },
        {
          path: '/clientBanner',
          component: clientBanner,
          meta: ['运营管理', ' banner管理','客户端小程序banner管理'],
        },
        {
          path: '/uploadPictures',
          component: uploadPictures,
          meta: ['上传图片'],
        },
        {
          path: '/viewBanner',
          component: viewBanner,
          meta: ['运营管理', ' banner管理','查看图片'],
        },
        {
          path: '/editorBanner',
          component: editorBanner,
          meta: ['运营管理', ' banner管理','编辑图片'],
        },
        {
          path: '/accessthemenu',
          component: accessthemenu,
          meta: ['系统管理', '权限菜单'],
        },
        {
          path: '/systemPage',
          component: systemPage,
          meta: ['系统管理','管理员设置'],
        },
        {
          path: '/roleList',
          component: roleList,
          meta: ['系统管理', '角色列表'],
        },
        {
          path: '/informmanagement',
          component: informmanagement,
          meta: ['系统管理', '日志管理'],
        },
        {
          path: '/appreleased',
          component: appreleased,
          meta: ['系统管理', 'App发布'],
        }
      ]
    },
  
]
})

router.beforeEach((to, from, next) => {
  var logData = localStorage.getItem('resStatus')
    
    if (logData == 401) {
      if(to.path=='/'){//解决beforeEach无限循环
        next();
      }else{
        next({
          // 登录过期跳转
          path: '/'
        })
      }
    } else {
      next();  
    }
 
})

export default router
