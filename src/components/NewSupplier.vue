<template lang="html">

  <div id="newSupplierCard">
    <div class="container">
      <header>
        <div class="title">{{ func.main }}</div>
        <div class="more"></div>
      </header>
      <div class="content">
        <div class="h-form">
          <v-text-field label="名稱" v-model="form.name"></v-text-field>
        </div>
        <div class="h-form">
          <v-text-field label="電話" v-model="form.tel"></v-text-field>
        </div>
        <div class="h-form">
          <v-text-field label="地址" v-model="form.address"></v-text-field>
        </div>
        <div class="h-form">
          <v-text-field label="備註" v-model="form.note"></v-text-field>
        </div>
      </div>
      <footer>
        <v-btn v-if="formType === 'edit'" @click.native.once="goBack">返回</v-btn>
        <v-btn color="primary" @click.native.once="formAction">{{ formType === 'new' ? '建立' : '儲存' }}</v-btn>
      </footer>
    </div>
  </div>

</template>

<script>
export default {
  name: 'newSupplier',
  props: [],
  mounted () {
    if (this.$route.params.id) {
      this.formType = 'edit'
      this.supplierKey = this.$route.params.id

      const db = this.global.db
      db.ref('/supplier/' + this.supplierKey)
        .once('value')
        .then(snapshot => {
          let supplier = snapshot.val()
          this.form.name = supplier.name
          this.form.tel = supplier.tel
          this.form.address = supplier.address
          this.form.note = supplier.note
        })
    }
  },
  data () {
    return {
      func: {
        main: '廠商資料',
        sub: '新建'
      },
      formType: 'new',
      supplierKey: '',
      form: {
        name: '',
        tel: '',
        address: '',
        note: ''
      }
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
      const db = this.global.db
      const router = this.global.router

      let newSupplier = db.ref('/supplier').push()
      newSupplier.set(this.form)
        .then(() => {
          console.log('Synchronization succeeded')
          this.$store.dispatch('toggleNewSupplier', {
            needShowTip: true
          })
          router.push('/supplier')
        })
        .catch(error => {
          if (error) {
            this.$root.$emit('supplierCreated', {
              message: '建立失敗',
              timeout: 2000
            })
            console.log('Synchronization failed')
          }
        })
    },
    update () {
      const router = this.global.router
      this.global.db
        .ref('/supplier/' + this.supplierKey)
        .update(this.form, (response) => {
          if (response === null) {
            router.push('/supplier')
          }
        })
    },
    goBack () {
      window.history.length > 1 ? this.global.router.go(-1) : this.global.router.replace('/supplier')
    }
  },
  computed: {

  }
}
</script>

<style scoped lang="scss">
  @import "~compass/_compass";
  @import "~scss/lib/_custom";

  #newSupplierCard {
    position: relative;
    display: inline-block;
    width: 100%;
    max-width: 600px;
    // height: 400px;

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
        height: calc(100% - #{$herderHeight} - #{$herderHeight});
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
