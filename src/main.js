import { Vue, createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import HW1 from './components/HW1.vue'
import HW2 from './components/HW2.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/hw1' },
        { path: '/hw1', component: HW1 },
        { path: '/hw2', component: HW2 }
    ]
})
const app = createApp(App);
app.use(router)

app.mount('#app')
