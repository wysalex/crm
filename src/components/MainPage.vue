<template lang="html">

  <div class="container">
    <router-link v-for="feature in features" :key="feature.name" :to="feature.path" class="feature">
      <i class="material-icons mdl-list__item-icon feature-icon">{{ feature.icon }}</i>
      <div class="feature-title">{{ feature.title }}</div>
    </router-link>
  </div>

</template>

<script>
export default {
  name: 'mainPage',
  data () {
    return {
      features: [
        {
          name: 'customer',
          title: '客戶資料',
          icon: 'supervisor_account',
          path: '/customer'
        }, {
          name: 'supplier',
          title: '廠商資料',
          icon: 'business',
          path: '/supplier'
        }, {
          name: 'service',
          title: '維修/新購',
          icon: 'build',
          path: '/service'
        }, {
          name: 'feature2',
          title: 'feature 2',
          icon: 'dashboard',
          path: '/feature2'
        }, {
          name: 'feature3',
          title: 'feature 3',
          icon: 'notifications',
          path: '/feature3'
        }, {
          name: 'feature4',
          title: 'feature 4',
          icon: 'priority_high',
          path: '/feature4'
        }, {
          name: 'feature5',
          title: 'feature 5',
          icon: 'priority_high',
          path: '/feature5'
        }, {
          name: 'feature6',
          title: 'feature 6',
          icon: 'priority_high',
          path: '/feature6'
        }, {
          name: 'feature7',
          title: 'feature 7',
          icon: 'priority_high',
          path: '/feature7'
        }, {
          name: 'feature8',
          title: 'feature 8',
          icon: 'priority_high',
          path: '/feature8'
        }, {
          name: 'feature9',
          title: 'feature 9',
          icon: 'priority_high',
          path: '/feature9'
        }
      ],
      msg: 'main page'
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~compass/_compass";
  @import "~scss/lib/_custom";

  $featureW: 150px;
  $featureH: 180px;
  $featureTitleH: 50px;

  .container {
    // text-align: left;
  }

  .feature {
    position: relative;
    display: inline-block;
    // float: left;
    @include range-width(0px, 375px - 1px) {
      @include size(140px, 165px);
      margin: 12px;

      .feature-icon {
        @include size(100%, 165px - $featureTitleH);
        font-size: 60px;
      }

      .feature-title {
        @include size(100%, $featureTitleH);
        font-size: 20px;
      }
    }
    @include range-width(375px, 650px - 1px) {
      @include size(100px, 120px);
      margin: 12px;

      .feature-icon {
        @include size(100%, 120px - 32px);
        font-size: 50px;
      }

      .feature-title {
        @include size(100%, 32px);
        font-size: 16px;
      }
    }
    @include range-width(650px) {
      @include size($featureW, $featureH);
      margin: 12px;

      .feature-icon {
        @include size(100%, $featureH - $featureTitleH);
        font-size: 80px;
      }

      .feature-title {
        @include size(100%, $featureTitleH);
        font-size: 20px;
      }
    }
    cursor: pointer;
    background-color: #fff;
    text-decoration: none;

    @include border-radius(8px);
    @include box-shadow(4px 4px 16px 0 rgba(0, 0, 0, 0.16));
    @include transition(all .3s);

    .feature-icon {
      @include align();
      // @include size(100%, $featureH - $featureTitleH);
      // font-size: 80px;
    }

    .feature-title {
      @include align();
      // @include size(100%, $featureTitleH);
      color: rgba(0, 0, 0, 1);
      // font-size: 20px;
      letter-spacing: 2px;
    }

    &:hover {
      // @include size($featureW * 1.1, $featureH * 1.1);
      transform: scale(1.1);
      @include box-shadow(0px 0px 40px rgba(0, 0, 0, 0.6));

      .feature-icon,
      .feature-title {
        color: rgb(255, 64, 129);
      }
    }
  }

</style>
