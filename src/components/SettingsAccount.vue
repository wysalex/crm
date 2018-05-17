<template lang="html">

  <section class="multiple-operations">
    <v-container grid-list-xs>
      <v-layout row wrap class="content">
        <v-flex xs12 class="feature">
          <h3>重建地址資料庫</h3>
          <div class="comment">若發生地址顯示錯誤，請使用此功能，將地址的資料庫重建。</div>
          <div class="action">
            <v-btn
              :loading="loading.rebuildAddress"
              :disabled="loading.rebuildAddress"
              @click="rebuildDB('address')"
            >重建資料庫</v-btn>
            <span v-if="progress.address > 0">{{ progress.address }} %</span>
            <!-- <span id="addressProgress"></span> -->
          </div>
        </v-flex>
        <v-flex xs12 class="feature">
          <h3>重建產品資料庫</h3>
          <div class="comment">若發生產品選項顯示錯誤，請使用此功能，將產品的資料庫重建。</div>
          <div class="action">
            <v-btn
              :loading="loading.rebuildProduct"
              :disabled="loading.rebuildProduct"
              @click="rebuildDB('product')"
            >重建資料庫</v-btn>
            <span v-if="progress.product > 0">{{ progress.product }} %</span>
          </div>
        </v-flex>
        <v-flex xs12 class="feature">
          <h3>變更密碼</h3>
          <div class="action">
            <v-btn @click="updatePassword">變更密碼</v-btn>
          </div>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- update password form -->
    <v-dialog v-model="comfirmUpdatePasswordCard" persistent max-width="400">
      <v-card>
        <!-- <v-card-title>請重新確認您的密碼</v-card-title> -->
        <v-card-text>
          <v-text-field
            label="帳號"
            v-model="account"
            readonly
          ></v-text-field>
          <v-text-field
            label="舊密碼"
            :append-icon="passwordVisible.p1 ? 'visibility_off' : 'visibility'"
            :append-icon-cb="() => (passwordVisible.p1 = !passwordVisible.p1)"
            :type="passwordVisible.p1 ? 'text' : 'password'"
            :rules="[() => oldPassword.length > 0 || '請輸入舊密碼']"
            :error-messages="passwordError"
            @input="passwordError = []"
            v-model="oldPassword"
            required
            :disabled="passwordChanging"
          ></v-text-field>
          <v-text-field
            label="新密碼"
            :append-icon="passwordVisible.p2 ? 'visibility_off' : 'visibility'"
            :append-icon-cb="() => (passwordVisible.p2 = !passwordVisible.p2)"
            :type="passwordVisible.p2 ? 'text' : 'password'"
            :rules="[() => newPassword.length > 0 || '請輸入新密碼']"
            :error-messages="newPasswordError"
            @input="newPasswordError = []"
            v-model="newPassword"
            required
            :disabled="passwordChanging"
          ></v-text-field>
          <v-text-field
            label="確認新密碼"
            :append-icon="passwordVisible.p3 ? 'visibility_off' : 'visibility'"
            :append-icon-cb="() => (passwordVisible.p3 = !passwordVisible.p3)"
            :type="passwordVisible.p3 ? 'text' : 'password'"
            :rules="[
              () => newPassword === confirmPassword || '密碼不相符，請確認',
              () => confirmPassword.length > 0 || '請再輸入一次新密碼'
            ]"
            :error-messages="confirmPasswordError"
            @input="confirmPasswordError = []"
            v-model="confirmPassword"
            required
            :disabled="passwordChanging"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="card-action">
          <v-btn
            color="info"
            :loading="passwordChanging"
            :disabled="passwordChanging"
            @click.native="submit"
          >確認</v-btn>
          <v-btn
            :disabled="passwordChanging"
            @click.native="cancelUpdatePassword"
          >取消</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      :timeout="parseInt(2000)"
      :color="databaseUpdateState"
      v-model="databaseUpdateStateSnackbar"
    >{{ databaseUpdateMSG }}</v-snackbar>

    <v-snackbar
      :timeout="parseInt(2000)"
      color="success"
      v-model="updateSuccessSnackbar"
    >密碼更新成功</v-snackbar>

  </section>

</template>

<script>
import idb from 'idb'

