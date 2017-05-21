import Vue from 'vue'
import Router from 'vue-router'

import Hello from '@/components/Hello'
import Hey from '@/components/Hey'
import Customer from '@/components/Customer'
import NewCustomer from '@/components/NewCustomer'
import Supplier from '@/components/Supplier'
import NewSupplier from '@/components/NewSupplier'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
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
    }
  ]
})
