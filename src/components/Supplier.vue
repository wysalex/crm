<template lang="html">

  <section class="supplier">

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
        <li
          class="mdl-list__item mdl-list__item--two-line supplier-row show-detail"
          v-for="supplier in filterSuppliers"
          @click="getSupplier(supplier.idx)"
        >
          <span class="mdl-list__item-primary-content">
            <v-checkbox
              @click.self.stop=""
              class="material-icons mdl-list__item-icon"
              v-model="checkedSuppliers"
              :value="supplier['.key']"
            ></v-checkbox>
            <span>{{ supplier.name }}</span>
            <span class="mdl-list__item-sub-title">{{ supplier.telphone1 }}</span>
          </span>
          <span class="mdl-list__item-secondary-content">
            <v-icon class="row-action" @click.stop.self="editSupplier(supplier.idx)">edit</v-icon>
            <v-icon class="row-action" @click.stop.self="comfirmDelSupplier(supplier.idx)">delete</v-icon>
          </span>
        </li>
      </ul>
    </div>

    <!-- show supplier card -->
    <v-dialog v-model="supplierCard" persistent max-width="520" v-if="suppliers[showSupplierIdx]">
      <v-card>
        <v-card-title>
          <span class="card-title">{{ suppliers[showSupplierIdx].name }}</span>
        </v-card-title>
        <v-card-text>
          <table class="card-table">
            <tr class="card-row">
              <td class="card-field">電話</td>
              <td class="card-value">{{ suppliers[showSupplierIdx].telphone1 }}</td>
            </tr>
            <tr class="card-row">
              <td class="card-field">地址</td>
              <td class="card-value">{{ suppliers[showSupplierIdx].fullAddress }}</td>
            </tr>
            <tr class="card-row">
              <td class="card-field">備註</td>
              <td class="card-value">{{ suppliers[showSupplierIdx].note }}</td>
            </tr>
          </table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click.native="supplierCard = false">關閉</v-btn>
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
                <i class="material-icons mdl-list__item-icon">business</i>
                <span>{{ deleteSupplierInfo.name }}</span>
                <span class="mdl-list__item-sub-title">{{ deleteSupplierInfo.telphone1 }}</span>
              </span>
            </li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click.native="delSupplier(deleteSupplierInfo.idx)">確認</v-btn>
          <v-btn color="info" @click.native="closeDelDialog">取消</v-btn>
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
  name: 'supplier',
  mounted () {
    // const db = this.global.db
    // let supplierRef = db.ref('/supplier')

    // supplierRef.on('child_added', snapshot => {
    //   this.suppliers[snapshot.key] = snapshot.val()
    //   this.$forceUpdate()
    // })
    // supplierRef.on('child_removed', snapshot => {
    //   delete this.suppliers[snapshot.key]
    //   this.$forceUpdate()
    // })
    if (this.$store.state.hasNewSupplier) {
      this.successSnackbar = true
      this.$store.dispatch('toggleNewSupplier', {
        needShowTip: false
      })
    }
  },
  data () {
    return {
      // suppliers: {},
      searchTypes: [
        { text: '簡碼', val: 'shortCode' },
        { text: '名稱', val: 'name' },
        { text: '電話', val: 'tel' }
      ],
      searchType: 'name',
      successSnackbar: false,
      keyword: '',
      comfirmDelete: false,
      deleteSupplierInfo: {
        idx: '',
        name: '',
        telphone1: ''
      },
      showSupplierIdx: '',
      showSupplierKey: '',
      checkedSuppliers: [],
      supplierCard: false
    }
  },
  firebase () {
    return {
      suppliers: this.global.db.ref('/supplier')
    }
  },
  methods: {
    async getAddress (supplier) {
      let address = ''
      if (this.cities[supplier.city]) {
        address += this.cities[supplier.city].title
      }
      if (supplier.district) {
        let districts = await this.getDistricts(supplier.city)
        districts.forEach(districtInfo => {
          if (districtInfo.zip_code.toString() === supplier.district.toString()) {
            address += districtInfo.district_zh
          }
        })
      }
      if (supplier.address) {
        address += supplier.address
      }
      return address
    },
    async getSupplier (supplierIdx) {
      this.showSupplierIdx = supplierIdx
      this.showSupplierKey = this.suppliers[supplierIdx]['.key']
      let address = await this.getAddress(this.suppliers[supplierIdx])
      this.suppliers[supplierIdx].fullAddress = address
      this.supplierCard = true
    },
    comfirmDelSupplier (supplierIdx) {
      this.deleteSupplierInfo.idx = this.suppliers[supplierIdx]['.key']
      this.deleteSupplierInfo.name = this.suppliers[supplierIdx].name
      this.deleteSupplierInfo.telphone1 = this.suppliers[supplierIdx].telphone1
      this.comfirmDelete = true
    },
    closeDelDialog () {
      this.deleteSupplierInfo.idx = ''
      this.deleteSupplierInfo.name = ''
      this.deleteSupplierInfo.telphone1 = ''
      this.comfirmDelete = false
    },
    delSupplier (supplierIdx) {
      const db = this.global.db
      const supplierRef = db.ref('/supplier')

      supplierRef.child(supplierIdx).remove()
        .then(snapshot => {
          console.log('delete success')
          Object.keys(this.deleteSupplierInfo).map(objectKey => {
            this.deleteSupplierInfo[objectKey] = ''
          })
          this.comfirmDelete = false
          this.supplierCard = false
        })
        .catch(error => {
          if (error) {
            console.log('delete failed')
          }
          this.comfirmDelete = false
          this.supplierCard = false
        })
    },
    hideCard () {
      this.showSupplierIdx = ''
      this.supplierCard = false
    },
    allChecked () {
      this.checkedSuppliers = Object.keys(this.suppliers).map(supplierIdx => this.suppliers[supplierIdx]['.key'])
    },
    clearChecked () {
      this.checkedSuppliers = []
    },
    deleteSelected () {
      if (this.checkedSuppliers.length > 0) {
        this.checkedSuppliers.forEach(supplierKey => {
          this.delSupplier(supplierKey)
        })
        this.checkedSuppliers = []
      }
    },
    editSupplier (supplierIdx) {
      this.global.router.push('/supplier/' + this.suppliers[supplierIdx]['.key'])
    }
  },
  computed: {
    filterSuppliers () {
      var keyword = this.keyword.trim().toLowerCase()
      if (keyword !== '') {
        return Object.keys(this.suppliers)
          .reduce((result, supplierIdx) => {
            let temp = []
            switch (this.searchType) {
              case 'shortCode':
                if (
                  this.suppliers[supplierIdx].shortCode &&
                  this.suppliers[supplierIdx].shortCode.toLowerCase().indexOf(keyword) > -1
                ) {
                  temp = this.suppliers[supplierIdx]
                  temp['idx'] = supplierIdx
                  result.push(temp)
                }
                break
              case 'name':
                if (this.suppliers[supplierIdx].name.toLowerCase().indexOf(keyword) > -1) {
                  temp = this.suppliers[supplierIdx]
                  temp['idx'] = supplierIdx
                  result.push(temp)
                }
                break
              case 'tel':
                if (
                  (
                    this.suppliers[supplierIdx].telphone1 &&
                    this.suppliers[supplierIdx].telphone1.toLowerCase().indexOf(keyword) > -1
                  ) ||
                  (
                    this.suppliers[supplierIdx].telphone2 &&
                    this.suppliers[supplierIdx].telphone2.toLowerCase().indexOf(keyword) > -1
                  ) ||
                  (
                    this.suppliers[supplierIdx].fax &&
                    this.suppliers[supplierIdx].fax.toLowerCase().indexOf(keyword) > -1
                  ) ||
                  (
                    this.suppliers[supplierIdx].otherContact &&
                    this.suppliers[supplierIdx].otherContact.toLowerCase().indexOf(keyword) > -1
                  )
                ) {
                  temp = this.suppliers[supplierIdx]
                  temp['idx'] = supplierIdx
                  result.push(temp)
                }
                break
            }
            return result
          }, []).reverse()
      } else {
        return this.suppliers.map((supplier, supplierIdx) => {
          let temp = supplier
          temp['idx'] = supplierIdx
          return temp
        }).reverse()
      }
    },
    emptyChecked () {
      return this.checkedSuppliers.length === 0
    }
  }
}
</script>

