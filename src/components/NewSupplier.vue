<template lang="html">

  <div id="newSupplierCard">
    <div class="container">
      <header>
        <div class="title">{{ func.main }}</div>
        <div class="more"></div>
      </header>
      <div class="content">
        <div class="h-form">
          <mdl-textfield floating-label="名稱" v-model="form.name"></mdl-textfield>
        </div>
        <div class="h-form">
          <mdl-textfield floating-label="電話" v-model="form.tel"></mdl-textfield>
        </div>
        <div class="h-form">
          <mdl-textfield floating-label="地址" v-model="form.address"></mdl-textfield>
        </div>
        <div class="h-form">
          <mdl-textfield floating-label="備註" v-model="form.note"></mdl-textfield>
        </div>
      </div>
      <footer>
        <mdl-button class="mdl-js-ripple-effect" @click.native="create">建立</mdl-button>
      </footer>
    </div>
    <mdl-snackbar display-on="supplierCreated"></mdl-snackbar>
  </div>

</template>

<script>
export default {
  name: 'newSupplier',
  props: [],
  mounted () {

  },
  data () {
    return {
      func: {
        main: '廠商資料',
        sub: '新建'
      },
      form: {
        name: '',
        tel: '',
        address: '',
        note: ''
      }
    }
  },
  methods: {
    create () {
      const db = this.global.db
      const router = this.global.router

      var self = this

      let form = this.form
      let newSupplier = db.ref('/supplier').push()
      newSupplier.set(form)
        .then(function () {
          console.log('Synchronization succeeded')
          newSupplier.toString()
          self.$root.$emit('supplierCreated', {
            message: 'Create succeeded',
            timeout: 2000
          })
          router.push('/supplier')
        })
        .catch(function (error) {
          if (error) {
            console.log('Synchronization failed')
          }
        })
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
