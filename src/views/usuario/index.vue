<template>
  <v-container
    class="ma-0 pa-0"
    fluid
  >
    <!-- Componente de loading -->
    <loading :value="loading" />

    <!-- Componente de notificação -->
    <notificacao
      v-model="notificacao.value"
      :color="notificacao.color"
      :text="notificacao.text"
    />

    <!-- TODO: Titulo da página -->
    <v-row dense>
      <v-col
        cols="12"
        class="grey lighten-3"
      >
        <span class="title ml-4">
          Usuarios |
        </span>
        Listagem e manutenção de usuários
      </v-col>
    </v-row>

    <!-- TODO: Filtro -->
    <v-row
      v-if="!exibirFormulario"
      class="mt-4 mx-2"
      dense
    >
      <v-col cols="12">
        <v-card>
          <v-card-title class="py-1">
            Filtro
            <v-spacer />
            <v-btn
              color="primary"
              small
              text
              @click="controle.inserir = true, exibirFormulario = true"
            >
              <v-icon left>
                mdi-plus
              </v-icon>
              Adicionar
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              clearable
              dense
              hide-details
              label="Pesquise por qualquer valor"
              outlined
              single-line
              @click:append="listarRegistros()"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- TODO: Listagem -->
    <v-row
      v-if="!exibirFormulario"
      class="mt-2 mx-2"
      dense
    >
      <v-col cols="12">
        <v-data-table
          :headers="colunas"
          :items="registros"
          :search="search"
          class="elevation-1"
          dense
          item-key="id"
        >
          <template v-slot:top>
            <span class="pa-3">
              Listagem dos registros
            </span>
          </template>
          <template v-slot:[`item.acao`]="{ item }">
            <v-icon
              color="primary"
              @click="exibirRegistro(item.id)"
            >
              mdi-eye
            </v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <!-- TODO: Formulario -->
    <v-row
      v-if="exibirFormulario"
      class="mt-2 mx-2"
      dense
    >
      <v-col cols="12">
        <v-card
          dense
        >
          <v-card-title class="py-1">
            {{ controle.inserir ? "Inserir" : "Alterar" }} Usuario
            <v-spacer />
            <v-icon
              color="error"
              @click="excluirRegistro()"
            >
              mdi-trash-can
            </v-icon>
          </v-card-title>
          <v-divider />

          <v-card-text class="pa-2">
            <v-form
              class="pa-0"
              autocomplete="off"
            >
              <validation-observer ref="observer">
                <v-row
                  class="pa-2 mx-0"
                  dense
                >
                  <v-col
                    cols="12"
                    lg="1"
                    md="1"
                    xs="12"
                  >
                    <validation-provider
                      v-slot="{ errors }"
                      name="Id"
                      vid="id"
                    >
                      <v-text-field
                        v-model="formulario.id"
                        :error-messages="errors"
                        :hide-details="!errors.length"
                        disabled
                        dense
                        label="Id"
                        outlined
                      />
                    </validation-provider>
                  </v-col>
                  <v-col
                    cols="12"
                    lg="3"
                    md="3"
                    xs="12"
                  >
                    <validation-provider
                      v-slot="{ errors }"
                      name="Nome"
                      rules="required"
                      vid="nome"
                    >
                      <v-text-field
                        v-model="formulario.nome"
                        :error-messages="errors"
                        :hide-details="!errors.length"
                        :disabled="controle.visualizar"
                        dense
                        label="Nome"
                        outlined
                      />
                    </validation-provider>
                  </v-col>
                  <v-col
                    cols="12"
                    lg="3"
                    md="3"
                    xs="12"
                  >
                    <validation-provider
                      v-slot="{ errors }"
                      name="Email"
                      rules="required"
                      vid="email"
                    >
                      <v-text-field
                        v-model.number="formulario.email"
                        :error-messages="errors"
                        :hide-details="!errors.length"
                        :disabled="controle.visualizar"
                        dense
                        label="Email"
                        outlined
                      />
                    </validation-provider>
                  </v-col>
                  <v-col
                    cols="12"
                    lg="5"
                    md="5"
                    xs="12"
                  >
                    <validation-provider
                      v-slot="{ errors }"
                      name="Senha"
                      rules="required"
                      vid="senha"
                    >
                      <v-text-field
                        v-model.number="formulario.senha"
                        :error-messages="errors"
                        :hide-details="!errors.length"
                        :disabled="controle.visualizar"
                        clearable
                        dense
                        label="Senha"
                        outlined
                      />
                    </validation-provider>
                  </v-col>
                </v-row>
              </validation-observer>
            </v-form>
          </v-card-text>
          <v-divider />

          <v-card-actions>
            <v-btn
              v-if="(!controle.inserir || controle.visualizar) && !controle.editar"
              color="primary"
              @click="controle.editar = true, controle.visualizar = false"
            >
              <v-icon>
                mdi-pencil
              </v-icon>
              Editar
            </v-btn>
            <v-btn
              v-if="(controle.editar || controle.inserir) && !controle.visualizar"
              color="primary"
              @click="salvarRegistro()"
            >
              <v-icon>
                mdi-content-save
              </v-icon>
              Salvar
            </v-btn>
            <v-btn
              color="error"
              @click="resetFormulario()"
            >
              <v-icon>
                mdi-cancel
              </v-icon>
              Cancelar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import loading from '../../components/loading.vue'

