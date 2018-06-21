import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { withStyles } from 'material-ui/styles'
import { connect } from 'react-redux'
import { reset } from 'redux-form'

import MessageList from './components/MessageList'
import MessageForm from './components/MessageForm'

import { 
    emitMessage
} from '../../socket'

import { saveMessage, addToLastMessage } from '../../actions/messageActions'

const styles = {
    root: {
        height: '80vh',
        backgroundColor: '#ffffff',
        margin: '5px 0',
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
        const { messages } = this.props
        const lastIndex = messages.length - 1
        let msg = {
            username: this.props.username,
            text: message
        }

        // emit socket event
        emitMessage(msg, this.props.private)
        // add message to reducer
        if (lastIndex >= 0 && messages[lastIndex] && messages[lastIndex].username === msg.username) {
            this.props.resetForm()
            return this.props.addToLastMessage(msg)
        }

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
    messages: state.messages,
    play: state.play
}) 

const mdtp = dispatch => ({
    saveMessage: message => dispatch(saveMessage(message)),
    resetForm: () => dispatch(reset('messageForm')),
    addToLastMessage: message => dispatch(addToLastMessage(message))
})

export default connect(mstp, mdtp)(withStyles(styles)(Chat))
