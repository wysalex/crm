<template>
  <section>

    <v-form id="newCustomerCard" v-model="validForm" ref="form" lazy-validation>
      <div class="container">
        <header>
          <div class="title">{{ func.main }}</div>
          <div class="more"></div>
        </header>
        <v-container grid-list-md text-xs-center class="content">
          <v-layout row wrap>
            <v-flex xs12 sm7>
              <v-text-field
                label="客戶姓名"
                v-model="form.name"
                :rules="[() => form.name.length > 0 || '請輸入客戶姓名']"
                @change="transShortCode"
                required
              >
              </v-text-field>
            </v-flex>
            <v-flex xs12 sm5>
              <v-text-field
                label="簡碼"
                v-model="form.shortCode">
              </v-text-field>
            </v-flex>
            <v-flex xs12 sm7>
              <v-text-field
                label="公司名稱"
                v-model="form.company">
              </v-text-field>
            </v-flex>
            <v-flex xs12 sm5>
              <v-text-field label="統一編號" v-model="form.taxId"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field label="市話 1" v-model="form.telphone1"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field label="市話 2" v-model="form.telphone2"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field label="行動電話" v-model="form.phone"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field label="其他聯絡方式" v-model="form.otherContact"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field label="負責人" v-model="form.principal"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field label="聯絡人" v-model="form.contacts"></v-text-field>
            </v-flex>
            <!-- <v-flex xs12 sm3>
              <v-text-field label="郵遞區號" v-model="form.zipCode"></v-text-field>
            </v-flex> -->
            <!-- <v-flex xs12 sm4>
              <v-select
                label="縣市"
                :loading="loading.city"
                :items="Object.keys(citys).map(city => this.citys[city])"
                v-model="selected.city"
                @change="changeCity"
                item-text="title"
                autocomplete
              ></v-select>
            </v-flex> -->
            <!-- <v-flex xs12 sm5>
              <v-select
                label="地區"
                :loading="loading.district"
                :items="districts"
                v-model="selected.district"
                @change="changeDistrict"
                item-text="district_zh"
                autocomplete
              ></v-select>
            </v-flex> -->
            <!-- <v-flex xs12>
              <v-select
                label="路段"
                :loading="loading.road"
                :items="roads"
                v-model="selected.road"
                @change="changeRoad"
                item-text="roadScope"
                autocomplete
              ></v-select>
            </v-flex> -->
            <!-- <v-flex xs12>
              <v-text-field label="地址" v-model="form.address"></v-text-field>
            </v-flex> -->
            <v-flex xs12 sm3>
              <v-text-field label="郵遞區號" v-model="form.zipCode"></v-text-field>
            </v-flex>
            <v-flex xs12 sm9>
              <v-text-field
                label="地址"
                v-model="form.address"
                :append-icon="'more_horiz'"
                :append-icon-cb="showLocationSelector"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="備註" v-model="form.note"></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
        <footer>
          <v-btn v-if="formType === 'edit'" @click.native.once="goBack">返回</v-btn>
          <v-btn type="submit" color="primary" @click="submitForm" :disabled="!validForm">{{ formType === 'new' ? '建立' : '儲存' }}</v-btn>
        </footer>
      </div>
    </v-form>

    <v-dialog v-model="locationSelector" persistent max-width="600">
      <v-card>
        <v-card-title>地址快速選取</v-card-title>
        <v-card-text>
          <v-container grid-list-md text-xs-center class="content">
            <v-layout row wrap>
              <v-flex xs12 sm6>
                <v-select
                  label="縣市"
                  :loading="loading.city"
                  :items="Object.keys(cities).map(city => this.cities[city])"
                  v-model="selected.city"
                  @change="changeCity"
                  item-text="title"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm6>
                <v-select
                  label="地區"
                  :loading="loading.district"
                  :items="districts"
                  v-model="selected.district"
                  @change="changeDistrict"
                  item-text="district_zh"
                ></v-select>
              </v-flex>
              <v-flex xs12>
                <v-select
                  label="路段"
                  :loading="loading.road"
                  :items="roads"
                  v-model="selected.road"
                  @change="changeRoad"
                  item-text="roadScope"
                ></v-select>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="地址" v-model="roadName"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-btn-toggle class="shortKey" @click.native="pickUpWord">
                  <v-btn flat>1</v-btn>
                  <v-btn flat>2</v-btn>
                  <v-btn flat>3</v-btn>
                  <v-btn flat>4</v-btn>
                  <v-btn flat>5</v-btn>
                  <v-btn flat>6</v-btn>
                  <v-btn flat>7</v-btn>
                  <v-btn flat>8</v-btn>
                  <v-btn flat>9</v-btn>
                  <v-btn flat>0</v-btn>
                </v-btn-toggle>
                <v-btn-toggle class="shortKey" @click.native="pickUpWord">
                  <v-btn flat>一</v-btn>
                  <v-btn flat>二</v-btn>
                  <v-btn flat>三</v-btn>
                  <v-btn flat>四</v-btn>
                  <v-btn flat>五</v-btn>
                  <v-btn flat>六</v-btn>
                  <v-btn flat>七</v-btn>
                  <v-btn flat>八</v-btn>
                  <v-btn flat>九</v-btn>
                  <v-btn flat>十</v-btn>
                </v-btn-toggle>
                <v-btn-toggle class="shortKey" @click.native="pickUpWord">
                  <v-btn flat>路</v-btn>
                  <v-btn flat>街</v-btn>
                  <v-btn flat>段</v-btn>
                  <v-btn flat>巷</v-btn>
                  <v-btn flat>弄</v-btn>
                  <v-btn flat>號</v-btn>
                  <v-btn flat>之</v-btn>
                  <v-btn flat>樓</v-btn>
                  <v-btn flat>室</v-btn>
                  <v-btn flat  @click.stop="backspaceWord">
                    <v-icon>backspace</v-icon>
                  </v-btn>
                </v-btn-toggle>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="info" @click.native="getAddress">取回地址</v-btn>
          <v-btn color="info" @click.native="locationSelector = false">取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      :timeout="parseInt(2000)"
      color="error"
      v-model="failedSnackbar"
    >建立失敗</v-snackbar>

  </section>
