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

import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.config.productionTip = false

Vue.use(VueFire)
Vue.use(Vuetify)
Vue.use(VueAxios, axios)

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
  data () {
    return {
      global: globals,
      db,
      citys: {
        keelungCity: {
          id: 1,
          title: '基隆市',
          name: 'keelungCity',
          districts: []
        },
        newTaipeiCity: {
          id: 2,
          title: '新北市',
          name: 'newTaipeiCity',
          districts: []
        },
        taipeiCity: {
          id: 3,
          title: '台北市',
          name: 'taipeiCity',
          districts: []
        },
        taoyuanCity: {
          id: 4,
          title: '桃園市',
          name: 'taoyuanCity',
          districts: []
        },
        hsinchuCounty: {
          id: 5,
          title: '新竹縣',
          name: 'hsinchuCounty',
          districts: []
        },
        hsinchuCity: {
          id: 6,
          title: '新竹市',
          name: 'hsinchuCity',
          districts: []
        },
        miaoliCounty: {
          id: 7,
          title: '苗栗縣',
          name: 'miaoliCounty',
          districts: []
        },
        taichungCity: {
          id: 8,
          title: '台中市',
          name: 'taichungCity',
          districts: []
        },
        nantouCounty: {
          id: 9,
          title: '南投縣',
          name: 'nantouCounty',
          districts: []
        },
        changhuaCounty: {
          id: 10,
          title: '彰化縣',
          name: 'changhuaCounty',
          districts: []
        },
        yunlinCounty: {
          id: 11,
          title: '雲林縣',
          name: 'yunlinCounty',
          districts: []
        },
        chiayiCounty: {
          id: 12,
          title: '嘉義縣',
          name: 'chiayiCounty',
          districts: []
        },
        chiayiCity: {
          id: 13,
          title: '嘉義市',
          name: 'chiayiCity',
          districts: []
        },
        tainanCity: {
          id: 14,
          title: '台南市',
          name: 'tainanCity',
          districts: []
        },
        kaohsiungCity: {
          id: 15,
          title: '高雄市',
          name: 'kaohsiungCity',
          districts: []
        },
        pingtungCounty: {
          id: 16,
          title: '屏東縣',
          name: 'pingtungCounty',
          districts: []
        },
        yilanCounty: {
          id: 17,
          title: '宜蘭縣',
          name: 'yilanCounty',
          districts: []
        },
        hualienCounty: {
          id: 18,
          title: '花蓮縣',
          name: 'hualienCounty',
          districts: []
        },
        taitungCounty: {
          id: 19,
          title: '台東縣',
          name: 'taitungCounty',
          districts: []
        },
        penghuCounty: {
          id: 20,
          title: '澎湖縣',
          name: 'penghuCounty',
          districts: []
        }
      },
      districts: []
    }
  },
  methods: {
    getDistricts: async function (city) {
      let districts = []
      if (this.citys[city] && this.citys[city].districts.length > 0) {
        return this.citys[city].districts
      }
      await this.axios.get(`/static/location/${city}.json`)
        .then(response => {
          districts = JSON.parse(JSON.stringify(response.data))
          this.citys[city].districts = JSON.parse(JSON.stringify(response.data))
        })
        .catch(error => {
          console.log(error)
        })
      return districts
    }
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
