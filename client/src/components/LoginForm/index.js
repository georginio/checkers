import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import { withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'
import Input from '../Input'

import { asyncValidate, validate } from './validation'
import { saveUsername } from '../../actions/userActions'

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

class LoginForm extends Component {

    constructor(props) {
        super(props)

        this.submitUsername = this.submitUsername.bind(this)
    }

    submitUsername(values) {
        this.props.saveUsername(values.username)
        window.localStorage.setItem('username', values.username)
    }

    render () {
        
        const { 
            handleSubmit, 
            classes, 
            pristine, 
            submitting, 
            invalid, 
        } = this.props
        
        return (
            <form onSubmit={handleSubmit(this.submitUsername)} name="usernameForm" className={classes.form}>
                <h3>Please type your Username!</h3>
                <Field name="username" label="Username" component={Input} />
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
    saveUsername: username => dispatch(saveUsername(username))
})

export default compose(
    connect(null, dispatchToProps),
    reduxForm({
        form: 'usernameForm',
        validate,
        asyncValidate
    }),
    withStyles(styles)
)(LoginForm)