export default {
  components: { loading },

  name: 'PaginaCadastroDeUsuarios',

  /**
   * @descricao data é onde declaramos as variaveis que serão utilizadas dentro do componente
   */
  data: () => ({
    colunas: [
      {
        text: 'Ação',
        align: 'center',
        sortable: false,
        value: 'acao',
        width: 50
      },
      {
        text: 'Id',
        align: 'center',
        sortable: true,
        value: 'id',
        width: 100
      },
      {
        text: 'Nome',
        align: 'start',
        sortable: true,
        value: 'nome',
        width: 200
      },
      {
        text: 'Email',
        align: 'end',
        sortable: true,
        value: 'email',
        width: 150
      },
      {
        text: 'Senha',
        align: 'start',
        sortable: true,
        value: 'senha',
        width: 150
      },
      {}
    ],
    controle: {
      inserir: false,
      editar: false,
      visualizar: false
    },
    exibirFormulario: false,
    loading: false,
    notificacao: {
      value: false,
      text: '',
      color: 'primary'
    },
    formulario: {
      id: null,
      nome: null,
      email: null,
      senha: null
    },
    search: ''
  }),

  /**
   * @descricao created() é um ciclo de vida do vue, ele e executado depois da criação dos elementos html da pagina
   * - Chamamos o listar registros ao abrir a pagina aqui.
   */
  created () {
    this.listarRegistros()
  },

  computed: {
    /**
     * ...mapState acessa variaveis declaradas no STATE.JS do modulo registrado como paginaCadastroUsuario
     */
    ...mapState('paginaCadastroUsuario', [
      'registros'
    ])
  },

  methods: {
    /**
     * ...mapActions acessa o modulo registrado permitindo a chamada das funções das ACTIONS.JS exportadas
     */
    ...mapActions('paginaCadastroUsuario', [
      'listar',
      'exibir',
      'excluir',
      'editar',
      'salvar'
    ]),

    /**
     * @descricao Função que chama a rota de listagem de registros
     */
    async listarRegistros () {
      this.loading = true
      const res = await this.listar()
      if (res && res.message) {
        this.notificacao = {
          value: true,
          text: JSON.stringify(res.message),
          color: 'error'
        }
      }
      this.loading = false
    },

    /**
     * - Seta o loading para true
     * - Chama a rota de exibição
     * - Caso possuir retorno e o retorno nao for um erro (res.erro) insere o resultado no objeto do formulario
     * - Seta o loading para falso
     * - Chama a variavel que controla a exibição do formulario para true
     * - Informa a variavel de controle do estado do formulario que controle.visualizar = true
     *
     * @descricao Com isso o formulario será carregado em modo de exibição
     */
    async exibirRegistro (id) {
      this.loading = true
      const res = await this.exibir(id)

      if (res && !res.erro) {
        this.formulario = {
          id: res.id || null,
          nome: res.nome || null,
          email: res.email || null,
          senha: res.senha || null
        }
      }

      this.loading = false
      this.exibirFormulario = true
      this.controle.visualizar = true
    },

    /**
     * - Seta o loading para true
     * - Chama a rota de exclusão passando o id do formulario
     * - Caso possuir retorno e o retorno nao for um erro (res.erro) reseta o formulario e volta para a listagem
     * - Seta o loading para falso
     *
     * @descricao Com isso o formulario será carregado em modo de exibição
     */
    async excluirRegistro () {
      this.loading = true
      const res = await this.excluir(this.formulario.id)

      if (res && !res.erro) {
        this.resetFormulario()
        this.listarRegistros()
      }

      this.loading = false
    },

    /**
     * - Valida se os campos foram preenchidos com o Validate
     * - Seta o loading para sinalizar inicio da transação
     * - Formata em uma variavel auxiliar form se os dados do formulario
     * - Verifica se possuir ID chama a rota editar
     * - Verifica se não possuir chama a rota inserir
     * - Verifica o retorno gravado na variável res
     * - Se RES possuir alguma coisa e nao for res.erro reseta o formulario e volta para a listagem
     * - Se res.erro form um objeto de erro, chama a notificação e seta os erros no validate.observer
     * - Seta o loading para falso sinalizando que terminou a função
     *
     * @descricao Função destinada a editar ou salvar um registro
     */
    async salvarRegistro () {
      if (await this.$refs.observer.validate()) {
        this.loading = true

        const form = {
          id: this.formulario.id || null,
          nome: this.formulario.nome || null,
          email: this.formulario.email || null,
          senha: this.formulario.senha || null
        }
        let res

        if (form.id) res = await this.editar(form)
        else if (!form.id) res = await this.salvar(form)

        if (res && !res.erro) {
          this.resetFormulario()
          this.listarRegistros()
        } else if (res && typeof res.erro === 'object') {
          this.notificacao = {
            value: true,
            text: res.erro,
            color: 'error'
          }
          this.$refs.observer.setErrors(res.erro)
        }

        this.loading = false
      }
    },

    /**
     * - Reseta as validações do validate observer se tiver
     * - Reseta a variavel de exibição do formulario para false
     * - Reseta o objeto do formulario para limpar as imformações
     * - Reseta o objeto de controle utilizado para dizer qual o estado do formulario.
     *
     * @description Função destinada a resetar variaveis e o estado do formulário
     */
    resetFormulario () {
      if (this.$refs.observer) this.$refs.observer.reset()
      this.exibirFormulario = false
      this.formulario = {
        id: null,
        nome: null,
        email: null,
        senha: null
      }
      this.controle = {
        inserir: false,
        editar: false,
        visualizar: false
      }
    }
  }
}
</script>
