import Vue from 'vue'
import Router from 'vue-router'

import MainPage from '@/components/MainPage'
import Hey from '@/components/Hey'
const Customer = resolve => require(['@/components/Customer'], resolve)
const NewCustomer = resolve => require(['@/components/NewCustomer'], resolve)
const Supplier = resolve => require(['@/components/Supplier'], resolve)
const NewSupplier = resolve => require(['@/components/NewSupplier'], resolve)
const Service = resolve => require(['@/components/Service'], resolve)
const NewService = resolve => require(['@/components/NewService'], resolve)

import PageNotFound from '@/components/PageNotFound'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'MainPage',
      component: MainPage
    }, {
      path: '/hey',
      name: 'Hey',
      component: Hey
    }, {
      path: '/customer',
      name: 'Customer',
      component: Customer
    }, {
      path: '/customer/new',
      name: 'NewCustomer',
      component: NewCustomer
    }, {
      path: '/customer/:id',
      name: 'EditCustomer',
      component: NewCustomer
    }, {
      path: '/supplier',
      name: 'Supplier',
      component: Supplier
    }, {
      path: '/supplier/new',
      name: 'NewSupplier',
      component: NewSupplier
    }, {
      path: '/supplier/:id',
      name: 'EditSupplier',
      component: NewSupplier
    }, {
      path: '/service',
      name: 'Service',
      component: Service
    }, {
      path: '/service/new',
      name: 'NewService',
      component: NewService
    }, {
      path: '/service/:id',
      name: 'EditService',
      component: NewService
    }, {
      path: '*',
      component: PageNotFound
    }
  ]
})
