import React from 'react'
import { Field, reduxForm } from 'redux-form'
import Button from 'material-ui/Button'
import { withStyles } from 'material-ui/styles'

import ChatIcon from 'material-ui-icons/Chat'
import Send from 'material-ui-icons/Send'

import RenderedTextField from '../../RenderedTextField'

const styles = theme => ({
    form: {
        display: 'flex',
        justifyContent: 'space-around',
        padding: '8px'
    },
    button: {
        margin: '8px 0 0 8px'
    },
    icon: {
        alignSelf: 'center',
        color: '#5C6BC0',
        margin: '8px 8px 0'
    }
}) 

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
            <div className={classes.icon}>
                <ChatIcon />
            </div>
            <Field name="message" label="message" component={RenderedTextField} />
            <Button 
                variant="fab" 
                color="primary" 
                type="submit"
                aria-label="edit" 
                className={classes.button}
                disabled={ pristine || submitting || invalid }
                >
                <Send />
            </Button>
        </form>

export default withStyles(styles)(reduxForm({
    form: 'messageForm',
})(MessageForm))
