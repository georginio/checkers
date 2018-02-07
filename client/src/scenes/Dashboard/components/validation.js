import axios from 'axios'

export const asyncValidate = values => 
    axios
        .post('http://localhost:3300/api/username/check', { username: values.username })
        .then(result => {
            if (result.data.exists)
                // eslint-disable-next-line
                throw { username: 'Username is taken!' }
        })

export const validate = values => {

    const errors = {}

    if (!values.username)
        errors.username = "Username is required!"

    return errors

}