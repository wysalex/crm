<template>

  <section class="block">
    <div class="display-card">
      <div class="container">
        <header>
          <div class="title">匯入檔案</div>
        </header>
        <div class="content">
          <v-text-field
            label="選擇檔案"
            @click="pickFile"
            v-model="dataName"
            prepend-icon="attach_file"
          ></v-text-field>
          <input
            type="file"
            style="display: none"
            ref="data"
            accept="text/csv"
            @change="onFilePicked"
          >
        </div>
        <footer>
          <v-btn
            :loading="uploading"
            :disabled="uploading || uploadDataTemp.length === 0"
            color="info"
            @click.native="importData"
          >匯入<v-icon right>cloud_upload</v-icon></v-btn>
        </footer>
      </div>
    </div>
    <div class="display-card">
      <div class="container">
        <header>
          <div class="title">匯出項目</div>
        </header>
        <div class="content">
          <v-checkbox label="客戶名稱" input-value="true" value></v-checkbox>
          <v-checkbox label="市話 1" v-model="getData.telphone1"></v-checkbox>
          <v-checkbox label="市話 2" v-model="getData.telphone2"></v-checkbox>
          <v-checkbox label="手機" v-model="getData.phone"></v-checkbox>
          <v-checkbox label="其他聯絡方式" v-model="getData.otherContact"></v-checkbox>
          <v-checkbox label="地址" v-model="getData.address"></v-checkbox>
        </div>
        <footer>
          <v-btn color="info" @click.native="exportData">匯出<v-icon right>cloud_download</v-icon></v-btn>
        </footer>
      </div>
    </div>
  </section>

</template>

<script>
import moment from 'moment'

