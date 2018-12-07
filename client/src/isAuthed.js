export default () => {
    const username = window.localStorage.getItem('username')
    return username && username.trim()
}
