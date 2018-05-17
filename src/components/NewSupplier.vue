<template lang="html">

  <v-form id="newSupplierCard" v-model="validForm" ref="form" lazy-validation>
    <div class="container">
      <header>
        <div class="title">{{ func.main }}</div>
        <div class="more"></div>
      </header>
      <v-container grid-list-md text-xs-center class="content">
        <v-layout row wrap>
          <v-flex xs12 sm7>
            <v-text-field
              label="廠商名稱"
              v-model="form.name"
              :rules="[() => form.name.length > 0 || '請輸入廠商名稱']"
              required>
            </v-text-field>
          </v-flex>
          <v-flex xs12 sm5>
            <v-text-field
              label="簡碼"
              v-model="form.shortKey">
            </v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field label="市話 1" v-model="form.telphone1"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field label="市話 2" v-model="form.telphone2"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field label="傳真" v-model="form.fax"></v-text-field>
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
          <v-flex xs12 sm3>
            <v-text-field label="郵遞區號" v-model="form.zipCode"></v-text-field>
          </v-flex>
          <v-flex xs12 sm4>
            <v-select
              label="縣市"
              :loading="loading.city"
              :items="Object.keys(citys).map(city => this.citys[city])"
              v-model="selected.city"
              @change="changeCity"
              item-text="title"
              autocomplete
            ></v-select>
          </v-flex>
          <v-flex xs12 sm5>
            <v-select
              label="地區"
              :loading="loading.district"
              :items="districts"
              v-model="selected.district"
              @change="changeDistrict"
              item-text="district_zh"
              autocomplete
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
              autocomplete
            ></v-select>
          </v-flex>
          <v-flex xs12>
            <v-text-field label="地址" v-model="form.address"></v-text-field>
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

</template>

<script>
export default {
  name: 'newSupplier',
  props: [],
  mounted () {
    if (this.$route.params.id) {
      this.formType = 'edit'
      this.supplierKey = this.$route.params.id

      this.global.db.ref('/supplier/' + this.supplierKey)
        .once('value')
        .then(async snapshot => {
          let supplier = snapshot.val()
          this.loading.city = true

          Object.keys(this.citys).forEach(city => {
            if (city === supplier.city) {
              this.selected.city = this.citys[city]
            }
          })

          const districts = await this.getDistricts(supplier.city)
          const roads = await this.getRoads(supplier.district)
          this.districts = districts
          this.roads = roads
          this.loading.city = false

          if (supplier.district) {
            districts.forEach(district => {
              if (district.zip_code.toString() === supplier.district.toString()) {
                this.selected.district = district
              }
            })
          }

          if (supplier.roadScopeId) {
            roads.forEach(road => {
              if (road.id.toString() === supplier.roadScopeId.toString()) {
                this.selected.road = road
              }
            })
          }

          this.form.name = 'name' in supplier ? supplier.name : ''
          this.form.shortKey = 'shortKey' in supplier ? supplier.shortKey : ''
          this.form.telphone1 = 'telphone1' in supplier ? supplier.telphone1 : ''
          this.form.telphone2 = 'telphone2' in supplier ? supplier.telphone2 : ''
          this.form.fax = 'fax' in supplier ? supplier.fax : ''
          this.form.otherContact = 'otherContact' in supplier ? supplier.otherContact : ''
          this.form.principal = 'principal' in supplier ? supplier.principal : ''
          this.form.contacts = 'contacts' in supplier ? supplier.contacts : ''
          this.form.zipCode = 'zipCode' in supplier ? supplier.zipCode : ''
          this.form.city = 'city' in supplier ? supplier.city : ''
          this.form.district = 'district' in supplier ? supplier.district : ''
          this.form.roadScopeId = 'roadScopeId' in supplier ? supplier.roadScopeId : ''
          this.form.address = 'address' in supplier ? supplier.address : ''
          this.form.note = 'note' in supplier ? supplier.note : ''
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
      districts: [],
      roads: [],
      func: {
        main: '廠商資料',
        sub: '新建'
      },
      formType: 'new',
      supplierKey: '',
      selected: {
        city: {},
        district: {},
        road: {}
      },
      form: {
        name: '',
        shortKey: '',
        telphone1: '',
        telphone2: '',
        fax: '',
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
  methods: {
    async changeCity (newCity) {
      this.districts = []
      this.roads = []
      this.form.zipCode = ''
      this.form.address = ''
      this.form.city = newCity.name

      this.loading.district = true
      const districts = await this.getDistricts(newCity.name)
      this.districts = districts
      this.loading.district = false
    },
    async changeDistrict (newDistrict) {
      this.roads = []
      this.form.zipCode = ''
      this.form.address = ''
      this.form.district = newDistrict.zip_code

      const roads = await this.getRoads(newDistrict.zip_code)
      this.roads = roads
    },
    changeRoad (newRoad) {
      this.form.roadScopeId = newRoad.id
      this.form.zipCode = newRoad.zipCode
      this.form.address = newRoad.road
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
      const router = this.global.router

      const form = {
        name: this.form.name,
        shortKey: this.form.shortKey,
        telphone1: this.form.telphone1,
        telphone2: this.form.telphone2,
        fax: this.form.fax,
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
      let newSupplier = db.ref('/supplier').push()
      newSupplier.set(form)
        .then(() => {
          console.log('Synchronization succeeded')
          this.$store.dispatch('toggleNewSupplier', {
            needShowTip: true
          })
          router.push('/supplier')
        })
        .catch(error => {
          if (error) {
            this.$root.$emit('supplierCreated', {
              message: '建立失敗',
              timeout: 2000
            })
            console.log('Synchronization failed')
          }
        })
    },
    update () {
      const router = this.global.router
      const form = {
        name: this.form.name,
        shortKey: this.form.shortKey,
        telphone1: this.form.telphone1,
        telphone2: this.form.telphone2,
        fax: this.form.fax,
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
      this.global.db
        .ref('/supplier/' + this.supplierKey)
        .update(form, (response) => {
          if (response === null) {
            router.push('/supplier')
          }
        })
    },
    goBack () {
      window.history.length > 1 ? this.global.router.go(-1) : this.global.router.replace('/supplier')
    }
  },
  computed: {
  }
}
</script>

<style scoped lang="scss">
  @import "~compass/_compass";
  @import "~scss/lib/_custom";

  #newSupplierCard {
    position: relative;
    display: inline-block;
    width: 100%;
    max-width: 600px;
    // height: 400px;

    padding: 16px 20px 0 20px;

    $herderHeight: 48px;
    > .container {
      height: 100%;
      background-color: white;
      @include border-radius(4px);
      @include box-shadow(0 1px 4px 0 rgba(0,0,0,0.14));
      > * {
        display: block;
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
        height: calc(100% - #{$herderHeight} - #{$herderHeight});
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
</style>