export default {
  name: 'ExportCustomer',
  mounted () {
    const ua = navigator.userAgent
    const windowsRegex = new RegExp('Windows NT', 'i')
    if (windowsRegex.test(ua)) {
      this.lineBreak = '\r\n'
    } else {
      this.lineBreak = '\n'
    }
  },
  data () {
    return {
      dialog: false,
      dataName: '',
      dataUrl: '',
      dataFile: '',
      uploadDataTemp: [],
      uploading: false,
      lineBreak: '',
      getData: {
        telphone1: true,
        telphone2: false,
        phone: false,
        otherContact: false,
        address: true
      }
    }
  },
  methods: {
    pickFile () {
      console.clear()
      this.$refs.data.click()
    },
    onFilePicked ($event) {
      const files = $event.target.files
      if (files[0] !== undefined) {
        this.dataName = files[0].name
        if (this.dataName.lastIndexOf('.') <= 0) {
          return
        }
        const fr = new FileReader()
        fr.readAsDataURL(files[0])
        fr.addEventListener('load', () => {
          this.dataUrl = fr.result
          this.dataFile = files[0] // this is an data file that can be sent to server...
          const header = fr.result.split(',', 1)[0]
          const contents = fr.result.replace(`${header},`, '')
          let decode = decodeURIComponent(atob(contents).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
          }).join(''))

          const csvToArray = function (text) {
            let p = ''
            let row = ['']
            let ret = [row]
            let i = 0
            let r = 0
            let s = !0
            let l
            for (l in text) {
              l = text[l]
              if (l === '"') {
                if (s && l === p) row[i] += l
                s = !s
              } else if (l === ',' && s) {
                l = row[++i] = ''
              } else if (l === '\n' && s) {
                if (p === '\r') {
                  row[i] = row[i].slice(0, -1)
                }
                row = ret[++r] = [l = '']
                i = 0
              } else row[i] += l
              p = l
            }
            return ret
          }
          this.uploadDataTemp = csvToArray(decode)
        })
        // fr.readAsText(this.dataFile)
      } else {
        this.dataName = ''
        this.dataFile = ''
        this.dataUrl = ''
        this.uploadDataTemp = []
      }
    },
    importData () {
      this.uploading = true
      const field = this.uploadDataTemp.shift()
      const parsedField = field.map(fieldName => {
        switch (fieldName) {
          case '客戶名稱':
            return 'name'
          case '市話 1':
            return 'telphone1'
          case '市話 2':
            return 'telphone2'
          case '手機':
            return 'phone'
          case '其他聯絡方式':
            return 'otherContact'
          case '郵遞區號':
            return 'zipCode'
          case '地址':
            return 'address'
        }
      })
      this.uploadDataTemp.forEach(async dataset => {
        let newId = 0
        await this.db.ref('/customer').orderByChild('id').limitToLast(1).once('value')
          .then(snapshot => {
            const lastCustomer = snapshot.val()
            Object.keys(lastCustomer).forEach(customerKey => {
              newId = lastCustomer[customerKey].id + 1
            })
          })
          .then(() => {
            const form = dataset.reduce((result, val, idx) => {
              result[parsedField[idx]] = val
              return result
            }, {})
            form.id = newId

            this.db.ref('/customer').push().set(form)
              .then(() => {
                console.log('Synchronization succeeded')
              })
              .catch(error => {
                if (error) {
                  console.log('Synchronization failed')
                }
              })
          })
      })
      this.dataName = ''
      this.dataFile = ''
      this.dataUrl = ''
      this.uploadDataTemp = []
      this.uploading = false
      this.$refs.data.value = ''
    },
    exportData () {
      // let csvHeader = 'data:application/csv;charset=utf-8,'
      let csvHeader = 'data:text/csv;charset=utf-8,'
      // let csvHeader = 'data:attachment/csv;charset=big-5,'
      let csvContent = ''
      this.db.ref('/customer')
        .once('value')
        .then(async snapshot => {
          const customers = snapshot.val()

          // make title
          csvContent += '客戶名稱'
          if (this.getData.telphone1) {
            csvContent += ',市話 1'
          }
          if (this.getData.telphone2) {
            csvContent += ',市話 2'
          }
          if (this.getData.phone) {
            csvContent += ',手機'
          }
          if (this.getData.otherContact) {
            csvContent += ',其他聯絡方式'
          }
          if (this.getData.address) {
            csvContent += ',郵遞區號'
            csvContent += ',地址'
          }
          csvContent += this.lineBreak

          // parse data
          let customerDataSetsP = Object.keys(customers)
            .reduce(async (dataSetsP, customerKey) => {
              const dataSets = await dataSetsP
              let dataSet = []
              dataSet.push(customers[customerKey].name)
              if (this.getData.telphone1) {
                dataSet.push(customers[customerKey].telphone1)
              }
              if (this.getData.telphone2) {
                dataSet.push(customers[customerKey].telphone2)
              }
              if (this.getData.phone) {
                dataSet.push(customers[customerKey].phone)
              }
              if (this.getData.otherContact) {
                dataSet.push(customers[customerKey].otherContact)
              }
              if (this.getData.address) {
                dataSet.push(customers[customerKey].zipCode)
                dataSet.push(customers[customerKey].address)
              }
              dataSets.push(dataSet)
              return dataSets
            }, [])

          const customerDataSets = await customerDataSetsP

          // make csv content
          customerDataSets.forEach(rowArray => {
            let row = rowArray.join(',')
            csvContent += row + this.lineBreak
          })
          csvContent = csvHeader + encodeURIComponent(csvContent)

          // download file
          const link = document.createElement('a')
          link.setAttribute('href', csvContent)
          // link.setAttribute('target', '_blank')
          link.setAttribute('download', `customer-data_${moment().format('YYYY-MM-DD_HHmm')}.csv`)
          link.click()
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~compass/_compass";
@import "~scss/lib/_custom";

$herderHeight: 48px;

.block {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
}
.display-card {
  position: relative;
  // display: block;
  width: 100%;
  max-width: 600px;
  padding: 16px 20px;

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
      padding: 4px 0;
      border-bottom: 1px solid rgba(235, 235, 235, 1);
      @include clearfix();
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
      }
    }
    > .content {
      height: calc(100% - 51px - 51px);
    }
    > footer {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: flex-start;
      align-items: center;

      height: $herderHeight;
      border-top: 1px solid rgba(235, 235, 235, 1);
      button {
        font-size: 16px;
        font-weight: bold;
        &:first-child {
          margin-left: 0px;
        }
      }
    }
  }
}
</style>