</template>

<script>
export default {

  name: 'newCustomer',

  mounted () {
    if (this.$route.params.id) {
      this.formType = 'edit'
      this.customerKey = this.$route.params.id

      this.global.db.ref('/customer/' + this.customerKey)
        .once('value')
        .then(async snapshot => {
          let customer = snapshot.val()
          this.loading.city = true
          let zipCodeG
          // let countryG
          let cityG
          // let districtG
          // let roadG

          if (customer.address) {
            // google maps geocode api key AIzaSyCpvo3sj0arE6Ya8jycSkfU782cEetUd5U
            await this.axios.get(`https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCpvo3sj0arE6Ya8jycSkfU782cEetUd5U&address=${customer.address}`)
              .then(response => {
                if (response.data.results[0].address_components) {
                  zipCodeG = response.data.results[0].address_components.pop()
                  // countryG = response.data.results[0].address_components.pop()
                  cityG = response.data.results[0].address_components.pop()
                  // districtG = response.data.results[0].address_components.pop()
                  // roadG = response.data.results[0].address_components

                  customer.district = zipCodeG.long_name
                  cityG.long_name = cityG.long_name.replace('台', '臺')
                }
              })
          }

          Object.keys(this.cities).forEach(city => {
            if (customer.city && city === customer.city) {
              this.selected.city = this.cities[city]
              this.cityName = this.cities[city].title
            } else if (cityG && cityG.long_name === this.cities[city].title) {
              this.selected.city = this.cities[city]
              this.cityName = this.cities[city].title
              customer.city = city
            }
          })

          if (customer.city) {
            const districts = await this.getDistricts(customer.city)
            this.districts = districts
          }
          if (customer.district) {
            const roads = await this.getRoads(customer.district)
            this.roads = roads
          }
          this.loading.city = false

          if (customer.district) {
            this.districts.forEach(district => {
              if (district.zip_code.toString() === customer.district.toString()) {
                this.selected.district = district
                this.districtName = district.district_zh
              }
            })
          }

          if (customer.roadScopeId) {
            this.roads.forEach(road => {
              if (road.id.toString() === customer.roadScopeId.toString()) {
                this.selected.road = road
              }
            })
          }

          this.form.name = 'name' in customer ? customer.name : ''
          this.form.shortCode = 'shortCode' in customer ? customer.shortCode : ''
          this.form.company = 'company' in customer ? customer.company : ''
          this.form.taxId = 'taxId' in customer ? customer.taxId : ''
          this.form.telphone1 = 'telphone1' in customer ? customer.telphone1 : ''
          this.form.telphone2 = 'telphone2' in customer ? customer.telphone2 : ''
          this.form.phone = 'phone' in customer ? customer.phone : ''
          this.form.otherContact = 'otherContact' in customer ? customer.otherContact : ''
          this.form.principal = 'principal' in customer ? customer.principal : ''
          this.form.contacts = 'contacts' in customer ? customer.contacts : ''
          this.form.zipCode = 'zipCode' in customer ? customer.zipCode : ''
          this.form.city = 'city' in customer ? customer.city : ''
          this.form.district = 'district' in customer ? customer.district : ''
          this.form.roadScopeId = 'roadScopeId' in customer ? customer.roadScopeId : ''
          this.form.address = 'address' in customer ? customer.address : ''
          this.form.note = 'note' in customer ? customer.note : ''

          if (this.form.address) {
            this.roadName = this.form.address
              .substring(this.cityName.length)
              .substring(this.districtName.length)
          }
        })
    }
  },

  data () {
    return {
      failedSnackbar: false,
      loading: {
        city: false,
        district: false,
        road: false
      },
      validForm: true,
      locationSelector: false,
      districts: [],
      roads: [],
      func: {
        main: '客戶資料',
        sub: '新建'
      },
      formType: 'new',
      customerKey: '',
      selected: {
        city: {},
        district: {},
        road: {}
      },
      cityName: '',
      districtName: '',
      roadName: '',
      form: {
        name: '',
        shortCode: '',
        company: '',
        taxId: '',
        telphone1: '',
        telphone2: '',
        phone: '',
        otherContact: '',
        principal: '',
        contacts: '',
        zipCode: '',
        city: '',
        district: '',
        roadScopeId: '',
        address: '',
        note: ''
      }
    }
  },
  watch: {
    // on route change
    $route (to, from) {
      if (to.fullPath === '/customer/new') {
        // reset data
        Object.assign(this.$data, this.$options.data())
        this.$refs.form.reset()
        // this.$forceUpdate()
      }
    }
  },
  computed: {
  },
  methods: {
    showLocationSelector () {
      this.locationSelector = true
    },
    pickUpWord ($event) {
      this.roadName += $event.target.innerText
    },
    backspaceWord () {
      if (this.roadName.length > 0) {
        this.roadName = this.roadName.substring(0, this.roadName.length - 1)
      }
    },
    getAddress () {
      this.form.address = `${this.cityName}${this.districtName}${this.roadName}`
      this.locationSelector = false
    },
    async transShortCode (newName) {
      let fullCode = ''
      for (let i = 0; i < newName.length; i++) {
        const char = newName[i]
        const shortCode = await this.getShortCode(char)
        fullCode += shortCode
      }
      this.form.shortCode = fullCode.toLowerCase()
    },
    async changeCity (newCity) {
      this.districts = []
      this.roads = []
      this.form.zipCode = ''
      this.roadName = ''
      this.cityName = newCity.title
      this.form.city = newCity.name

      this.loading.district = true
      const districts = await this.getDistricts(newCity.name)
      this.districts = districts
      this.loading.district = false
    },
    async changeDistrict (newDistrict) {
      this.roads = []
      this.form.zipCode = ''
      this.roadName = ''
      this.districtName = newDistrict.district_zh
      this.form.district = newDistrict.zip_code

      const roads = await this.getRoads(newDistrict.zip_code)
      this.roads = roads
    },
    changeRoad (newRoad) {
      this.form.roadScopeId = newRoad.id
      this.form.zipCode = newRoad.zipCode
      this.roadName = newRoad.road
    },
    submitForm (event) {
      event.preventDefault()
      if (this.$refs.form.validate()) {
        if (this.formType === 'new') {
          this.create()
        } else {
          this.update()
        }
      }
    },
    create () {
      const db = this.global.db
      let newId = 0
      this.db.ref('/customer').orderByChild('id').limitToLast(1).once('value')
        .then(snapshot => {
          const lastCustomer = snapshot.val()
          Object.keys(lastCustomer).forEach(customerKey => {
            newId = lastCustomer[customerKey].id + 1
          })
        })
        .then(() => {
          const newCustomer = db.ref('/customer').push()
          const form = {
            id: newId,
            name: this.form.name,
            shortCode: this.form.shortCode,
            company: this.form.company,
            taxId: this.form.taxId,
            telphone1: this.form.telphone1,
            telphone2: this.form.telphone2,
            phone: this.form.phone,
            otherContact: this.form.otherContact,
            principal: this.form.principal,
            contacts: this.form.contacts,
            zipCode: this.form.zipCode,
            city: this.form.city,
            district: this.form.district,
            roadScopeId: this.form.roadScopeId,
            address: this.form.address,
            note: this.form.note
          }
          newCustomer.set(form)
            .then(() => {
              console.log('Synchronization succeeded')
              this.$store.dispatch('toggleNewCustomer', {
                needShowTip: true
              })
              this.global.router.push('/customer')
            })
            .catch(error => {
              if (error) {
                this.failedSnackbar = true
                console.log('Synchronization failed')
              }
            })
        })
    },
    update () {
      const router = this.global.router
      this.global.db
        .ref(`/customer/${this.customerKey}`)
        .update(this.form, (response) => {
          if (response === null) {
            router.push('/customer')
          }
        })
    },
    goBack () {
      window.history.length > 1 ? this.global.router.go(-1) : this.global.router.replace('/supplier')
    }
  }

}
</script>

