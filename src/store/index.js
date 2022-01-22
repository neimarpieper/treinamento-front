import Vue from 'vue'
import Vuex from 'vuex'
import app from './app/'
import paginaCadastroProduto from '../views/produto/store'
import paginaCadastroUsuario from '../views/usuario/store'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    app,
    paginaCadastroProduto,
    paginaCadastroUsuario
  }
})
