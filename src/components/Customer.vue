<template lang="html">

  <section class="customer">

    <v-container fluid grid-list-md>
      <v-layout row wrap>
        <v-flex xs12 sm3 offset-sm1 md2 offset-md3>
          <v-select label="搜尋類型" :items="searchTypes" item-value="val" v-model="searchType"></v-select>
        </v-flex>
        <v-flex xs12 sm7 md4>
          <v-text-field label="搜尋" single-line v-model="keyword"></v-text-field>
        </v-flex>
      </v-layout>
    </v-container>

    <div class="action-block">
      <div class="action selected">
        <v-btn flat small @click.native="allChecked">全選</v-btn>
        <v-btn flat small @click.native="clearChecked" :disabled="emptyChecked">取消選取項目</v-btn>
        <v-btn flat small @click.native="deleteSelected" :disabled="emptyChecked">刪除選取項目</v-btn>
      </div>
    </div>

    <div class="show-list">
      <ul class="mdl-list">
        <li class="mdl-list__item mdl-list__item--two-line customer-row" v-for="(customer, customerIdx) in filterCustomers">
          <span class="mdl-list__item-primary-content">
            <v-checkbox class="material-icons mdl-list__item-icon" v-model="checkedCustomers" :value="customerIdx"></v-checkbox>
            <span class="show-detail" @click="getCustomer(customerIdx)">{{ customer.name }}</span>
            <span class="mdl-list__item-sub-title">{{ customer.tel }}</span>
          </span>
          <span class="mdl-list__item-secondary-content">
            <v-icon class="row-action" @click="editCustomer(customerIdx)">edit</v-icon>
            <v-icon class="row-action" @click="comfirmDelCustomer(customerIdx)">delete</v-icon>
          </span>
        </li>
      </ul>
    </div>

    <!-- customer card -->
    <v-dialog v-model="customerCard" persistent v-if="customers[showCustomerIdx]">
      <v-card class="customer-card">
        <v-card-title>
          <span class="card-title">{{ customers[showCustomerIdx].name }}</span>
        </v-card-title>
        <v-card-text>

          <!-- customer information -->
          <div class="card-info">
            <div>
              <span>電話: </span>
              <span>{{ customers[showCustomerIdx].tel }}</span>
            </div>
            <div>
              <span>地址: </span>
              <span>{{ customers[showCustomerIdx].fullAddress }}</span>
            </div>
            <div>
              <span>備註: </span>
              <span>{{ customers[showCustomerIdx].note }}</span>
            </div>
          </div>

          <!-- customer service -->
          <v-data-table
            :headers="serviceHeaders"
            :items="customerService"
            hide-actions
            no-data-text="沒有資料"
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <td>{{ props.item.date }}</td>
              <td>{{ props.item.brand }}</td>
              <td>{{ props.item.model }}</td>
              <!-- <td>{{ props.item.product }}</td> -->
              <td>{{ props.item.service_contents }}</td>
              <td>{{ props.item.service_type }}</td>
              <td class="text-xs-right">{{ props.item.totalPrice }}</td>
              <td>
                <v-icon class="icon-btn" @click="editService(props.item.key)">edit</v-icon>
                <v-icon class="icon-btn" @click="deleteService(props.item.key)">delete</v-icon>
              </td>
            </template>
          </v-data-table>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click.native="customerCard = false">關閉</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="comfirmDelete" persistent max-width="500">
      <v-card>
        <v-card-title>確認刪除?</v-card-title>
        <v-card-text>
          <ul class="mdl-list">
            <li class="mdl-list__item mdl-list__item--two-line">
              <span class="mdl-list__item-primary-content">
                <v-icon>people</v-icon>
                <span>{{ deleteCustomerInfo.name }}</span>
                <span class="mdl-list__item-sub-title">{{ deleteCustomerInfo.tel }}</span>
              </span>
            </li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat color="error" @click.native="delCustomer(deleteCustomerInfo.idx)">確認</v-btn>
          <v-btn flat color="primary" @click.native="closeDelDialog">取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      :timeout="parseInt(2000)"
      color="success"
      v-model="successSnackbar"
    >建立成功</v-snackbar>

  </section>

