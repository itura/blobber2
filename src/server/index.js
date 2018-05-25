import { map } from 'rxjs/operators'
import { createServer } from './server'
import { createDb } from './db'

createDb('postgres://blobber@localhost:5432/blobber')
  .pipe(
    map(db => createServer(console.log, db))
  )
  .subscribe(server => {
    server.listen(5000, () => {
      console.log('listening on *:5000')
    })
  })