export default {
  name: 'SettingsAccount',
  data () {
    return {
      progress: {
        address: 0,
        product: 0
      },
      loading: {
        rebuildAddress: false,
        rebuildProduct: false
      },
      databaseUpdateState: 'success',
      databaseUpdateStateSnackbar: false,
      databaseUpdateMSG: '',
      comfirmUpdatePasswordCard: false,
      updateSuccessSnackbar: false,
      passwordChanging: false,
      passwordVisible: {
        p1: false,
        p2: false,
        p3: false
      },
      passwordError: [],
      newPasswordError: [],
      confirmPasswordError: [],
      account: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  },
  methods: {
    async rebuildDB (dbType) {
      switch (dbType) {
        case 'address':
          this.progress.address = 0
          this.loading.rebuildAddress = true
          let zipCodeData = []
          await this.axios.get('/static/zipCode.json')
            .then(response => {
              this.progress.address = 1
              zipCodeData = response.data
              idb.open('crmDB')
                .then(dbh => {
                  const tx = dbh.transaction('road', 'readwrite')
                  tx.objectStore('road').clear()
                  return tx.complete
                })
                .then(async () => {
                  await this.initialAddressDB(zipCodeData)
                })
            })
            .catch(error => {
              this.databaseUpdateState = 'error'
              this.databaseUpdateStateSnackbar = true
              this.databaseUpdateMSG = '重建失敗'
              console.log(error)
            })
          break
        case 'product':
          this.progress.product = 0
          this.loading.rebuildProduct = true
          let productData = []
          await this.axios.get('/static/products.json')
            .then(response => {
              productData = response.data
              idb.open('crmDB')
                .then(dbh => {
                  const tx = dbh.transaction('product', 'readwrite')
                  tx.objectStore('product').clear()
                  return tx.complete
                })
                .then(async () => {
                  this.progress.product = 1
                  await this.initialProductDB(productData)
                  this.loading.rebuildProduct = false
                })
            })
            .catch(error => {
              this.databaseUpdateState = 'error'
              this.databaseUpdateStateSnackbar = true
              this.databaseUpdateMSG = '重建失敗'
              console.log(error)
            })
          break
      }
    },
    /**
     * TODO
     * maybe can change to navigator.serviceWorker
     */
    async initialAddressDB (zipCodeData) {
      let total = zipCodeData.length
      let triggered = []

      idb.open('crmDB', 1, upgradeDB => {
        const objectStore = upgradeDB.createObjectStore('road', { keyPath: 'id' })
        objectStore.createIndex('zipCode', 'zipCode', { unique: false })
        objectStore.createIndex('city', 'city', { unique: false })
        objectStore.createIndex('area', 'area', { unique: false })
        objectStore.createIndex('road', 'road', { unique: false })
      }).then(dbh => {
        const tx = dbh.transaction('road', 'readwrite')
        let store = tx.objectStore('road')
        let succeeded = 0
        // beacuse data is too large, so it will insert one by one
        // https://stackoverflow.com/questions/34061938/inserting-large-amount-of-data-making-page-idle
        const doNextRecord = () => {
          if (succeeded < zipCodeData.length) {
            store.put(zipCodeData[succeeded]).then(() => {
              doNextRecord()
            })
            ++succeeded
            const successfully = parseInt(succeeded / total * 100)
            if (
              successfully > 0 &&
              triggered.indexOf(successfully) < 0 &&
              successfully !== 100
            ) {
              triggered.push(successfully)
              this.progress.address = successfully
            } else if (successfully === 100) {
              this.progress.address = 100
              this.loading.rebuildAddress = false
              this.databaseUpdateState = 'success'
              this.databaseUpdateStateSnackbar = true
              this.databaseUpdateMSG = '地址資料庫重建成功'
              setTimeout(() => {
                this.progress.address = 0
              }, 2000)
            }
          }
        }
        doNextRecord()
      })
    },
    async initialProductDB (productData) {
      let total = productData.length
      let triggered = []

      idb.open('crmDB', 1, upgradeDB => {
        const objectStore = upgradeDB.createObjectStore('product', { keyPath: 'id' })
        objectStore.createIndex('productName', 'productName', { unique: false })
        objectStore.createIndex('shortCode', 'shortCode', { unique: false })
      }).then(dbh => {
        const tx = dbh.transaction('product', 'readwrite')
        let store = tx.objectStore('product')
        let succeeded = 0
        const doNextRecord = () => {
          if (succeeded < productData.length) {
            store.put(productData[succeeded]).then(() => {
              doNextRecord()
            })
            ++succeeded
            const successfully = parseInt(succeeded / total * 100)
            if (
              successfully > 0 &&
              triggered.indexOf(successfully) < 0 &&
              successfully !== 100
            ) {
              triggered.push(successfully)
              this.progress.product = successfully
            } else if (successfully === 100) {
              this.progress.product = 100
              this.loading.rebuildProduct = false
              this.databaseUpdateState = 'success'
              this.databaseUpdateStateSnackbar = true
              this.databaseUpdateMSG = '產品資料庫重建成功'
              setTimeout(() => {
                this.progress.product = 0
              }, 2000)
            }
          }
        }
        doNextRecord()
      })
    },
    updatePassword () {
      let user = this.global.firebase.auth().currentUser
      this.account = user.email
      this.comfirmUpdatePasswordCard = true
    },
    submit () {
      if (this.oldPassword === '' || this.newPassword === '' || this.confirmPassword === '') {
        if (this.oldPassword === '') {
          this.passwordError = '請輸入舊密碼'
        }
        if (this.newPassword === '') {
          this.newPasswordError = '請輸入新密碼'
        }
        if (this.confirmPassword === '') {
          this.confirmPasswordError = '請再輸入一次新密碼'
        }
      } else if (this.newPassword !== this.confirmPassword) {
        this.newPasswordError = '密碼不相符，請確認'
        this.confirmPasswordError = '密碼不相符，請確認'
      } else {
        this.passwordChanging = true
        let user = this.global.firebase.auth().currentUser
        // get credential
        // https://firebase.google.com/docs/reference/js/firebase.auth.EmailAuthProvider?hl=zh-TW
        let credential = this.global.firebase.auth.EmailAuthProvider.credential(this.account, this.oldPassword)
        // https://firebase.google.com/docs/auth/web/manage-users#re_authenticate_a_user
        user.reauthenticateAndRetrieveDataWithCredential(credential).then((a) => {
          user.updatePassword(this.newPassword).then(() => {
            this.passwordChanging = false
            this.updateSuccessSnackbar = true
            this.comfirmUpdatePasswordCard = false
            setTimeout(() => {
              this.global.router.go({
                path: '/settings/account',
                force: true
              })
            }, 1000)
          }).catch(error => {
            this.passwordChanging = false
            console.log(error)
          })
        }).catch(error => {
          this.passwordChanging = false
          console.log(error)
          if (error.code && error.code === 'auth/wrong-password') {
            this.passwordError = '密碼錯誤，請再確認一次'
          }
        })
      }
    },
    cancelUpdatePassword () {
      this.comfirmUpdatePasswordCard = false
      this.passwordError = []
      this.account = ''
      this.oldPassword = ''
      this.newPassword = ''
      this.confirmPassword = ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~compass/_compass";
@import "~scss/lib/_custom";

$herderHeight: 48px;

.multiple-operations {
  position: relative;
  display: inline-block;
  width: 100%;
  max-width: 800px;
  padding: 16px 20px;

  > .container {
    height: 100%;
    background-color: white;
    padding: 16px 16px;
    @include border-radius(4px);
    @include box-shadow(0 1px 4px 0 rgba(0,0,0,0.14));
    > * {
      display: inline-block;
      width: 100%;
    }
    > .content {
      height: calc(100% - 51px - 51px);

      > .feature {
        text-align: left;
        padding: 0 8px;
        > h3 {
          font-size: 28px;
          line-height: 36px;
          padding-top: 62px;
        }
        > .comment {
          margin-top: 24px;
          color: rgba(0,0,0,0.65);
          font-size: 17px;
          font-weight: 400;
          line-height: 24px;
        }
        > .action {
          padding-top: 8px;
          > :first-child {
            margin-left: 0;
          }
        }
        &:not(:first-child) {
          border-top: 1px solid rgba(0, 0, 0, 0.12);
          margin-top: 20px;
        }
      }
    }
  }
}

.card-action {
  padding: 16px;
  > :first-child {
    margin-left: 0;
  }
}
</style>
