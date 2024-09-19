import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/tab1'
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1Page.vue')
      },
      {
        path: 'AuthLogin',
        component: () => import('@/views/AuthLogin.vue')
      },
      {
        path: 'AuthRegister',
        component: () => import('@/views/AuthRegister.vue')
      },
      {
        path: "YandexTokenReceive",
        component: () => import('@/views/YandexTokenReceive.vue')
      },
      {
        path: "Events/Feed",
        component: () => import('@/views/Events/Feed.vue')
      },
      {
        path: "Events/Add",
        component: () => import('@/views/Events/Add.vue')
      },
      {
        path: "Events/View/:id",
        component: () => import('@/views/Events/View.vue')
      },
      {
        path: "Events/View/:id/Register",
        component: () => import('@/views/Events/RegisterForEvent.vue')
      },
      {
        path: "Events/RegistrationSent",
        component: () => import('@/views/Events/RegistrationSent.vue')
      },
      {
        path: "Shorts/Upload",
        component: () => import('@/views/Shorts/Upload.vue')
      },
      {
        path: "Coins/Main",
        component: () => import('@/views/Coins/Main.vue')
      },
      {
        path: "Organizers/ProfileFill",
        component: () => import('@/views/Organizers/ProfileFill.vue')
      },
      {
        path: "PointsMap",
        component: () => import('@/views/PointsMap.vue')
      },
      {
        path: "HomePage",
        component: () => import('@/views/HomePage.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
