<template lang="html">

  <section class="customer">

    <mdl-textfield floating-label="搜尋" v-model="keyword"></mdl-textfield>

    <div class="show-list">
      <ul class="mdl-list">
        <li class="mdl-list__item mdl-list__item--two-line" v-for="(customer, customerIdx) in filterCustomers">
          <span class="mdl-list__item-primary-content">
            <i class="material-icons mdl-list__item-icon">people</i>
            <span>{{ customer.name }}</span>
            <span class="mdl-list__item-sub-title">{{ customer.tel }}</span>
          </span>
          <span class="mdl-list__item-secondary-content">
            <!-- <span class="mdl-list__item-secondary-info">Actor</span> -->
            <a class="mdl-list__item-secondary-action" @click="comfirmDelcustomer(customerIdx)"><i class="material-icons">delete</i></a>
          </span>
        </li>
      </ul>
    </div>

    <mdl-snackbar display-on="customerCreated"></mdl-snackbar>

  </section>

</template>

<script lang="js">
export default {
  name: 'customer',
  props: [],
  mounted () {
    if (this.$store.state.hasNewCustomer) {
      this.$root.$emit('customerCreated', {
        message: '建立成功',
        timeout: 2000
      })
      this.$store.dispatch('toggleNewCustomer', {
        needShowTip: false
      })
    }
  },
  data () {
    return {
      keyword: '',
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

  },
  computed: {
    filterCustomers () {
      var keyword = this.keyword.trim().toLowerCase()
      if (this.keyword.trim() !== '') {
        return Object.keys(this.customers)
          .reduce((r, customersIdx) => {
            if (this.customers[customersIdx].name.toLowerCase().indexOf(keyword) > -1) {
              r[customersIdx] = this.customers[customersIdx]
            }
            return r
          }, {})
      } else {
        return this.customers
      }
    }
  }
}
</script>

<style scoped lang="scss">
  @import "~compass/_compass";
  @import "~scss/lib/_custom";

  .customer {

  }

  .show-list {
    width: 100%;
    @include align('h');

    > .mdl-list {
      width: 100%;
      max-width: 360px;
    }
  }
</style>