<style scoped lang="scss">
  @import "~compass/_compass";
  @import "~scss/lib/_custom";

  $rowWidth: 360px;

  .supplier {
    @include size(100%);
    padding: 16px 20px;
  }

  .action-block {
    @include align('h');
    > .action {
      width: $rowWidth;
      @include align();
      justify-content: flex-end;
    }
  }

  .show-list {
    width: 100%;
    @include align('h');

    > .mdl-list {
      width: 100%;
      max-width: $rowWidth
    }
  }

  .row-action {
    color: rgba(0, 0, 0, 0.3);
    @include transition(color .3s);
    cursor: pointer;
    &:hover {
      color: rgba(0, 188, 212, 1);
      // color: lighten(rgba(0, 188, 212, 1), 5%);
    }
  }

  .item-head {
    cursor: pointer;
  }

  .show-detail {
    cursor: pointer;
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

  .card-title {
    font-size: 32px;
  }

  .card-table {
    width: 100%;
    .card-row {
      width: 100%;
      > * {
        padding: 4px 8px;
      }
      .card-field {
        width: 30%;
      }
      .card-value {
        width: 70%;
      }
    }
  }

  .supplier-row {
    @include border-radius(4px);
    @include transition(background-color .3s);
    &:hover {
      background-color: darken(rgba(235, 235, 235, 1.00), 10%);
    }
  }
</style>