</template>

<script lang="js">
export default {
  name: 'customer',
  props: [],
  mounted () {
    if (this.$store.state.hasNewCustomer) {
      this.successSnackbar = true
      this.$store.dispatch('toggleNewCustomer', {
        needShowTip: false
      })
    }

    this.global.db.ref('/supplier')
      .on('value', snapshot => {
        this.suppliers = snapshot.val()
      })
  },
  data () {
    return {
      searchTypes: [
        { text: '姓名', val: 'name' },
        { text: '電話', val: 'tel' }
      ],
      searchType: 'name',
      successSnackbar: false,
      keyword: '',
      checkedCustomers: [],
      serviceType: {
        new: '新購',
        retail: '維修'
      },
      serviceHeaders: [
        {
          text: '日期',
          value: 'date'
        }, {
          text: '廠牌',
          value: 'brand'
        }, {
          text: '型號',
          value: 'model'
        }, {
          text: '服務內容',
          value: 'service_contents'
        }, {
          text: '服務類型',
          value: 'service_type'
        }, {
          text: '金額',
          value: 'totalPrice'
        }, {
          text: '修改/刪除',
          value: 'action',
          width: '100px'
        }
      ],
      customerService: [],
      customerServices: {},
      customerCard: false,
      showCustomerIdx: '',
      showCustomerKey: '',
      comfirmDelete: false,
      deleteCustomerInfo: {
        idx: '',
        name: '',
        tel: ''
      }
    }
  },
  firebase () {
    return {
      customers: this.global.db.ref('/customer')
    }
  },
  methods: {
    getAddress: async function (customer) {
      let address = ''
      if (this.citys[customer.city]) {
        address += this.citys[customer.city].title
      }
      let districts = await this.getDistricts(customer.city)
      districts.forEach(districtInfo => {
        if (districtInfo.zip_code === customer.zipCode) {
          address += districtInfo.district_zh
        }
      })
      if (customer.address) {
        address += customer.address
      }
      return address
    },
    getCustomer: async function (customerIdx) {
      this.showCustomerIdx = customerIdx
      this.showCustomerKey = this.customers[customerIdx]['.key']
      let customerService = []
      if (this.customers[customerIdx].service) {
        const customerServiceP = Object.keys(this.customers[customerIdx].service)
          .reduce(async (tempArrP, serviceKey) => {
            const tempArr = await tempArrP
            await this.global.db
              .ref(`/service/${serviceKey}`)
              .once('value')
              .then(snapshot => {
                if (snapshot.val()) {
                  const service = snapshot.val()
                  const tempService = {
                    key: serviceKey,
                    brand: this.suppliers[service.brand].name,
                    date: service.date,
                    model: service.model,
                    totalPrice: service.totalPrice,
                    product: service.product,
                    service_contents: service.service_contents,
                    service_type: this.serviceType[service.service_type]
                  }
                  tempArr.push(tempService)
                }
              })
            return tempArr
          }, [])
        customerService = await customerServiceP
      }
      let address = await this.getAddress(this.customers[customerIdx])
      this.customers[customerIdx].fullAddress = address
      this.customerService = customerService
      this.customerServices[this.showCustomerKey] = customerService
      this.customerCard = true
    },
    editService (serviceKey) {
      this.global.router.push('/service/' + serviceKey)
    },
    deleteService (serviceKey) {
      const serviceRef = this.global.db.ref('/service')
      const customerRef = this.global.db.ref(`/customer/${this.showCustomerKey}`)

      customerRef.child(`service/${serviceKey}`).remove()
        .then(snapshot => {
          console.log('delete customer service success')
          serviceRef.child(serviceKey).remove()
            .then(snapshot => {
              this.customerService = this.customerService.filter((element) => {
                return element.key !== serviceKey
              })
            })
            .catch(error => {
              if (error) {
                console.log('delete failed')
              }
            })
        })
        .catch(error => {
          if (error) {
            console.log('delete failed')
          }
        })
    },
    allChecked () {
      this.checkedCustomers = Object.keys(this.customers).map(customerIdx => parseInt(customerIdx))
    },
    clearChecked () {
      this.checkedCustomers = []
    },
    deleteSelected () {
      if (this.checkedCustomers.length > 0) {
        this.checkedCustomers.forEach(customerIdx => {
          this.delCustomer(this.customers[customerIdx]['.key'])
        })
        this.checkedCustomers = []
      }
    },
    comfirmDelCustomer (customerIdx) {
      this.deleteCustomerInfo.idx = this.customers[customerIdx]['.key']
      this.deleteCustomerInfo.name = this.customers[customerIdx].name
      this.deleteCustomerInfo.tel = this.customers[customerIdx].tel
      this.comfirmDelete = true
    },
    editCustomer (customerIdx) {
      this.global.router.push('/customer/' + this.customers[customerIdx]['.key'])
    },
    delCustomer (customerIdx) {
      const db = this.global.db
      const customerRef = db.ref('/customer')

      customerRef.child(customerIdx).remove()
        .then(snapshot => {
          console.log('delete success')
          Object.keys(this.deleteCustomerInfo).map(objectKey => {
            this.deleteCustomerInfo[objectKey] = ''
          })
          this.comfirmDelete = false
          this.customerCard = false
        })
        .catch(error => {
          if (error) {
            console.log('delete failed')
          }
          this.comfirmDelete = false
          this.customerCard = false
        })
    },
    closeDelDialog () {
      this.comfirmDelete = false
    }
  },
  computed: {
    filterCustomers () {
      var keyword = this.keyword.trim().toLowerCase()
      if (this.keyword.trim() !== '') {
        return Object.keys(this.customers)
          .reduce((r, customersIdx) => {
            switch (this.searchType) {
              case 'name':
                if (this.customers[customersIdx].name.toLowerCase().indexOf(keyword) > -1) {
                  r[customersIdx] = this.customers[customersIdx]
                }
                break
              case 'tel':
                if (
                  this.customers[customersIdx].tel.toLowerCase().indexOf(keyword) > -1 ||
                  (
                    this.customers[customersIdx].phone &&
                    this.customers[customersIdx].phone.toLowerCase().indexOf(keyword) > -1
                  ) ||
                  (
                    this.customers[customersIdx].otherContact &&
                    this.customers[customersIdx].otherContact.toLowerCase().indexOf(keyword) > -1
                  )
                ) {
                  r[customersIdx] = this.customers[customersIdx]
                }
                break
            }
            return r
          }, {})
      } else {
        return this.customers
      }
    },
    emptyChecked () {
      return this.checkedCustomers.length === 0
    }
  }
}
</script>

<style scoped lang="scss">
  @import "~compass/_compass";
  @import "~scss/lib/_custom";

  .customer {
    @include size(100%);
    padding: 16px 20px;
  }

  .show-list {
    width: 100%;
    @include align('h');

    > .mdl-list {
      width: 100%;
      max-width: 360px;
    }
  }

  .row-action {
    color: rgba(0, 0, 0, 0.3);
    @include transition(color .3s);
    cursor: pointer;
    &:hover {
      color: rgba(0, 188, 212, 1);
    }
  }

  .show-detail {
    cursor: pointer;
  }

  .customer-row {
    @include border-radius(4px);
    @include transition(background-color .3s);
    &:hover {
      background-color: darken(rgba(235, 235, 235, 1.00), 10%);
    }
  }

  .customer-card {
    .card-title {
      font-size: 24px;
    }

    .card-info {
      text-align: left;
    }
  }
</style>
