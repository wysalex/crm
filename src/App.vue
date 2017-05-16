<template>
  <div id="app">
    <input type="checkbox" class="interface-status" id="menuStatus" name="menu-status">

    <header id="header">
      <div class="band">
        <span class="icon-home"></span>
        <span>XXX有限公司</span>
      </div>
      <label class="menu-button" for="menuStatus">
        <span class="hamburger"></span>
        <span class="hamburger"></span>
        <span class="hamburger"></span>
      </label>
      <div class="func" id="func">
        <!--<span class="main" id="funcMain">客戶資料</span>-->
        <span class="main"></span>
        <span class="to"></span>
        <!--<span class="sub" id="funcSub">查詢</span>-->
        <span class="sub"></span>
      </div>
      <div class="keep"></div>
    </header>

    <div id="main">
      main
      <router-view></router-view>
    </div>
    <div id="menu">
      <div class="container">
        <ul>
          <li class="group customer">
            <!-- <div><span class="icon icon-users"></span><span :data-main="func.main">客戶資料</span></div> -->
            <div><span class="icon icon-users"></span><span data-main="func.main">客戶資料</span></div>
            <ul>
              <li class="sub">
                <!-- <router-link to="/customer" @click.native="changeTitle" class="icon-search" data-main="客戶資料" data-sub="查詢">查詢</router-link> -->
                <!--<a class="icon-search">查詢</a>-->
              </li>
              <li class="sub">
                <!-- <router-link to="/customer/new" @click.native="changeTitle" class="icon-plus" data-main="客戶資料" data-sub="新建">新建</router-link> -->
                <!--<router-link to="/customer/new" class="icon-plus">新建</router-link>-->
                <!--<a class="icon-plus" href="#">新建</a>-->
              </li>
            </ul>
          </li>
          <li class="group supplier">
            <div><span class="icon icon-account_balance"></span><span>廠商資料</span></div>
            <ul>
              <li class="sub">
                <!-- <router-link to="/supplier" class="icon-search">查詢</router-link> -->
                <!--<a class="icon-search">查詢</a>-->
              </li>
              <li class="sub">
                <!-- <router-link to="/supplier/new" class="icon-plus">新建</router-link> -->
                <!--<a class="icon-plus">新建</a>-->
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data: {
    main: 'main',
    func: {
      main: 'main',
      sub: 'sub'
    }
  }
}
</script>

<style lang="scss">
// @import "node_modules/compass-mixins/lib/compass/_reset";
// @import "compass/reset";
@import "node_modules/compass-mixins/lib/_compass";
@import "src/assets/scss/lib/_custom";
// @import "src/assets/scss/icon.scss";

* {
  &, &:after, &:before {
    vertical-align: top;
    @include box-sizing(border-box);
    // @include selection(rgba(150, 200, 255, 1), rgba(255, 255, 255, 1));
    @include font-smoothing(antialiased);
  }
}

html {
  min-height: 100%;

  body {
    position: relative;
    display: inline-block;
    text-align: center;
    margin: 0;
    width: 100%;
    min-height: 100%;
    font-size: medium;
    // font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif,"微軟正黑體", "Microsoft JhengHei";
    background-color: rgba(235, 235, 235, 1.00);
    color: rgba(50, 50, 50, 0.8);

    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    // @include font-smoothing(antialiased);
  }
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

$headerHeight: 60px;
$bandWidth: 250px;
$funcWidth: 160px;

.interface-status {
  position: fixed;
  top: -999px;
  left: -999px;
}

#header {
  position: fixed;
  display: inline-block;
  top: 0;
  left: 0;
  z-index: 200;
  width: 100%;
  height: $headerHeight;
  background-color: white;
  @include clearfix();
  @include box-shadow(0 2px 5px 0 rgba(0,0,0,0.16));

  > * {
    display: inline-block;
    float: left;
    // border: 1px solid rgba(179, 79, 85, 1.000);
  }
  .band {
    display: inline-block;
    width: $bandWidth;
    height: 100%;
    font-size: 24px;
    color: white;
    background-color: rgba(0, 188, 212, 1.000);

    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;

    overflow: hidden;
    white-space: nowrap;

    @include transition(width .3s);

    :first-child {
      line-height: $headerHeight;
      margin-right: 5px;
      @include transition(font-size .3s);
    }
    :last-child {
      letter-spacing: 1px;
      font-weight: bold;
      @include opacity(1);
      @include transition(opacity .3s);
    }
  }
  .menu-button {
    display: inline-block;
    width: $headerHeight;
    height: $headerHeight;
    padding: 18px;
    cursor: pointer;
    .hamburger {
      position: relative;
      display: block;
      margin: 0 auto;
      width: 100%;
      height: 2px;
      background-color: black;
      @include border-radius(5px);
      @include transition(top .3s, transform .3s, opacity .3s);

      &:nth-child(1) {
        top: 10px;
        @include rotate(45deg);
      }
      &:nth-child(2) {
        @include opacity(0);
      }
      &:nth-child(3) {
        top: 6px;
        @include rotate(-45deg);
      }
      // @for $i from 1 through 3 {
      //   &:nth-child($i) {
      //     top: 10px;
      //   }
      // }
    }
  }
  .func {
    display: inline-block;
    width: $funcWidth;
    height: $headerHeight;
    background-color: rgba(255, 0, 0, .2000);

    > * {
      height: $headerHeight;
      line-height: $headerHeight;
      font-size: 18px;
      font-weight: bold;
      letter-spacing: 1px;
    }
    .main {}
    .to {
      position: relative;
      padding: 0 8px;
      &:before {
        position: absolute;
        top: 8px;
        left: 3px;
        content: '';
        display: inline-block;
        width: 6px;
        height: 6px;
        border: 2px solid rgba(50, 50, 50, 0.8);
        border-left: none;
        border-bottom: none;
        @include rotate(45deg);
      }
    }
    .sub {}
  }
  .keep {
    display: inline-block;
    width: calc(100% - #{$bandWidth} - #{$headerHeight} - #{$funcWidth});
    height: $headerHeight;
  }
}

#main {
  padding-top: $headerHeight;
  padding-left: $bandWidth;
  background-color: rgba(0, 0, 255, .200);
  @include transition(padding .3s);
}

