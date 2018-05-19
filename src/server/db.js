import { Sequelize } from 'sequelize'

export function createDb (url) {
  const db = new Sequelize(url)

  const Boop = db.define('Boop', {
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

  return {Boop}
}
