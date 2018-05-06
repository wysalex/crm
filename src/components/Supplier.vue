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
        <li class="mdl-list__item mdl-list__item--two-line supplier-row" v-for="(supplier, supplierIdx) in filterSuppliers">
          <span class="mdl-list__item-primary-content">
            <v-checkbox class="material-icons mdl-list__item-icon" v-model="checkedSuppliers" :value="supplierIdx"></v-checkbox>
            <span class="show-detail" @click="showCard(supplierIdx)">{{ supplier.name }}</span>
            <span class="mdl-list__item-sub-title">{{ supplier.tel }}</span>
          </span>
          <span class="mdl-list__item-secondary-content">
            <v-icon class="row-action" @click="editSupplier(supplierIdx)">edit</v-icon>
            <v-icon class="row-action" @click="comfirmDelSupplier(supplierIdx)">delete</v-icon>
          </span>
        </li>
      </ul>
    </div>

    <v-dialog v-model="supplierCard" persistent max-width="290" v-if="suppliers[selectedSupplier]">
      <v-card>
        <v-card-title>
          <span class="card-title">{{ suppliers[selectedSupplier].name }}</span>
        </v-card-title>
        <v-card-text>
          <table class="card-table">
            <tr class="card-row">
              <td class="card-field">電話</td>
              <td class="card-value">{{ suppliers[selectedSupplier].tel }}</td>
            </tr>
            <tr class="card-row">
              <td class="card-field">地址</td>
              <td class="card-value">{{ suppliers[selectedSupplier].address }}</td>
            </tr>
            <tr class="card-row">
              <td class="card-field">備註</td>
              <td class="card-value">{{ suppliers[selectedSupplier].note }}</td>
            </tr>
          </table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click.native="supplierCard = false">關閉</v-btn>
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
                <span class="mdl-list__item-sub-title">{{ deleteSupplierInfo.tel }}</span>
              </span>
            </li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat color="error" @click.native="delSupplier(deleteSupplierInfo.idx)">確認</v-btn>
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
        tel: ''
      },
      selectedSupplier: '',
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
    comfirmDelSupplier (supplierIdx) {
      this.deleteSupplierInfo.idx = this.suppliers[supplierIdx]['.key']
      this.deleteSupplierInfo.name = this.suppliers[supplierIdx].name
      this.deleteSupplierInfo.tel = this.suppliers[supplierIdx].tel
      this.comfirmDelete = true
    },
    closeDelDialog () {
      this.deleteSupplierInfo.idx = ''
      this.deleteSupplierInfo.name = ''
      this.deleteSupplierInfo.tel = ''
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
    showCard (supplierIdx) {
      this.supplierCard = true
      this.selectedSupplier = supplierIdx
    },
    hideCard () {
      this.selectedSupplier = ''
      this.supplierCard = false
    },
    chooseOne (supplierIdx) {
      this.checkedSuppliers.push(supplierIdx)
    },
    allChecked () {
      this.checkedSuppliers = Object.keys(this.suppliers).map(supplierIdx => parseInt(supplierIdx))
    },
    clearChecked () {
      this.checkedSuppliers = []
    },
    deleteSelected () {
      if (this.checkedSuppliers.length > 0) {
        this.checkedSuppliers.forEach(element => {
          this.delSupplier(this.suppliers[element]['.key'])
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
          .reduce((r, suppliersIdx) => {
            switch (this.searchType) {
              case 'name':
                if (this.suppliers[suppliersIdx].name.toLowerCase().indexOf(keyword) > -1) {
                  r[suppliersIdx] = this.suppliers[suppliersIdx]
                }
                break
              case 'tel':
                if (
                  this.suppliers[suppliersIdx].tel.toLowerCase().indexOf(keyword) > -1 ||
                  (
                    this.suppliers[suppliersIdx].fax &&
                    this.suppliers[suppliersIdx].fax.toLowerCase().indexOf(keyword) > -1
                  ) ||
                  (
                    this.suppliers[suppliersIdx].otherContact &&
                    this.suppliers[suppliersIdx].otherContact.toLowerCase().indexOf(keyword) > -1
                  )
                ) {
                  r[suppliersIdx] = this.suppliers[suppliersIdx]
                }
                break
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