$color: rgba(0, 188, 212, 1.000);

#menu {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 150;
  width: $bandWidth;
  height: 100%;
  padding-top: $headerHeight;
  color: white;
  text-align: left;
  white-space: nowrap;
  background-color: $color;

  @include box-shadow(rgba(0, 0, 0, 0.156863) 0px 3px 10px, rgba(0, 0, 0, 0.227451) 0px 3px 10px);
  @include transition(width .3s);

  > .container {
    padding: 15px 0;
    .group {
      display: block;
      overflow: hidden;
      font-size: 20px;
      > div {
        position: relative;
        display: inline-block;
        width: 100%;
        height: 40px;
        padding: 0 10px;
        cursor: pointer;
        @include transition(background-color .3s);
        > * {
          line-height: 40px;
        }
        .icon {
          &:before {
            padding-right: 8px;
            @include transition(font-size .3s);
          }
          &:after {
            content: '\e907';
            position: absolute;
            top: 0;
            right: 10px;
            @include transition(transform .3s);
          }
        }
        .icon-account_balance {
          &:before {
            font-size: 23px;
          }
        }

        &:hover, &:focus, &:active {
          background-color: darken($color, 3%);
        }
      }
      > ul {
        height: 0;
        overflow: hidden;
        margin: 0;
        padding: 0;
        @include opacity(0);
        @include transition(height .3s, padding .3s, margin .3s, opacity .3s);

        border-top: 1px solid rgba(255, 255, 255, .500);
        border-bottom: 1px solid rgba(255, 255, 255, .500);

        .sub {
          > a {
            display: inline-block;
            width: 100%;
            height: 35px;
            color: white;
            text-decoration: none;
            line-height: 35px;
            padding: 0 10px 0 30px;
            cursor: pointer;
            @include transition(background-color .3s, font-size .3s, padding .3s);
            &:before {
              @include transition(font-size .3s, padding .3s);
              padding-right: 8px;
            }

            &:hover {
              background-color: darken($color, 3%)
            }
          }
        }
      }
      &:nth-child(n + 2) {
        padding-top: 5px;
      }



      &.active {
        .icon {
          &:after {
            @include rotate(180deg);
          }
        }
        > ul {
          margin: 8px 0;
          padding: 4px 0;
          height: calc(70px + 2px + (4px * 2));
          @include opacity(1);
        }
      }
    }
  }
}

#menuStatus {
  &:checked {
    ~ #header {
      .band {
        width: $headerHeight;
        *:first-child {
          margin-right: 0;
          font-size: 30px;
        }
        *:last-child {
          display: none;
          @include opacity(0);
        }
      }
      .menu-button {
        .hamburger {
          &:nth-child(1) {
            @include rotate(0);
            top: 2px;
          }
          &:nth-child(2) {
            @include opacity(1);
            top: 8px;
          }
          &:nth-child(3) {
            @include rotate(0);
            top: 14px;
          }
        }
        &:hover {
          .hamburger {
            &:nth-child(1) {
              top: 5px;
            }
            &:nth-child(2) {
              top: 8px;
            }
            &:nth-child(3) {
              top: 11px;
            }
          }
        }
      }
    }
    ~ #main {
      padding-left: $headerHeight;
    }
    ~ #menu {
      width: $headerHeight;
      > .container {
        .group {
          > div {
            .icon {
              font-size: 28px;
              &:before {
                padding: 0 20px 0 4px;
              }
              &:after {
                display: none;
              }
            }
            .icon-account_balance {
              &:before {
                font-size: 30px;
              }
            }
          }
          > ul {
            > li {
              a {
                font-size: 20px;
                padding-left: 20px;
                &:before {
                  padding-right: 20px;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
