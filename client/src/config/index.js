const ENV = process.env.NODE_ENV

export default {
  ROOT_URL: ENV === 'production' ? '/' : 'http://localhost:3300',
  SOCKET_URL: ENV === 'production' ? 'https://reactcheckers.herokuapp.com' : 'http://localhost:3300'
}
