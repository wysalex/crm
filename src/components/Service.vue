<template lang="html">

  <section class="service">

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
            <td>{{ props.item.service_type }}</td>
            <td>{{ props.item.service_contents }}</td>
            <td>{{ props.item.brand }}</td>
            <td>{{ props.item.model }}</td>
            <td class="text-xs-right">{{ props.item.price }}</td>
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

  </section>

</template>

<script lang="js">
export default {
  name: 'service',
  props: [],
  data () {
    return {
      showList: true,
      customers: {},
      services: {},
      aServices: [],
      serviceHeaders: [
        { text: 'date', value: 'date' },
        { text: 'name', value: 'customer' },
        { text: 'service type', value: 'service_type' },
        { text: 'service contents', value: 'service_contents' },
        { text: 'brand', value: 'brand' },
        { text: 'model', value: 'model' },
        { text: 'price', value: 'price' }
      ],
      serviceFilter: ''
    }
  },
  mounted () {
    const customerRef = this.global.db.ref('/customer')
    const serviceRef = this.global.db.ref('/service')

    customerRef.on('value', snapshot => {
      this.customers = snapshot.val()
    })
    serviceRef.on('value', snapshot => {
      this.services = snapshot.val()
    })
  },
  methods: {
    log (msg) {
      console.log(msg)
    }
  },
  computed: {
    servicesArr () {
      let temp = Object.keys(this.services)
        .reduce((newArr, serviceIdx) => {
          let tempService = this.services[serviceIdx]
          tempService['.key'] = serviceIdx
          tempService['customer'] = this.customers[tempService['customer']].name
          newArr.push(tempService)
          return newArr
        }, [])
      return temp
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
