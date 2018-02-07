import axios from 'axios'

export const saveUsername = ({ username }) => dispatch => 
    axios
        .post('http://localhost:3300/api/username/save', { username })
        .then(result => {
            dispatch(createUser(username))
        })
        .catch(err => console.log(err))
    
export const createUser = username => ({
    type: 'SAVE_USERNAME',
    payload: { username }
})
