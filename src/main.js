// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import '../src/assets/css/icon.css'
import Vue from 'vue'
import store from './store'
import App from './App'
import SignIn from './components/SignIn'
import router from './router'
import firebase from 'firebase'
import VueFire from 'vuefire'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.config.productionTip = false

Vue.use(VueFire)
Vue.use(Vuetify)

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyDyZlqHISZWYp_vsyoLtpBwCVHnJTm_J6k',
  authDomain: 'my-cms-9c5f1.firebaseapp.com',
  databaseURL: 'https://my-cms-9c5f1.firebaseio.com',
  projectId: 'my-cms-9c5f1',
  storageBucket: 'my-cms-9c5f1.appspot.com',
  messagingSenderId: '61829099555'
}
const app = firebase.initializeApp(firebaseConfig)
const email = 'wysalexwang@gmail.com'
const password = 'PassWord'
firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
  var errorCode = error.code
  var errorMessage = error.message
  console.log(errorCode)
  console.log(errorMessage)
})

const db = firebase.database()

// Globals variable
const globals = {
  router,
  app,
  firebase,
  db
}

Vue.mixin({
  beforeCreate: function () {
    this.global = globals
  }
})
/* eslint-disable no-new */

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log('User is signed in.')
    new Vue({
      el: '#app',
      mode: 'history',
      router,
      store,
      template: '<App/>',
      components: { App }
    })
  } else {
    console.log('No user is signed in.')
    new Vue({
      el: '#app',
      mode: 'history',
      router,
      store,
      template: '<SignIn/>',
      components: { SignIn }
    })
  }
})
