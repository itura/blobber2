import { init } from './server'

const server = init(console.log)

server.listen(5000, () => {
  console.log('listening on *:5000')
})
