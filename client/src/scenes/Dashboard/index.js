import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'
import { Grid, Row, Col } from 'react-flexbox-grid'

import { 
    saveActiveUsers, 
    addActiveUser, 
    userLogout 
} from '../../actions/userActions'
import { saveMessage } from '../../actions/messageActions'
 
import { 
    subscribeToNewUser, 
    subscribeToUserLogOut,
    subscribeToAllUsers,
    subscribeToMessage,
    subscribeToInvitation,
    emitInvitation,
} from '../../socket'

import ActiveUserList from './components/ActiveUserList/ActiveUserList'
import Chat from './components/Chat/Chat'
import FormHOC from './components/FormHOC/FormHOC'
import NotificationDialog from './components/NotificationDialog/NotificationDialog';

const styles = {
    dashboard: {
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        height: '100vh'
    }
}

class Dashboard extends Component {

    constructor(props) {
        super(props)

        this.state = {
            playNotifOpen: false
        }

        subscribeToNewUser((err, user) => {
            this.props.addActiveUser(user)
        })

        subscribeToUserLogOut((err, id) => {
            this.props.userLogout(id)
        })

        subscribeToAllUsers((err, users) => {
            this.props.saveActiveUsers(users)
        })

        subscribeToMessage((err, message) => {
            this.props.saveMessage(message)
        })

        subscribeToInvitation((err, invitation) => {
            console.log(invitation, 'tou received invitation from ')
            this.handleOpen(`${invitation.username} offered to play`)
        })

        this.emitInvitation = this.emitInvitation.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleOpen = this.handleOpen.bind(this)
    }

    handleOpen(message) {
        this.setState({ 
            playNotifOpen: true,
            notifContext: message 
        })
    }

    handleClose() {
        this.setState({ playNotifOpen: false })
    }

    emitInvitation(id, username) {
        emitInvitation({ 
            id, 
            username,
            from: this.props.username  
        })
    }

    render() {
        let { classes } = this.props

        return (
            <div className={classes.dashboard}>
                <Grid>
                    <Col xs={12}>
                        <Row center="xs" >
                            <Col xs={3}>
                                <ActiveUserList 
                                    emitInvitation={this.emitInvitation} 
                                    users={this.props.activeUsers} 
                                />
                            </Col>
                            <Col xs={8}>
                                <Chat />
                            </Col>
                        </Row>
                        <NotificationDialog 
                            open={this.state.playNotifOpen}
                            handleClose={this.handleClose} 
                            handleOpen={this.handleOpen} 
                            context={this.state.notifContext}
                        /> 
                    </Col> 
                </Grid>
            </div>
        );
    }
}

const mstp = ({ username, activeUsers }) => ({
    username,
    activeUsers
})

const mdtp = dispatch => ({
    saveActiveUsers: (users) => dispatch(saveActiveUsers(users)),
    addActiveUser: (user) => dispatch(addActiveUser(user)),
    userLogout: (id) => dispatch(userLogout(id)),
    saveMessage: message => dispatch(saveMessage(message))
})

Dashboard = withStyles(styles)(Dashboard)

export default connect(mstp, mdtp)(FormHOC(Dashboard))
