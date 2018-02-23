export default () => {
    let username = window.localStorage.getItem('username')
    return username && username.trim()
}
