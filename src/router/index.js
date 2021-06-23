import Router from 'vue-router';
import AppLogin from '@/components/AppLogin';
import AppSignup from '@/components/AppSignup';
import AppHome from '@/components/AppHome';
import Canvas from '@/components/Canvas';
import PageNotFound from '@/components/PageNotFound';

import store from '@/store';

const meta = {
    authorize: []
};
const router = new Router({
    mode: 'history',
    routes: [
        {
            name: 'login',
            path: '/login',
            component: AppLogin
        },
        {
            name: 'signup',
            path: '/signup',
            component: AppSignup
        },
        {
            name: 'home',
            path: '/',
            component: AppHome,
            meta
        },
        {
            name: 'canvas',
            path: '/doodle',
            component: Canvas,
            meta
        },
        {
            name: 'page-not-found',
            path: '*',
            component: PageNotFound
        }
    ]
});


// Global auth guard
router.beforeEach(( to, from, next ) => {
    // Right now, role-based authorization is NOT supported
    if( to.meta.authorize && !store.getters.isAuthenticated ) {
        next({
            name: 'login'
        });
    } else {
        next();
    }
});

export default router;