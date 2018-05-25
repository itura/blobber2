import { Sequelize } from 'sequelize'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { combineLatest } from 'rxjs/observable/combineLatest'

export function createDb (url) {
  const db = new Sequelize(url)

  const _Boop = db.define('Boop', {
    name: {
      type: Sequelize.STRING
    }
  }, {
    getterMethods: {
      name () {
        return this.getDataValue('name')
      }
    },

    setterMethods: {
      // Ex:
      // fullName(value) {
      //   const names = value.split(' ');
      //
      //   this.setDataValue('firstname', names.slice(0, -1).join(' '));
      //   this.setDataValue('lastname', names.slice(-1).join(' '));
      // },
    }
  })

  const Boop$ = fromPromise(_Boop.sync())

  return combineLatest(Boop$,
    (Boop) => {
      return {Boop}
    })
}
