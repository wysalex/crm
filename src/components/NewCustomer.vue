<template>
  <section>

    <div id="newCustomerCard">
      <div class="container">
        <header>
          <div class="title">{{ func.main }}</div>
          <div class="more"></div>
        </header>
        <div class="content">
          <v-text-field
            label="客戶姓名"
            v-model="form.name"
            :rules="[() => form.name.length > 0 || '請輸入客戶姓名']"
            required>
          </v-text-field>
          <v-text-field label="市話" v-model="form.tel"></v-text-field>
          <v-text-field label="行動電話" v-model="form.phone"></v-text-field>
          <v-text-field label="其他聯絡方式" v-model="form.otherContact"></v-text-field>
          <v-select
            label="居住地"
            :loading="loading.city"
            :items="Object.keys(citys).map(city => this.citys[city])"
            v-model="form.city"
            @change="changeCity"
            item-text="title"
            item-value="name"
            autocomplete
          ></v-select>
          <v-select
            label="地區"
            :loading="loading.district"
            :items="districts"
            v-model="form.zipCode"
            item-text="district_zh"
            item-value="zip_code"
            autocomplete
          ></v-select>
          <v-text-field label="地址" v-model="form.address"></v-text-field>
          <v-text-field label="備註" v-model="form.note"></v-text-field>
        </div>
        <footer>
          <v-btn v-if="formType === 'edit'" @click.native.once="goBack">返回</v-btn>
          <v-btn color="primary" @click.native.once="formAction">{{ formType === 'new' ? '建立' : '儲存' }}</v-btn>
        </footer>
      </div>
    </div>

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

          const districts = await this.getDistricts(customer.city)
          this.districts = districts
          this.loading.city = false
          this.form.name = customer.name
          this.form.tel = customer.tel
          this.form.phone = customer.phone
          this.form.otherContact = customer.otherContact
          this.form.city = customer.city
          this.form.zipCode = customer.zipCode
          this.form.address = customer.address
          this.form.note = customer.note
        })
    }
  },

  data () {
    return {
      failedSnackbar: false,
      loading: {
        city: false,
        district: false
      },
      districts: [],
      func: {
        main: '客戶資料',
        sub: '新建'
      },
      formType: 'new',
      customerKey: '',
      form: {
        name: '',
        tel: '',
        phone: '',
        otherContact: '',
        city: '',
        district: '',
        zipCode: 0,
        address: '',
        note: ''
      }
    }
  },
  computed: {
  },
  methods: {
    changeCity: async function (newCity) {
      this.form.zipCode = 0
      this.loading.district = true

      const districts = await this.getDistricts(newCity)
      this.districts = districts

      this.loading.district = false
    },
    formAction () {
      if (this.formType === 'new') {
        this.create()
      } else if (this.formType === 'edit') {
        this.update()
      }
    },
    create () {
      const db = this.global.db
      const newCustomer = db.ref('/customer').push()
      const form = {
        name: this.form.name,
        tel: this.form.tel,
        phone: this.form.phone,
        otherContact: this.form.otherContact,
        address: this.form.address,
        city: this.form.city,
        zipCode: this.form.zipCode,
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
  max-width: 600px;

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
</style>
