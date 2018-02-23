import React from 'react'
import TextField from 'material-ui/TextField'

export default ({ 
        input, 
        label, 
        meta: { touched, dirty, error, invalid }, 
        ...rest
    }) =>
        <TextField 
            fullWidth
            label={label}
            error={(touched || dirty) && invalid}
            helperText={(touched || dirty) && error}
            {...input}
            {...rest}
        />
