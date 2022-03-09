const sortingRouter = {
    path: '/dashboard',
    component: () => import('./index.vue'),
    name: 'dashboard',
    meta: { title: '首页' }
}

export default sortingRouter;
