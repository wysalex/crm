<template lang="html">

  <section class="supplier">

    <mdl-textfield floating-label="搜尋" v-model="keyword"></mdl-textfield>

    <div class="show-list">
      <ul class="mdl-list">
        <li class="mdl-list__item mdl-list__item--two-line" v-for="supplier in filterSuppliers">
          <span class="mdl-list__item-primary-content">
            <i class="material-icons mdl-list__item-icon">business</i>
            <span>{{ supplier.name }}</span>
            <span class="mdl-list__item-sub-title">{{ supplier.tel }}</span>
          </span>
        </li>
      </ul>
    </div>
  </section>

</template>

<script lang="js">
export default {
  name: 'supplier',
  mounted () {
    const db = this.global.db
    var self = this
    var suppliers = this.suppliers
    let supplierRef = db.ref('/supplier')

    supplierRef.on('child_added', function (snapshot) {
      suppliers[snapshot.key] = snapshot.val()
      self.$forceUpdate()
    })
    supplierRef.on('child_removed', function (snapshot) {
      delete suppliers[snapshot.key]
      self.$forceUpdate()
    })
  },
  data () {
    return {
      suppliers: {},
      keyword: ''
    }
  },
  methods: {
    check () {
      console.log(this.suppliers)
    },
    add () {
      this.suppliers.a = {
        name: 'add name'
      }
      this.$forceUpdate()
    }
  },
  computed: {
    filterSuppliers () {
      var keyword = this.keyword.trim()
      if (this.keyword.trim() !== '') {
        return Object.keys(this.suppliers)
          .reduce((r, suppliersIdx) => {
            if (this.suppliers[suppliersIdx].name.toLowerCase().indexOf(keyword) > -1) {
              r[suppliersIdx] = this.suppliers[suppliersIdx]
            }
            return r
          }, {})
          // .filter(suppliersIdx => {
          //   return this.suppliers[suppliersIdx].name.toLowerCase().indexOf(keyword) > -1
          // })
          // .map(suppliersIdx => {
          //   return this.suppliers[suppliersIdx]
          // })
      } else {
        return this.suppliers
      }
    }
  }
}
</script>

<style scoped lang="scss">
  @import "~compass/_compass";
  @import "~scss/lib/_custom";

  .supplier {

  }

  .show-list {
    width: 100%;
    @include align('h');

    > .mdl-list {
      width: 200px;
    }
  }

  .show-card {
    position: relative;
    display: inline-block;
    width: 100%;
    max-width: 400px;

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
        @include align('v');
        height: $herderHeight;
        padding: 4px 8px;
        border-bottom: 1px solid rgba(235, 235, 235, 1);
        div {
          font-size: 24px;
        }
      }
    }

  }
</style>
