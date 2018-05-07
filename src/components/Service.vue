<template lang="html">

  <section class="service">

    <v-tooltip bottom>
      <!-- <v-btn @click="newService" slot="activator"> -->
      <v-btn to="/service/new" slot="activator">
        <i class="material-icons">add</i>
      </v-btn>
      <span>新增</span>
    </v-tooltip>

    <div v-if="showList">
      <v-card>
        <v-card-title>
          Service
          <v-spacer></v-spacer>
          <v-text-field append-icon="search" label="Search" single-line hide-details v-model="serviceFilter"></v-text-field>
        </v-card-title>
        <v-data-table :headers="serviceHeaders" :items="servicesArr" :search="serviceFilter" hide-actions class="elevation-1">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.date }}</td>
            <td>{{ props.item.customer }}</td>
            <td>{{ props.item.brand }}</td>
            <td>{{ props.item.model }}</td>
            <td>{{ props.item.service_contents }}</td>
            <td>{{ serviceType[props.item.service_type] }}</td>
            <td class="text-xs-right">{{ props.item.totalPrice }}</td>
            <td>
              <v-icon class="icon-btn" @click="editRow(props.item['.key'])">edit</v-icon>
              <v-icon class="icon-btn" @click="deleteRow(props.item['.key'])">delete</v-icon>
            </td>
          </template>
          <v-alert slot="no-results" :value="true" color="error" icon="warning">
            Your search for "{{ serviceFilter }}" found no results.
          </v-alert>
        </v-data-table>
      </v-card>
    </div>

    <div v-else>
      <v-text-field label="搜尋" v-model="serviceFilter" class="search-input"></v-text-field>
      <v-layout>
        <v-flex xs12>
          <v-card>
            <v-container fluid v-bind="{ 'grid-list-sm': true }">
              <v-layout row wrap>
                <v-flex xs3 v-for="service in servicesArr" :key="service['.key']">
                  <div class="service-card">
                    <header>
                      <span class="customer-name">{{ service.customer }}</span>
                      <span class="service-date">{{ service.date }}</span>
                    </header>
                    <div class="content">
                      {{ service.customer }}
                    </div>
                    <footer>
                      {{ service.customer }}
                    </footer>
                  </div>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </div>

    <v-dialog v-model="comfirmDelete" persistent max-width="500">
      <v-card>
        <v-card-title>確認刪除?</v-card-title>
        <v-card-text>
          <ul>
            <li v-for="info in deleteInfo">{{ info.value }}</li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat color="error" @click.native="deleteIt()">確認</v-btn>
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
  name: 'service',
  props: [],
  data () {
    return {
      showList: true,
      successSnackbar: false,
      customers: {},
      suppliers: {},
      services: {},
      aServices: [],
      serviceHeaders: [
        { text: '日期', value: 'date' },
        { text: '客戶', value: 'customer' },
        { text: '廠牌', value: 'brand' },
        { text: '型號', value: 'model' },
        { text: '服務內容', value: 'service_contents' },
        { text: '服務類型', value: 'service_type' },
        { text: '金額', value: 'price' },
        { text: '修改/刪除', value: 'action', width: '100px' }
      ],
      serviceFilter: '',
      serviceType: {
        new: '新購',
        retail: '維修'
      },
      comfirmDelete: false,
      deleteKey: '',
      deleteInfo: {
        date: {
          title: '日期',
          value: ''
        },
        customer: {
          title: '客戶',
          value: ''
        },
        brand: {
          title: '廠牌',
          value: ''
        },
        model: {
          title: '型號',
          value: ''
        },
        service_contents: {
          title: '服務內容',
          value: ''
        },
        service_type: {
          title: '服務類型',
          value: ''
        },
        price: {
          title: '金額',
          value: ''
        }
      }
    }
  },
  mounted () {
    if (this.$store.state.hasNewService) {
      this.successSnackbar = true
      this.$store.dispatch('toggleNewService', {
        needShowTip: false
      })
    }
    const supplierRef = this.global.db.ref('/supplier')
    const customerRef = this.global.db.ref('/customer')
    const serviceRef = this.global.db.ref('/service')

    customerRef.on('value', snapshot => {
      this.customers = snapshot.val()
    })
    supplierRef.on('value', snapshot => {
      this.suppliers = snapshot.val()
    })
    serviceRef.on('value', snapshot => {
      this.services = snapshot.val()
    })
  },
  methods: {
    log (msg) {
      console.log(msg)
    },
    editRow (serviceKey) {
      this.global.router.push('/service/' + serviceKey)
    },
    deleteRow (serviceKey) {
      if (this.services[serviceKey]) {
        this.deleteKey = serviceKey
        const service = this.services[serviceKey]
        this.deleteInfo.date.value = service.date
        this.deleteInfo.customer.value = service.customer
        this.deleteInfo.brand.value = service.brand
        this.deleteInfo.model.value = service.model
        this.deleteInfo.service_contents.value = service.service_contents
        this.deleteInfo.service_type.value = this.serviceType[service.service_type]
        this.deleteInfo.price.value = service.price
        this.comfirmDelete = true
      }
    },
    closeDelDialog () {
      this.deleteKey = ''
      this.comfirmDelete = false
    },
    deleteIt () {
      const db = this.global.db
      const serviceRef = db.ref('/service')

      serviceRef.child(this.deleteKey).remove()
        .then(snapshot => {
          console.log('delete success')
          this.closeDelDialog()
        })
        .catch(error => {
          if (error) {
            console.log('delete failed')
          }
          this.closeDelDialog()
        })
    }
  },
  computed: {
    servicesArr () {
      if (this.services) {
        let temp = Object.keys(this.services)
          .reduce((newArr, serviceIdx) => {
            let tempService = this.services[serviceIdx]
            tempService['.key'] = serviceIdx
            if (this.customers[tempService['customer']]) {
              tempService['customer'] = this.customers[tempService['customer']].name
            } else {
              tempService['customer'] = ''
            }
            if (this.suppliers[tempService['brand']]) {
              tempService['brand'] = this.suppliers[tempService['brand']].name
            } else {
              tempService['brand'] = ''
            }
            newArr.push(tempService)
            return newArr
          }, [])
        return temp
      } else {
        return []
      }
    }
  }
}
</script>

<style scoped lang="scss">
  @import "~compass/_compass";
  @import "~scss/lib/_custom";

  .service {
    @include size(100%);
    padding: 16px 20px;
  }

  .service-card {
    border: 1px solid rgba(0, 0, 0, 1);
    @include border-radius(4px);
    padding: 4px 4px;

    @include box-shadow(0 2px 5px 0 rgba(0,0,0,0.16));

    header {
      @include size(100%, 40px);
      text-align: left;
      line-height: 40px;
      .customer-name {
        font-size: 28px;
      }
      .service-date {
        font-size: 16px;
      }
    }
    .content {}
    footer {
      @include size(100%, 32px);
    }
  }
</style>
