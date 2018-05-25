<template>

  <section class="newService">

    <div id="newServiceCard">
      <div class="container">
        <header>
          <div class="title">{{ func.main }}</div>
          <div class="more"></div>
        </header>
        <v-container grid-list-md text-xs-center class="content">
          <v-layout row wrap>
            <v-flex xs6>
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
            </v-flex>
            <v-flex xs6>
              <v-select
                label="服務類型"
                :items="serviceOptions"
                v-model="form.service_type"
                item-text="title"
                item-value="id"
                autocomplete
              ></v-select>
            </v-flex>
            <v-flex xs12>
              <v-select
                label="客戶"
                :items="customerOptions"
                v-model="form.customer"
                item-text="title"
                item-value="id"
                autocomplete
              ></v-select>
            </v-flex>
            <v-flex xs12 sm6>
              <v-select
                label="廠牌"
                :items="supplierOptions"
                v-model="form.brand"
                item-text="title"
                item-value="id"
                autocomplete
              ></v-select>
            </v-flex>
            <v-flex xs12 sm6>
              <v-select
                label="商品"
                :items="products"
                v-model="form.product"
                tags
              ></v-select>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="型號" v-model="form.model"></v-text-field>
            </v-flex>
            <v-flex xs12 v-if="form.service_type === 'retail'">
              <v-text-field
                label="問題描述"
                v-model="form.service_contents"
                multi-line
              ></v-text-field>
            </v-flex>
            <v-flex xs12 v-if="form.service_type === 'retail'" class="parts">
              <!-- https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/require-v-for-key.md -->
              <div
                v-for="(part, partIdx) in parts"
                :key="partIdx"
                class="part"
              >
                <v-btn v-if="parts.length > 1" @click.native="removePart(partIdx)" icon small color="error" class="remove">
                  <v-icon>remove</v-icon>
                </v-btn>
                <v-layout row wrap>
                  <v-flex xs12 sm6>
                    <v-text-field label="名稱" v-model="parts[partIdx].name"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-text-field label="零件料號" v-model="parts[partIdx].number"></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field label="說明" v-model="parts[partIdx].comments"></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field label="金額" type="number" v-model="parts[partIdx].price"></v-text-field>
                  </v-flex>
                </v-layout>
              </div>
              <v-btn block color="success" @click.native="newPart"><v-icon>add</v-icon>新增零件項目</v-btn>
            </v-flex>
            <v-flex xs12 v-if="form.service_type !== 'retail'">
              <v-text-field
                label="單價"
                type="number"
                v-model="form.unitPrice"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 v-if="form.service_type !== 'retail'">
              <v-text-field
                label="數量"
                type="number"
                v-model="form.quantity"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="合計" type="number" :value="form.service_type === 'retail' ? form.totalPrice : form.unitPrice * form.quantity"></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
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
import idb from 'idb'

export default {

  name: 'newService',

  mounted () {
    const dbPromis = idb.open('crmDB', 1)
    dbPromis.then(db => db.transaction('product').objectStore('product').getAll())
      .then(allProduct => {
        // console.log(allProduct)
        this.products = allProduct.map(product => {
          return product.productName
        })
      })

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
          this.form.date = 'date' in service ? service.date : ''
          this.form.customer = 'customer' in service ? service.customer : ''
          this.form.brand = 'brand' in service ? service.brand : ''
          this.form.product = 'product' in service ? service.product : []
          this.form.model = 'model' in service ? service.model : ''
          this.form.unitPrice = 'unitPrice' in service ? service.unitPrice : ''
          this.form.quantity = 'quantity' in service ? service.quantity : 1
          this.form.service_contents = 'service_contents' in service ? service.service_contents : ''
          this.form.service_type = 'service_type' in service ? service.service_type : ''
          this.parts = 'parts' in service ? service.parts : []
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
      products: [],
      customers: [],
      suppliers: [],
      parts: [
        {
          number: '',
          name: '',
          comments: '',
          price: ''
        }
      ],
      form: {
        date: moment().format('YYYY-MM-DD'),
        customer: '',
        brand: '',
        product: [],
        model: '',
        unitPrice: '',
        quantity: 1,
        totalPrice: '',
        service_contents: '',
        service_type: ''
      }
    }
  },
  watch: {
    parts: {
      handler (newVal, oldVal) {
        this.form.totalPrice = newVal.reduce((total, part) => {
          if (part.price && part.price > 0) {
            total += parseInt(part.price)
          }
          return total
        }, 0)
      },
      deep: true
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
    newPart () {
      this.parts.push({
        number: '',
        name: '',
        comments: '',
        price: ''
      })
    },
    removePart (partIdx) {
      this.parts.splice(partIdx, 1)
    },
    formAction () {
      if (this.formType === 'new') {
        this.create()
      } else if (this.formType === 'edit') {
        this.update()
      }
    },
    create () {
      let form = {
        date: this.form.date,
        customer: this.form.customer,
        brand: this.form.brand,
        product: this.form.product,
        model: this.form.model,
        parts: [],
        unitPrice: '',
        quantity: 0,
        totalPrice: 0,
        service_contents: this.form.service_contents,
        service_type: this.form.service_type
      }
      if (this.form.service_type === 'retail') {
        form.parts = this.parts.filter(part => {
          if (
            part.number === '' ||
            part.name === '' ||
            part.comments === ''
          ) {
            return false
          } else {
            form.totalPrice += parseInt(part.price)
            return true
          }
        })
      } else {
        form.unitPrice = this.form.unitPrice
        form.quantity = this.form.quantity
        form.totalPrice = form.unitPrice * form.quantity
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
      let form = {
        date: this.form.date,
        customer: this.form.customer,
        brand: this.form.brand,
        product: this.form.product,
        model: this.form.model,
        parts: [],
        unitPrice: '',
        quantity: 0,
        totalPrice: 0,
        service_contents: this.form.service_contents,
        service_type: this.form.service_type
      }
      if (this.form.service_type === 'retail') {
        form.parts = this.parts.filter(part => {
          if (
            part.number === '' ||
            part.name === '' ||
            part.comments === ''
          ) {
            return false
          } else {
            form.totalPrice += parseInt(part.price)
            return true
          }
        })
      } else {
        form.unitPrice = this.form.unitPrice
        form.quantity = this.form.quantity
        form.totalPrice = form.unitPrice * form.quantity
      }
      this.global.db
        .ref('/service/' + this.serviceKey)
        .update(form, (response) => {
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

.parts {
  margin-bottom: 26px;
  .part {
    position: relative;
    border: 1px solid rgba(0, 0, 0, 0.14);
    padding: 12px;
    @include border-radius(8px);
    &:nth-child(n + 2) {
      margin-top: 12px;
    }
    > .remove {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 1;
    }
  }
}
</style>
