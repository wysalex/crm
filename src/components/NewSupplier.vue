<template lang="html">

  <div id="newSupplierCard">
    <div class="container">
      <header>
        <div class="title">{{ func.main }}</div>
        <div class="more"></div>
      </header>
      <div class="content">
        <v-text-field
          label="廠商名稱"
          v-model="form.name"
          :rules="[() => form.name.length > 0 || '請輸入廠商名稱']"
          required>
        </v-text-field>
        <v-text-field label="市話" v-model="form.tel"></v-text-field>
        <v-text-field label="傳真" v-model="form.fax"></v-text-field>
        <v-text-field label="其他聯絡方式" v-model="form.otherContact"></v-text-field>
        <v-select
          label="縣市"
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

          const districts = await this.getDistricts(supplier.city)
          this.districts = districts
          this.loading.city = false

          this.form.name = supplier.name
          this.form.tel = supplier.tel
          this.form.fax = supplier.fax
          this.form.otherContact = supplier.otherContact
          this.form.city = supplier.city
          this.form.zipCode = supplier.zipCode
          this.form.address = supplier.address
          this.form.note = supplier.note
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
        main: '廠商資料',
        sub: '新建'
      },
      formType: 'new',
      supplierKey: '',
      form: {
        name: '',
        tel: '',
        fax: '',
        otherContact: '',
        city: '',
        zipCode: 0,
        address: '',
        note: ''
      }
    }
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
      const router = this.global.router

      const form = {
        name: this.form.name,
        tel: this.form.tel,
        fax: this.form.fax,
        otherContact: this.form.otherContact,
        address: this.form.address,
        city: this.form.city,
        zipCode: this.form.zipCode,
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
        tel: this.form.tel,
        fax: this.form.fax,
        otherContact: this.form.otherContact,
        address: this.form.address,
        city: this.form.city,
        zipCode: this.form.zipCode,
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
