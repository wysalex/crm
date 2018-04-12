import Vue from 'vue'
import Router from 'vue-router'

import MainPage from '@/components/MainPage'
import Hey from '@/components/Hey'
import Customer from '@/components/Customer'
import NewCustomer from '@/components/NewCustomer'
import Supplier from '@/components/Supplier'
import NewSupplier from '@/components/NewSupplier'
import Service from '@/components/Service'

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
