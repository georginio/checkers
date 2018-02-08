import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'

import { withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'
import RenderedTextField from './RenderedTextField'

import { asyncValidate, validate } from './validation'
import { saveUsername } from '../../../actions/userActions'

const styles = {
    button: {
        marginTop: '5px'
    },
    form: {
        backgroundColor: '#ffffff',
        padding: '10px',
        marginTop: '100px',
        boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 45px, rgba(0, 0, 0, 0.22) 0px 10px 18px'
    }
} 

class Form extends Component {
    render () {
        
        let { 
            handleSubmit, 
            classes, 
            pristine, 
            submitting, 
            invalid, 
            saveUsername 
        } = this.props
        
        return (
            <form onSubmit={handleSubmit(saveUsername)} name="usernameForm" className={classes.form}>
                <h3>Please type your Username!</h3>
                <Field name="username" label="Username" component={RenderedTextField} />
                <Button 
                    type="submit"
                    className={classes.button} 
                    fullWidth 
                    variant="raised" 
                    color="primary" 
                    disabled={ pristine || submitting || invalid }
                >Submit</Button>
            </form>
        )
    }
}

const dispatchToProps = dispatch => ({
    saveUsername: values => dispatch(saveUsername(values))
})

Form = withStyles(styles)(Form)
Form = reduxForm({
    form: 'usernameForm',
    validate,
    asyncValidate
})(Form)

export default connect(null, dispatchToProps)(Form) 
