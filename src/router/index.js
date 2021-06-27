import Router from 'vue-router';
import AppLogin from '@/components/AppLogin';
import AppSignup from '@/components/AppSignup';
import AppHome from '@/components/AppHome';
import Canvas from '@/components/Canvas';
import Saved from '@/components/Saved';
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
            name: 'saved',
            path: '/saved',
            component: Saved,
            meta
        },
        {
            name: 'canvas',
            path: '/doodle/:sessionId',
            component: Canvas,
            props:true,
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
    } else if(from.name === 'canvas')
    {   const exit  = localStorage.getItem('exit');
        console.log(exit);
        if(exit){
            next();
        }else{
            const answer = window.confirm(`Do you really want to leave? you have unsaved changes!`)
            if (answer) {
              next()
            } else {
              next(false)
            }
        }
    }
    else{
        next();
    }
});

export default router;