const SESSION_CHANGE = 'SESSION_CHANGE'
const SESSION_SIGNIN_STATE = 'SESSION_SIGNIN_STATE'

const state = {
  sessionUser: null,
  sessionSignInState: -1
}

const mutations = {
  [SESSION_CHANGE] (state, {sessionUser}) {
    state.sessionUser = sessionUser
  },
  [SESSION_SIGNIN_STATE] (state, {status}) {
    state.sessionSignInState = status
  }
}

const actions = {
  getCurrentUser ({commit}) {
    let sessionUser = Parse.User.current()
    commit(SESSION_CHANGE, {
      sessionUser: sessionUser || null
    })
  },
  signIn ({commit}, {username, password}) {
    commit(SESSION_SIGNIN_STATE, {
      status: -1
    })
    Parse.User.logIn(username, password).then((loginedUser) => {
      commit(SESSION_SIGNIN_STATE, {
        status: 0
      })
      commit(SESSION_CHANGE, {
        sessionUser: loginedUser || null
      })
    }, function (error) {
      commit(SESSION_SIGNIN_STATE, {
        status: 1
      })
    })
  },
  signOut ({commit}) {
    Parse.User.logOut()
    commit(SESSION_CHANGE, {
      sessionUser: null
    })
  }
}

const getters = {
  sessionUser: state => state.sessionUser,
  sessionSignInState: state => state.sessionSignInState
}

export default {
  state,
  getters,
  mutations,
  actions
}
