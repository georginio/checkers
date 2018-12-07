import axios from 'axios'
import config from '../../config'

export const asyncValidate = values => 
    axios
        .post(`${config.ROOT_URL}/api/username/check`, { username: values.username })
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
