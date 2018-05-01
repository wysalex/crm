<template>

  <section class="newService">

    <div id="newServiceCard">
      <div class="container">
        <header>
          <div class="title">{{ func.main }}</div>
          <div class="more"></div>
        </header>
        <div class="content">
          <v-menu
            ref="menu"
            lazy
            :close-on-content-click="false"
            v-model="menu"
            transition="scale-transition"
            offset-y
            full-width
            :nudge-right="40"
            min-width="290px"
            :return-value.sync="form.date"
          >
            <v-text-field
              slot="activator"
              label="日期"
              v-model="form.date"
              readonly
            ></v-text-field>
            <v-date-picker v-model="form.date" @change="$refs.menu.save(form.date)" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="menu = false">取消</v-btn>
              <v-btn flat color="primary" @click="$refs.menu.save(form.date)">確定</v-btn>
            </v-date-picker>
          </v-menu>
          <v-select
            label="服務類型"
            :items="serviceOptions"
            v-model="form.service_type"
            item-text="title"
            item-value="id"
            autocomplete
          ></v-select>
          <v-select
            label="客戶"
            :items="customerOptions"
            v-model="form.customer"
            item-text="title"
            item-value="id"
            autocomplete
          ></v-select>
          <v-select
            label="廠牌"
            :items="supplierOptions"
            v-model="form.brand"
            item-text="title"
            item-value="id"
            autocomplete
          ></v-select>
          <v-select
            label="商品"
            :items="productOptions"
            v-model="form.product"
            item-text="title"
            item-value="id"
            autocomplete
          ></v-select>
          <v-text-field label="型號" v-model="form.model"></v-text-field>
          <v-text-field label="問題描述" v-model="form.service_contents" multi-line></v-text-field>
          <v-text-field label="金額" v-model="form.price"></v-text-field>
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
import moment from 'moment'

export default {

  name: 'newService',

  mounted () {
    this.global.db.ref('/customer').on('value', snapshot => {
      this.customers = snapshot.val()
    })
    this.global.db.ref('/supplier').on('value', snapshot => {
      this.suppliers = snapshot.val()
    })
    if (this.$route.params.id) {
      this.formType = 'edit'
      this.serviceKey = this.$route.params.id

      const db = this.global.db
      db.ref('/service/' + this.serviceKey)
        .once('value')
        .then(snapshot => {
          const service = snapshot.val()
          this.form.date = service.date
          this.form.customer = service.customer
          this.form.brand = service.brand
          this.form.product = service.product
          this.form.model = service.model
          this.form.price = service.price
          this.form.service_contents = service.service_contents
          this.form.service_type = service.service_type
        })
    }
  },

  data () {
    return {
      formType: 'new',
      serviceKey: '',
      loading: false,
      failedSnackbar: false,
      func: {
        main: '新購/維修',
        sub: '新建'
      },
      menu: false,
      serviceOptions: [
        {
          id: 'new',
          title: '新購'
        }, {
          id: 'retail',
          title: '維修'
        }
      ],
      productOptions: [
        {
          id: 'ms',
          title: 'Mail Server'
        }, {
          id: 'ma',
          title: 'Mail Archive'
        }
      ],
      customers: [],
      suppliers: [],
      form: {
        date: moment().format('YYYY-MM-DD'),
        customer: '',
        brand: '',
        product: '',
        model: '',
        price: 0,
        service_contents: '',
        service_type: ''
      }
    }
  },
  computed: {
    customerOptions () {
      const options = Object.keys(this.customers).map(customerIdx => {
        return {
          id: customerIdx,
          title: this.customers[customerIdx].name
        }
      })
      return options
    },
    supplierOptions () {
      const options = Object.keys(this.suppliers).map(supplierIdx => {
        return {
          id: supplierIdx,
          title: this.suppliers[supplierIdx].name
        }
      })
      return options
    }
  },
  methods: {
    formAction () {
      if (this.formType === 'new') {
        this.create()
      } else if (this.formType === 'edit') {
        this.update()
      }
    },
    create () {
      const form = {
        date: this.form.date,
        customer: this.form.customer,
        brand: this.form.brand,
        product: this.form.product,
        model: this.form.model,
        price: this.form.price,
        service_contents: this.form.service_contents,
        service_type: this.form.service_type
      }
      let newServiceRef = this.global.db.ref('/service').push()
      newServiceRef
        .set(form)
        .then(() => {
          const customerRef = this.global.db.ref(`/customer/${form.customer}`)
          const customerServiceRef = customerRef.child('service')
          let customerService = {}
          customerServiceRef
            .once('value')
            .then(snapshot => {
              if (snapshot.val()) {
                customerService = snapshot.val()
              }
              customerService[newServiceRef.key] = moment().format('X')
              customerServiceRef
                .set(customerService)
                .then(() => {
                  console.log('Synchronization succeeded')
                  this.$store.dispatch('toggleNewService', {
                    needShowTip: true
                  })
                  this.global.router.push('/service')
                })
                .catch(() => {
                  console.log('Synchronization failed')
                })
            })
        })
        .catch(error => {
          if (error) {
            this.failedSnackbar = true
            console.log('Synchronization failed')
          }
        })
    },
    update () {
      const router = this.global.router
      this.global.db
        .ref('/service/' + this.serviceKey)
        .update(this.form, (response) => {
          if (response === null) {
            router.push('/service')
          }
        })
    },
    goBack () {
      window.history.length > 1 ? this.global.router.go(-1) : this.global.router.replace('/service')
    }

  }

}
</script>

<style lang="scss" scoped>
@import "~compass/_compass";
@import "~scss/lib/_custom";

#newServiceCard {
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
