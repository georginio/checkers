import React from 'react'
import { Field, reduxForm } from 'redux-form'
import Button from 'material-ui/Button'
import { withStyles } from 'material-ui/styles'

import RenderedTextField from '../../RenderedTextField'

import { messageValidate } from '../../validation'

const styles = {
    form: {
        display: 'flex',
        justifyContent: 'space-around',
        padding: '5px'
    },
    button: {
        margin: '4px 0 0 5px'
    }
} 

let MessageForm = 
    ({ 
        handleSubmit, 
        pristine, 
        submitting, 
        invalid,
        classes,
        onSubmit  
    }) => 
        <form className={classes.form} name="messageForm" onSubmit={handleSubmit(onSubmit)}>
            <Field name="message" label="message" component={RenderedTextField} />
            <Button 
                className={classes.button}
                type="submit"
                variant="raised" 
                color="primary" 
                disabled={ pristine || submitting || invalid }
            >Submit</Button>
        </form>

export default withStyles(styles)(reduxForm({
    form: 'messageForm',
    validate: messageValidate
})(MessageForm))