<style lang="scss" scoped>
@import "~compass/_compass";
@import "~scss/lib/_custom";

#newCustomerCard {
  position: relative;
  display: inline-block;
  width: 100%;
  max-width: 700px;

  padding: 16px 20px;

  $herderHeight: 48px;
  > .container {
    height: 100%;
    background-color: white;
    @include border-radius(4px);
    @include box-shadow(0 1px 4px 0 rgba(0,0,0,0.14));
    > * {
      display: inline-block;
      width: 100%;
    }
    > header {
      height: $herderHeight;
      padding: 4px 8px;
      border-bottom: 1px solid rgba(235, 235, 235, 1);
      @include clearfix();
      // background-color: rgba(0, 0, 255, 0.07);
      > * {
        display: inline-block;
        float: left;
      }
      > .title {
        width: calc(100% - #{$herderHeight});
        height: $herderHeight;
        text-align: left;
        font-size: 24px;
        line-height: $herderHeight;
        // background-color: rgba(0, 255, 0, 0.07);
      }
      > .more {
        @include size($herderHeight);
        // background-color: rgba(255, 0, 0, 0.07);
      }
    }
    > .content {
      height: calc(100% - 51px - 51px);
    }
    > footer {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: flex-end;
      align-items: center;

      height: $herderHeight;
      padding: 4px 8px;
      border-top: 1px solid rgba(235, 235, 235, 1);
      button {
        font-size: 16px;
        font-weight: bold;
      }
      // background-color: rgba(255, 0, 0, 0.07);
    }
  }
}

.shortKey {
  display: inline-block;
  > button.btn {
    @include size(48px);
    font-size: 24px;
    color: black;
    &:hover {
      opacity: 1;
    }
  }
}
</style>
