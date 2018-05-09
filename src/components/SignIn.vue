<template lang="html">

  <v-app>
    <vue-progress-bar></vue-progress-bar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-card-title primary-title>
                <div>
                  <div class="headline">登入</div>
                </div>
              </v-card-title>
              <v-card-text>
                <v-form>
                  <v-text-field prepend-icon="person" label="帳號" type="text" v-model="account"></v-text-field>
                  <v-text-field prepend-icon="lock" label="密碼" id="password" type="password" v-model="password"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  :loading="loading"
                  :disabled="loading"
                  @click="signIn"
                >登入</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>

</template>

<script lang="js">
export default {
  name: 'signIn',
  props: [],
  mounted () {
  },
  data () {
    return {
      loading: false,
      account: 'wysalexwang@gmail.com',
      password: 'PassWord'
    }
  },
  methods: {
    signIn () {
      if (!this.loading) {
        this.$Progress.start()
        this.$Progress.increase(30)
        this.loading = true
        this.global.firebase
          .auth()
          .signInWithEmailAndPassword(this.account, this.password)
          .then(() => {
            this.$Progress.finish()
            console.log('sign in success')
          })
          .catch(error => {
            this.$Progress.fail()
            const errorCode = error.code
            const errorMessage = error.message
            console.log(errorCode)
            console.log(errorMessage)
            if (errorCode === 'auth/wrong-password') {
              alert('Account or password error!')
            } else {
              alert(errorMessage)
            }
            this.loading = false
          })
      }
    }
  },
  computed: {
  }
}
</script>

<style scoped lang="scss">
  @import "~compass/_compass";
  @import "~scss/lib/_custom";

</style>
