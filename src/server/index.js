import { init } from './server'
import { createDb } from './db'

const db = createDb('postgres://blobber@localhost:5432/blobber')

const server = init(console.log, db)

server.listen(5000, () => {
  console.log('listening on *:5000')
})
