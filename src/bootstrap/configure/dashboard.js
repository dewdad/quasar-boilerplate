import { get } from 'lodash'
import store from 'genesis/infra/store/index'
import menu from 'src/bootstrap/menus/drawer'
import options from 'src/bootstrap/menus/options'
import configurePath from 'src/bootstrap/configure/path'

export default ($component) => {
  const items = menu(configurePath)
  if (!Array.isArray(items)) {
    return false
  }
  const drawer = items.reduce(reduce, [])
  store.dispatch('setAppMenu', drawer)
  store.dispatch('setDashboardOptions', options())
}

/**
 * @param {Array} accumulate
 * @param {Object} menu
 * @returns {Array}
 */
const reduce = (accumulate, menu) => {
  const user = store.getters.getAuthUser
  if (menu.children) {
    menu.children = menu.children.reduce(reduce, [])
  }
  if (!menu.namespace) {
    accumulate.push(menu)
  }
  else if (get(user.permissions, menu.namespace, false)) {
    accumulate.push(menu)
  }
  return accumulate
}
