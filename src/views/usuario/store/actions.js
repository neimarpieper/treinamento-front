import axios from '@/plugins/axios'

export const listar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get('/usuario', filtros)

    if (res && !res.data.erro) commit('registros', res.data)

    return res.data
  } catch (error) {
    return error
  }
}

export const exibir = async ({ commit }, id) => {
  try {
    const res = await axios.get('/usuario/' + id)

    return res.data
  } catch (error) {
    return error
  }
}

export const excluir = async ({ commit }, id) => {
  try {
    const res = await axios.delete('/usuario/' + id)

    return res.data
  } catch (error) {
    return error
  }
}

export const salvar = async ({ commit }, dados) => {
  try {
    const res = await axios.post('/usuario', dados)

    return res.data
  } catch (error) {
    return error
  }
}

export const editar = async ({ commit }, dados) => {
  try {
    const res = await axios.put('/usuario', dados)

    return res.data
  } catch (error) {
    return error
  }
}
