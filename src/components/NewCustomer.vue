<template>
  <section>

    <div id="newCustomerCard">
      <div class="container">
        <header>
          <div class="title">{{ func.main }}</div>
          <div class="more"></div>
        </header>
        <div class="content">
          <v-text-field
            label="名稱"
            v-model="form.name"
            :rules="[() => form.name.length > 0 || 'This field is required']"
            required>
          </v-text-field>
          <v-text-field label="電話" v-model="form.tel"></v-text-field>
          <v-select
            label="居住地"
            :loading="loading"
            :items="citys"
            v-model="city"
            item-text="title"
            autocomplete
          ></v-select>
          <v-select
            label="地區"
            :items="districts"
            v-model="district"
            item-text="district_zh"
            autocomplete
          ></v-select>
          <v-text-field label="地址" v-model="form.address"></v-text-field>
          <v-text-field label="備註" v-model="form.note"></v-text-field>
        </div>
        <footer>
          <mdl-button class="mdl-button--raised mdl-js-ripple-effect mdl-button--colored" @click.native.once="create">送出</mdl-button>
        </footer>
      </div>
    </div>

    <mdl-snackbar display-on="createError"></mdl-snackbar>

  </section>
</template>

<script>
export default {

  name: 'newCustomer',

  mounted () {

  },

  data () {
    return {
      loading: false,
      citys: [
        {
          id: 0,
          title: '彰化縣',
          name: 'changhuaCounty',
          category: 'changhuaCounty',
          districts: []
        }, {
          id: 1,
          title: '嘉義市',
          name: 'chiayiCity',
          category: 'chiayiCity',
          districts: []
        }, {
          id: 2,
          title: '嘉義縣',
          name: 'chiayiCounty',
          category: 'chiayiCounty',
          districts: []
        }, {
          id: 3,
          title: '新竹市',
          name: 'hsinchuCity',
          category: 'hsinchuCity',
          districts: []
        }, {
          id: 4,
          title: '新竹縣',
          name: 'hsinchuCounty',
          category: 'hsinchuCounty',
          districts: []
        }, {
          id: 5,
          title: '花蓮縣',
          name: 'hualienCounty',
          category: 'hualienCounty',
          districts: []
        }, {
          id: 6,
          title: '高雄市',
          name: 'kaohsiungCity',
          category: 'kaohsiungCity',
          districts: []
        }, {
          id: 7,
          title: '基隆市',
          name: 'keelungCity',
          category: 'keelungCity',
          districts: []
        }, {
          id: 8,
          title: '苗栗縣',
          name: 'miaoliCounty',
          category: 'miaoliCounty',
          districts: []
        }, {
          id: 9,
          title: '南投縣',
          name: 'nantouCounty',
          category: 'nantouCounty',
          districts: []
        }, {
          id: 10,
          title: '新北市',
          name: 'newTaipeiCity',
          category: 'newTaipeiCity',
          districts: []
        }, {
          id: 11,
          title: '澎湖縣',
          name: 'penghuCounty',
          category: 'penghuCounty',
          districts: []
        }, {
          id: 12,
          title: '屏東縣',
          name: 'pingtungCounty',
          category: 'pingtungCounty',
          districts: []
        }, {
          id: 13,
          title: '台中市',
          name: 'taichungCity',
          category: 'taichungCity',
          districts: []
        }, {
          id: 14,
          title: '台南市',
          name: 'tainanCity',
          category: 'tainanCity',
          districts: []
        }, {
          id: 15,
          title: '台北市',
          name: 'taipeiCity',
          category: 'taipeiCity',
          districts: []
        }, {
          id: 16,
          title: '台東縣',
          name: 'taitungCounty',
          category: 'taitungCounty',
          districts: []
        }, {
          id: 17,
          title: '桃園市',
          name: 'taoyuanCity',
          category: 'taoyuanCity',
          districts: []
        }, {
          id: 18,
          title: '宜蘭縣',
          name: 'yilanCounty',
          category: 'yilanCounty',
          districts: []
        }, {
          id: 19,
          title: '宜蘭市',
          name: 'yunlinCounty',
          category: 'yunlinCounty',
          districts: []
        }
      ],
      func: {
        main: '客戶資料',
        sub: '新建'
      },
      city: {},
      district: {},
      form: {
        name: '',
        tel: '',
        address: '',
        city: '',
        district: '',
        note: ''
      }
    }
  },
  computed: {
    districts () {
      this.district = {}
      if (this.city.hasOwnProperty('id')) {
        if (this.citys[this.city.id].districts.length > 0) {
          return this.citys[this.city.id].districts
        } else {
          this.loading = true
          this.axios.get(`/static/location/${this.city.category}.json`)
            .then(response => {
              this.loading = false
              this.citys[this.city.id].districts = response.data
              return this.citys[this.city.id].districts
            })
            .catch(error => {
              this.loading = false
              this.city = {}
              console.log(error)
            })
        }
      } else {
        return []
      }
    }
  },
  methods: {
    create () {
      const db = this.global.db
      const newCustomer = db.ref('/customer').push()
      const form = {
        name: this.form.name,
        tel: this.form.tel,
        address: this.form.address,
        city: this.city.name,
        zipCode: this.district.zip_code,
        note: this.form.note
      }
      newCustomer.set(form)
        .then(() => {
          console.log('Synchronization succeeded')
          this.$store.dispatch('toggleNewCustomer', {
            needShowTip: true
          })
          this.global.router.push('/customer')
        })
        .catch(error => {
          if (error) {
            this.$root.$emit('createError', {
              message: '建立失敗',
              timeout: 2000
            })
            console.log('Synchronization failed')
          }
        })
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

  padding: 16px 20px;

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
