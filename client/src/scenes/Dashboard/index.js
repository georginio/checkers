import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'
import { Grid, Row, Col } from 'react-flexbox-grid'
import { withRouter } from 'react-router-dom'
import PowerSettingsNew from 'material-ui-icons/PowerSettingsNew'
import Button from 'material-ui/Button'

import { 
    saveActiveUsers, 
    addActiveUser,
    saveUsername, 
    userLogout,
} from '../../actions/userActions'
import { saveMessage } from '../../actions/messageActions'
import { setPlayOptions } from '../../actions/playActions'

import { 
    subscribeToNewUser, 
    subscribeToUserLogOut,
    subscribeToAllUsers,
    subscribeToMessage,
    subscribeToInvitation,
    subscribeToDeclinedInvitation,
    subscribeToAccpt,
    subscribeToGameStart,
    emitInvitation,
    emitDeclineInvitation,
    emitAccept,
    emitJoinRoom,
    emitNewUser
} from '../../socket'

import ActiveUserList from './components/ActiveUserList/ActiveUserList'
import Chat from './components/Chat/Chat'
import FormHOC from './components/FormHOC/FormHOC' 
import NotificationDialog from '../../components/Dialogs/NotificationDialog'
import WaitNotificationDialog from '../../components/Dialogs/WaitNotificationDialog'
import AlertDialog from '../../components/Dialogs/AlertDialog'

const styles = {
    dashboard: {
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        height: '100vh'
    },
    nav: {
        height: '70px',
        width: '100%',
        backgroundColor: '#ffffff',
        color: '#2196F3',
        display: 'flex',
        alignItems: "center",
        padding: "0 20px",
        textAlign: "left"
    },
    logout: {
        textAlign: "right"
    },
    button: {
        color: '#2196F3',
        fontWeight: "bold"
    },
    power: {
        marginLeft: '5px'
    },
    paddings: {
        "padding": "0 16px"
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
            if (this.props && this.props.activeUsers && user)
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
            this.handleOpen(`${invitation.from} offered to play`)
            this.deliverer = { 
                username: invitation.from,
                id: invitation.deliverer
            }
            this.props.setPlayOptions({
                opponent: {
                    username: invitation.from,
                    id: invitation.deliverer
                }
            })
        })

        subscribeToDeclinedInvitation((err, { username }) => {
            this.handleClose()
            this.setState({ 
                alertOpen: true,
                alertContent: `${username} declined your invitatio!` 
            })
        })

        subscribeToAccpt((err, { roomName, from, deliverer }) => {

            this.props.setPlayOptions({
                opponent: {
                    username: from,
                    id: deliverer
                }
            })
            emitJoinRoom({ roomName, username: this.props.username })
        })

        subscribeToGameStart((err, { roomName, secondPlayer }) => {
            let options = { roomName }

            if (secondPlayer === this.props.username) {
                options.side = 'Player 2'
                options.turn = 'Player 1'
            } else {
                options.side = 'Player 1'
                options.turn = 'Player 1'
            }

            this.props.setPlayOptions(options)
            this.props.history.push(`/game/${roomName}`)

        })

        this.emitInvitation = this.emitInvitation.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleOpen = this.handleOpen.bind(this)
        this.handleWaitOpen = this.handleWaitOpen.bind(this)
    }

    componentDidMount() {
        let username = this.props.username || window.localStorage.getItem('username')

        if (username) {
            emitNewUser(username)
            this.props.saveUsername(username)
        }
    }

    componentWillUnmount() {
        clearInterval(this.time)
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
            from: this.props.username  
        })

        this.handleWaitOpen()
    }

    declineInvitation = () => {
        this.handleClose()
        emitDeclineInvitation({ 
            deliverer: this.deliverer.id,
            username: this.props.username 
        })
        this.deliverer = null
    }

    acceptInvitation = () => {
        emitAccept({
            from: this.props.username,
            deliverer: this.deliverer
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
                    <Col xs={12} className={classes.paddings}>
                        <Row center="xs">
                            <nav className={classes.nav}>
                                <Col xs={2}>
                                    <h3>Checkers</h3>
                                </Col>
                                <Col xs={10}>
                                    <div className={classes.logout}>
                                        <Button className={classes.button} aria-label="Delete">
                                            Log out
                                            <PowerSettingsNew className={classes.power} />
                                        </Button>
                                    </div>
                                </Col>
                            </nav>
                        </Row>
                    </Col>
                </Grid>
                <Grid>
                    <Col xs={12}>
                        <Row center="xs" >
                            <Col xs={3}>
                                <ActiveUserList 
                                    emitInvitation={this.emitInvitation} 
                                    users={this.props.activeUsers} 
                                />
                            </Col>
                            <Col xs={9}>
                                <Chat />
                            </Col>
                        </Row>
                        <NotificationDialog 
                            open={this.state.playNotifOpen}
                            handleClose={this.handleClose} 
                            context={this.state.notifContext}
                            progress={this.state.progressCompleted}
                            accept={this.acceptInvitation}
                            decline={this.declineInvitation}
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
    saveActiveUsers: users => dispatch(saveActiveUsers(users)),
    addActiveUser: user => dispatch(addActiveUser(user)),
    userLogout: id => dispatch(userLogout(id)),
    saveMessage: message => dispatch(saveMessage(message)),
    setPlayOptions: side => dispatch(setPlayOptions(side)),
    saveUsername: username => dispatch(saveUsername(username))
})

Dashboard = withStyles(styles)(Dashboard)

export default connect(mstp, mdtp)(withRouter(FormHOC(Dashboard)))
