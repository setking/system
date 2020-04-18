import {get, post} from './axios'

export const pages = () => get('/index/indexPage')
//登陆接口
export const loginfouser = data => post('/login/passLogin', data);
// 数据统计
export const homeList = () => get("/index/getTotal")
// 客户管理
export const clientList = page => get("/customer/getJzbUser", page)

// 用户详情
export const zbProject = page => get("/project/getInitJzbProject", page)

//用户列表
export const zbClient = page => get("/customer/getJzbProject", page)

//项目详情
export const getProject = page => get("/project/getProjectFlowList", page)

// 项目阶段流程设置
export const getProjectFather = page => get('/project/getProjectFlowParent', page)

// 装修标准详情
export const viewStand = page => get('/project/getAnPFSById', page)


// 节点数据
export const getProjectChildren = page => get('/project/getProjectFlowChild', page) 

//节点详情
export const ansbyid = page => get('/project/getAnPFSById', page) 

//添加客户
export const addClient = page => get('/project/matchUser', page) 

//修改客户
export const editClient = page => get('/customer/updateUserById', page) 

//获取客户信息
export const getClient = page => get('/customer/getUserById', page) 

//新建客户
export const createClient = page => get('/customer/createAnUser', page) 


// 上传节点
export const addProject = page => get('/project/createAnProject', page)

// 获取穿梭框数据
export const getTreeNodes = () => get('/project/createTreeNodes')

// 修改标题
export const editProject = page => get('/project/updateProjectFlowTitle', page)

// 更新用户信息
export const updateProject = page => get('/project/updateProject', page)

// 删除数据
export const deletProject = page => get('/project/deleteProjectFlowById', page)

// 添加节点
export const createProject = page => get('/project/createProjectFlow', page)

// 添加装修标准
export const addsSand = page => post('/project/createStand', page)

// 修改装修标准
export const editSand = page => post('/project/updatePFSById', page) 

// 设计师列表
export const designerList = page => get('/customer/getDesignerList', page)

// 设计师记录
export const getDesignerList = page => get('/project/getDesignerList', page)

// banner列表
export const bannerList = page => get('/banner/getBannerList', page)

// 修改banner
export const createBanner = page => get('/banner/updateBanner', page)


// 创建banner
export const NewBanner = page => get('/banner/createAnBanner', page)



// 删除banner
export const deletBanner = page => get('/banner/deleteBanner', page)

// 查看banner
export const viewBanner = page => get('/banner/getBannerById', page)

// 日志列表
export const logList = page => get('/log/getLogList', page)


// 管理员列表
export const mangeList = page => get('/manager/getBackUserList', page)

// 获取指定管理员
export const onlyMange = page => get('/manager/getManagerAdminById', page)

// 编辑管理员
export const editMange = page => get('/manager/updateManagerAdmin', page)

// 增加管理员
export const createMange = page => get('/manager/createBackUser', page)

// 删除管理员
export const deletMangeList = page => get('/manager/deleteManagerAdmin', page)

//获取角色列表
export const roleData = page => get('/role/getRoleList', page)

//获取角色信息
export const roleList = page => get('/role/getRoleNameList', page)

//获取指定角色信息
export const getRoleId = page => get('/role/getRoleById', page)

//删除角色信息
export const deletRole = page => get('/role/deleteRole', page)

//创建角色信息
export const createRole = page => get('/role/createRole', page)

//修改角色信息
export const editRole = page => get('/role/updateRole', page)


//菜单列表
export const menuList = page => get('/menu/getMenuList', page)

//菜单列表
export const addMenu = page => get('/menu/addMenu', page) 

//删除菜单
export const deletMenu = page => get('/menu/deleteMenu', page)

//父级菜单
export const fatherList = page => get('/menu/getParentMenu', page)

//获取指定菜单
export const menubyID = page => get('/menu/getMenuById', page)

//更新菜单
export const updateMenu = page => get('/menu/updateMenu', page)


//------------------------------------回收站--------------------

export const deletUserList = page => post('/customer/updateCustomerStatus', page)

export const deletIndentList = page => post('/project/updateProjectStatus', page)

export const deletDesigner = page => post('/customer/updateDesignerStatus', page)






