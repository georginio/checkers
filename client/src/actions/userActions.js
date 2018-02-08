import axios from 'axios'

export const saveUsername = ({ username }) => dispatch => 
    axios
        .post('http://localhost:3300/api/username/save', { username })
        .then(result => {
            dispatch(createUser(username))
        })
        .catch(err => console.log(err))

export const fetchActiveUsers = () => dispatch =>
    axios   
        .get('http://localhost:3300/api/users/all')
        .then(({data}) => {
            dispatch(saveActiveUsers(data.users))
        })
        .catch(err => console.log(err))
    
export const addActiveUser = username => ({
    type: 'ADD_ACTIVE_USER',
    payload: username
})

export const createUser = username => ({
    type: 'SAVE_USERNAME',
    payload: { username }
})

export const saveActiveUsers = users => ({
    type: 'POPULATE_USERS',
    payload: users
})
