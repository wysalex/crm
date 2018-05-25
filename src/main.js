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
import VueProgressBar from 'vue-progressbar'
import idb from 'idb'
Vue.config.productionTip = false

Vue.use(VueFire)
Vue.use(Vuetify)
Vue.use(VueAxios, axios)
Vue.use(VueProgressBar, {
  thickness: '4px'
})

const asyncForEach = async function (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

// Initail indexedDB
let needUpdateDB = false
idb.open('crmDB', 1, async upgradeDB => {
  needUpdateDB = true
  console.log('need upgrade database')
  let objectStore
  objectStore = upgradeDB.createObjectStore('location', { keyPath: 'id', autoIncrement: true })
  objectStore.createIndex('city', 'city', { unique: false })
  objectStore.createIndex('zip_code', 'zip_code', { unique: false })
  objectStore.createIndex('city_zh', 'city_zh', { unique: false })
  objectStore.createIndex('district_zh', 'district_zh', { unique: false })
  objectStore.createIndex('city_en', 'city_en', { unique: false })
  objectStore.createIndex('district_en', 'district_en', { unique: false })

  objectStore = upgradeDB.createObjectStore('road', { keyPath: 'id' })
  objectStore.createIndex('zipCode', 'zipCode', { unique: false })
  objectStore.createIndex('city', 'city', { unique: false })
  objectStore.createIndex('area', 'area', { unique: false })
  objectStore.createIndex('road', 'road', { unique: false })

  objectStore = upgradeDB.createObjectStore('product', { keyPath: 'id' })
  objectStore.createIndex('productName', 'productName', { unique: false })
  objectStore.createIndex('shortCode', 'shortCode', { unique: false })

  objectStore = upgradeDB.createObjectStore('hantShortCode', { keyPath: 'id', autoIncrement: true })
  objectStore.createIndex('hant', 'hant', { unique: false })
  objectStore.createIndex('shortCode', 'shortCode', { unique: false })
}).then(async dbh => {
  if (needUpdateDB) {
    let tx
    let store

    // insert location
    let cityData = []
    const startGetCity = async () => {
      await asyncForEach([
        'changhuaCounty',
        'chiayiCity',
        'chiayiCounty',
        'diaoyutai',
        'hsinchuCity',
        'hsinchuCounty',
        'hualienCounty',
        'kaohsiungCity',
        'keelungCity',
        'kinmenCounty',
        'lienchiangCounty',
        'miaoliCounty',
        'nanhaiIslands',
        'nantouCounty',
        'newTaipeiCity',
        'penghuCounty',
        'pingtungCounty',
        'taichungCity',
        'tainanCity',
        'taipeiCity',
        'taitungCounty',
        'taoyuanCity',
        'yilanCounty',
        'yunlinCounty'
      ], async cityName => {
        await axios.get(`/static/location/${cityName}.json`)
          .then(response => {
            let tempCities = response.data.map(cityInfo => {
              cityInfo.city = cityName
              return cityInfo
            })
            cityData = cityData.concat(tempCities)
          })
          .catch(error => {
            console.log(error)
          })
      })
      tx = dbh.transaction('location', 'readwrite')
      store = tx.objectStore('location')
      let citySucceeded = 0
      const insertLocation = () => new Promise((resolve, reject) => {
        const doNextRecordCity = () => {
          if (citySucceeded < cityData.length) {
            store.put(cityData[citySucceeded])
              .then(() => {
                doNextRecordCity()
              })
              .catch(error => {
                console.log(error)
                resolve(false)
              })
            ++citySucceeded
          } else {
            resolve(true)
          }
        }
        doNextRecordCity()
      })
      await insertLocation()
    }
    await startGetCity()
    console.log('insert city end')

    // insert road scope
    let zipCodeData = []
    await axios.get('/static/zipCode.json')
      .then(response => {
        zipCodeData = response.data
      })
      .catch(error => {
        console.log(error)
      })
    const insertRoad = () => new Promise((resolve, reject) => {
      const startGetRoad = () => {
        tx = dbh.transaction('road', 'readwrite')
        store = tx.objectStore('road')
        let zipCodeSucceeded = 0
        const doNextRecordZipCode = () => {
          if (zipCodeSucceeded < zipCodeData.length) {
            store.put(zipCodeData[zipCodeSucceeded])
              .then(() => {
                doNextRecordZipCode()
              })
              .catch(error => {
                console.log(error)
                resolve(false)
              })
            ++zipCodeSucceeded
          } else {
            resolve(true)
          }
        }
        doNextRecordZipCode()
      }
      startGetRoad()
    })
    await insertRoad()
    console.log('insert road end')

    // insert product list
    let productData = []
    await axios.get('/static/products.json')
      .then(response => {
        productData = response.data
      })
      .catch(error => {
        console.log(error)
      })
    tx = dbh.transaction('product', 'readwrite')
    store = tx.objectStore('product')
    productData.forEach(productInfo => {
      store.put(productInfo)
    })
    console.log('insert product end')

    // insert hant map
    let hantShortCode = []
    await axios.get('/static/hantShortCode.json')
      .then(response => {
        hantShortCode = response.data
      })
      .catch(error => {
        console.log(error)
      })
    tx = dbh.transaction('hantShortCode', 'readwrite')
    store = tx.objectStore('hantShortCode')
    let hantMapSucceeded = 0
    const insertHantMap = () => new Promise((resolve, reject) => {
      const doNextRecord = () => {
        if (hantMapSucceeded < hantShortCode.length) {
          store.put(hantShortCode[hantMapSucceeded])
            .then(() => {
              doNextRecord()
            })
            .catch(error => {
              console.log(error)
              resolve(false)
            })
          ++hantMapSucceeded
        } else {
          resolve(true)
        }
      }
      doNextRecord()
    })
    await insertHantMap()
    console.log('insert hant end')

    console.log('indexed db initial complete')
    return tx.complete
  }
})

// Initialize Firebase
/**
 * firebase javascript api reference
 * https://firebase.google.com/docs/reference/js/
 */
const firebaseConfig = {
  apiKey: 'AIzaSyDyZlqHISZWYp_vsyoLtpBwCVHnJTm_J6k',
  authDomain: 'my-cms-9c5f1.firebaseapp.com',
  databaseURL: 'https://my-cms-9c5f1.firebaseio.com',
  projectId: 'my-cms-9c5f1',
  storageBucket: 'my-cms-9c5f1.appspot.com',
  messagingSenderId: '61829099555'
}
const app = firebase.initializeApp(firebaseConfig)

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
          title: '臺北市',
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
          title: '臺中市',
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
          title: '臺南市',
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
          title: '臺東縣',
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
    waitFor (promise) {
      return promise
        .then((data) => [null, data])
        .catch(err => {
          return [err, undefined]
        })
    },
    sleep (ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    async getDistricts (city) {
      const queryDB = function () {
        return new Promise((resolve, reject) => {
          let districts = []
          const dbPromis = idb.open('crmDB')
          dbPromis.then(db => {
            db.transaction('location')
              .objectStore('location')
              .index('city')
              .openCursor(IDBKeyRange.only(city))
              .then(function cursorIterate (cursor) {
                if (!cursor) {
                  resolve(districts)
                  return
                }
                if (cursor.value) {
                  districts.push({
                    zip_code: cursor.value.zip_code,
                    city_zh: cursor.value.city_zh,
                    district_zh: cursor.value.district_zh,
                    city_en: cursor.value.city_en,
                    district_en: cursor.value.district_en
                  })
                }
                return cursor.continue().then(cursorIterate)
              })
          })
        })
      }
      if (city) {
        const districts = await queryDB()
        return districts
      } else {
        return []
      }
    },
    /**
     * TODO
     * maybe can change to navigator.serviceWorker
     * this function is used original api
     */
    async initialAddressDB () {
      this.$Progress.start()
      let total = 0
      let succeeded = 0
      let triggered = []
      let zipCodeData = []
      let addressDB
      await this.axios.get('/static/zipCode.json')
        .then(response => {
          zipCodeData = response.data
          total = response.data.length
        })
        .catch(error => {
          console.log(error)
        })

      // use original method
      let addressRequest = indexedDB.open('crmDB')
      addressRequest.onerror = $event => {
        alert('indexed DB error')
      }
      addressRequest.onupgradeneeded = $event => {
        addressDB = addressRequest.result
        const objectStore = addressDB.createObjectStore('road', { keyPath: 'id' })
        objectStore.createIndex('zipCode', 'zipCode', { unique: false })
        objectStore.createIndex('city', 'city', { unique: false })
        objectStore.createIndex('area', 'area', { unique: false })
        objectStore.createIndex('road', 'road', { unique: false })
      }
      addressRequest.onsuccess = async $event => {
        addressDB = addressRequest.result
        const transaction = addressDB.transaction('road', 'readwrite')
        const objectStore = transaction.objectStore('road')

        zipCodeData.forEach(zipInfo => {
          objectStore.add(zipInfo)
          succeeded++
          const successfully = parseInt(succeeded / total * 100)
          if (
            successfully > 0 &&
            successfully % 25 === 0 &&
            triggered.indexOf(successfully) < 0 &&
            successfully !== 100
          ) {
            triggered.push(successfully)
            this.$Progress.set(successfully)
          }
        })
        this.$Progress.finish()
      }
    },
    /**
     * 取得中文的簡碼
     * @param {string} hant
     * @return {string}
     */
    async getShortCode (hant) {
      const queryDB = function () {
        return new Promise((resolve, reject) => {
          let hasShortCode = false
          const dbPromis = idb.open('crmDB')
          dbPromis.then(db => {
            db.transaction('hantShortCode')
              .objectStore('hantShortCode')
              .index('hant')
              .openCursor(IDBKeyRange.only(hant))
              .then(function cursorIterate (cursor) {
                if (!cursor) {
                  if (hasShortCode === false) {
                    resolve(hant)
                  }
                  return
                }
                if (cursor.value) {
                  hasShortCode = true
                  resolve(cursor.value.shortCode)
                  return
                }
                return cursor.continue().then(cursorIterate)
              })
          })
        })
      }
      if (hant) {
        const shortCode = await queryDB()
        return shortCode
      } else {
        return ''
      }
    },
    async getRoads (zipCode) {
      const queryDB = function () {
        return new Promise((resolve, reject) => {
          let roads = []
          const dbPromis = idb.open('crmDB')
          dbPromis.then(db => {
            db.transaction('road')
              .objectStore('road')
              .index('zipCode')
              .openCursor(IDBKeyRange.bound(`${zipCode}00`, `${zipCode}99`, true, true), IDBCursor.NEXT)
              .then(function cursorIterate (cursor) {
                if (!cursor) {
                  resolve(roads)
                  return
                }
                if (cursor.value) {
                  roads.push({
                    id: cursor.value.id,
                    zipCode: cursor.value.zipCode,
                    city: cursor.value.city,
                    area: cursor.value.area,
                    road: cursor.value.road,
                    scope: cursor.value.scope,
                    roadScope: `${cursor.value.road} / ${cursor.value.scope.trim()}`
                  })
                }
                return cursor.continue().then(cursorIterate)
              })
          })
        })
      }
      if (zipCode.toString().length === 3) {
        const roads = await queryDB()
        roads.sort((a, b) => {
          return a.roadScope.localeCompare(b.roadScope, 'zh-Hant-TW')
        })
        return roads
      } else {
        return []
      }
    },
    /**
     * 全行轉半型
     * @param {string} val
     * @return {string}
     */
    full2half (val) {
      let result = ''
      if (val.length > 0) {
        for (let i = 0; i <= val.length; i++) {
          if (val.charCodeAt(i) === 12288) {
            result += ' '
          } else {
            if (val.charCodeAt(i) > 65280 && val.charCodeAt(i) < 65375) {
              result += String.fromCharCode(val.charCodeAt(i) - 65248)
            } else {
              result += String.fromCharCode(val.charCodeAt(i))
            }
          }
        }
      }
      return result
    }
  }
})
/* eslint-disable no-new */

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    new Vue({
      el: '#app',
      mode: 'history',
      router,
      store,
      template: '<App/>',
      components: { App }
    })
  } else {
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
