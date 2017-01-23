import {mapGetters, mapActions} from 'vuex'

export default {
  computed: mapGetters({
    sessionUser: 'sessionUser'
  }),
  mounted () {
    this.getCurrentUser()
  },
  methods: mapActions([
    'getCurrentUser'
  ])
}
