import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { withStyles } from 'material-ui/styles'
import { connect } from 'react-redux'
import { reset } from 'redux-form'

import MessageList from './components/MessageList'
import MessageForm from './components/MessageForm'

import { emitMessage } from '../../../../socket'

import { saveMessage } from '../../../../actions/messageActions'

const styles = {
    root: {
        height: '90vh',
        backgroundColor: '#ffffff',
        margin: '30px 0',
        display: 'flex',
        flexDirection: 'column'
    }
}

class Chat extends Component {

    constructor(props) {
        super(props)

        this.submitMessage = this.submitMessage.bind(this)
    }

    submitMessage ({ message }) {
        
        let msg = {
            username: this.props.username,
            text: message
        }

        // emit socket event
        emitMessage(msg)
        // add message to reducer
        this.props.saveMessage(msg)
        this.props.resetForm()
        
    }

    componentDidUpdate() {
        let dom = ReactDOM.findDOMNode(this.refs.msgHistory)
        dom.scrollTop = dom.scrollHeight;
    }

    render() {
        let { classes } = this.props

        return (
            <div className={classes.root}>
                <MessageList ref="msgHistory" messages={this.props.messages} />
                <MessageForm onSubmit={this.submitMessage} />
            </div>
        );
    }
}

const mstp = state => ({
    username: state.username,
    messages: state.messages
}) 

const mdtp = dispatch => ({
    saveMessage: message => dispatch(saveMessage(message)),
    resetForm: () => dispatch(reset('messageForm'))
})

export default connect(mstp, mdtp)(withStyles(styles)(Chat))
