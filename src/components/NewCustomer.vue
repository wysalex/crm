<template>
  <div id="newCustomerCard">
    <div class="container">
      <header>
        <div class="title">{{ func.main }}</div>
        <div class="more"></div>
      </header>
      <div class="content">
        <div class="h-form">
          <label for="name">名稱</label>
          <div>
            <input type="text" id="name" name="name" placeholder="">
          </div>
        </div>
        <div class="h-form">
          <label for="note">備註</label>
          <div>
            <textarea type="text" id="note" name="note"></textarea>
          </div>
        </div>
      </div>
      <footer>
        <mdl-button class="mdl-button--raised mdl-js-ripple-effect mdl-button--colored">送出</mdl-button>
      </footer>
    </div>
  </div>
</template>

<script>
export default {

  name: 'newCustomer',

  mounted () {

  },

  data () {
    return {
      func: {
        main: '客戶資料',
        sub: '新建'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~compass/_compass";
@import "~scss/lib/_custom";

#newCustomerCard {
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
      display: inline-block;
      width: 100%;
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
      height: calc(100% - 51px - 51px);
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
