// 暂用同步
// import Login from '@/views/login/index.vue'
// import NotFound from '@/views/404/index.vue'

// 采用异步按需加载组件模式,打包后router报错n.e,后期解决
const Index = () => import('@/views/index/index.vue')
const Login = () => import('@/views/login/index.vue')
const NotFound = () => import('@/views/404/index.vue')

const routes = [{
    path: '/',
    redirect: '/index'
}, {
    path: '/index',
    name: 'Index',
    meta: {
        keepAlive: true,
        title: '首页'
    },
    // component: Index
    component: () => import('@/views/index/index.vue')
}, {
    path: '/login',
    name: 'Login',
    meta: {
        keepAlive: true,
        title: '绑定手机号'
    },
    component: Login
},
{
    path: '*',
    meta: {
        keepAlive: true,
        title: '404'
    },
    component: NotFound
}
]

export default routes
