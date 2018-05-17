<template lang="html">

  <div class="block">
    <div>{{ msg }}</div>
  </div>

</template>

<script>
export default {
  name: 'PageNotFound',
  data () {
    return {
      msg: 'Oops! Page Not Found!'
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~compass/_compass";
  @import "~scss/lib/_custom";

  .block {
    @include align();
    @include size(100%);
    font-size: 40px;
  }
</style>
