<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <img src="@/assets/logo.png" alt="Vuetify.js" class="mb-5">
        <blockquote>
          &#8220;First, solve the problem. Then, write the code.&#8221;
          <footer>
            <small>
              <em>&mdash;John Johnson</em>
            </small>
          </footer>
        </blockquote>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import { Estimator } from '@/layers/estimator'
import { MnistData } from '@/layers/data'
export default {
  mounted () {
    this.train()
  },
  methods: {
    async train () {
      let data = new MnistData(0.3)
      await data.load()
      console.log(data)
      let e = new Estimator(100, 0.001, 100)
      console.log('start training')
      e.train(data)
    }
  }
}
</script>


<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
