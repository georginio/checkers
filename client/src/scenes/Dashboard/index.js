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
    emitDeclineInvitation,
    subscribeToDeclinedInvitation
} from '../../socket'

import ActiveUserList from './components/ActiveUserList/ActiveUserList'
import Chat from './components/Chat/Chat'
import FormHOC from './components/FormHOC/FormHOC'
import NotificationDialog from './components/Dialogs/NotificationDialog';
import WaitNotificationDialog from './components/Dialogs/WaitNotificationDialog';
import AlertDialog from './components/Dialogs/AlertDialog';

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
            playNotifOpen: false,
            waitNotifOpen: false,
            alertOpen: false,
            progressCompleted: 0,
            alertContent: ''
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
            this.handleOpen(`${invitation.username} offered to play`)
            this.deliverer = invitation.deliverer;
        })

        subscribeToDeclinedInvitation((err, { username }) => {
            this.handleClose()
            this.setState({ 
                alertOpen: true,
                alertContent: `${username} declined your invitatio!` 
            })
        })

        this.emitInvitation = this.emitInvitation.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleOpen = this.handleOpen.bind(this)
        this.handleWaitOpen = this.handleWaitOpen.bind(this)
    }

    handleOpen(message) {
        this.setState({ 
            playNotifOpen: true,
            notifContext: message 
        })

        this.time = setInterval(this.progress, 500)
    }

    handleWaitOpen() {
        this.setState({ 
            waitNotifOpen: true,
            progressCompleted: 0 
        })

        this.time = setInterval(this.progress, 500)
    }

    handleClose() {
        this.setState({ 
            playNotifOpen: false,
            waitNotifOpen: false,
            alertOpen: false,
            progressCompleted: 0 
        })

        clearInterval(this.time)
    }

    emitInvitation(id, username) {
        emitInvitation({ 
            id, 
            username,
            from: this.props.username  
        })

        this.handleWaitOpen()
    }

    declineInvitation = () => {
        this.handleClose()
        emitDeclineInvitation({ 
            deliverer: this.deliverer,
            username: this.props.username 
        })
        this.deliverer = null
    }

    progress = () => {
        let { progressCompleted } = this.state

        if (progressCompleted === 100) 
            this.handleClose()
        else 
            this.setState({ progressCompleted: progressCompleted + 4 })
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
                            progress={this.state.progressCompleted}
                            declineInvitation={this.declineInvitation}
                        /> 
                        <WaitNotificationDialog 
                            progress={this.state.progressCompleted}
                            open={this.state.waitNotifOpen} 
                        />
                        <AlertDialog 
                            open={this.state.alertOpen}
                            content={this.state.alertContent}
                            handleClose={this.handleClose} 
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
