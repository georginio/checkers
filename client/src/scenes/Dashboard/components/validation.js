import axios from 'axios'

let URL = ''
if (process.env.NODE_ENV !== 'production') {
    URL = `http://localhost:${PORT}`
}

export const asyncValidate = values => 
    axios
        .post(`${URL}/api/username/check`, { username: values.username })
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
