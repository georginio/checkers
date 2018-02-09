import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'
import { Grid, Row, Col } from 'react-flexbox-grid'

import { 
    saveActiveUsers, 
    addActiveUser, 
    userLogout 
} from '../../actions/userActions'
import { 
    subscribeToNewUser, 
    subscribeToUserLogOut,
    subscribeToAllUsers 
} from '../../socket'

import ActiveUserList from './components/ActiveUserList/ActiveUserList'
import FormHOC from './components/FormHOC/FormHOC'

const styles = {
    dashboard: {
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        height: '100vh'
    },
    content: {
        margin: '30px 0'
    }
}

class Dashboard extends Component {

    constructor(props) {
        super(props)

        subscribeToNewUser((err, user) => {
            this.props.addActiveUser(user)
        })

        subscribeToUserLogOut((err, id) => {
            this.props.userLogout(id)
        })

        subscribeToAllUsers((err, users) => {
            this.props.saveActiveUsers(users)
        })
    }

    componentDidMount() {
        let { activeUsers } = this.props

    }

    render() {
        let { classes } = this.props

        return (
            <div className={classes.dashboard}>
                <Grid>
                    <Row middle="xs" center="xs">
                        <Col stylee={classes.content} xs={12}>
                            <Col xs={4}>
                                <ActiveUserList users={this.props.activeUsers} />
                            </Col>
                        </Col> 
                    </Row> 
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
    userLogout: (id) => dispatch(userLogout(id))
})

Dashboard = withStyles(styles)(Dashboard)

export default connect(mstp, mdtp)(FormHOC(Dashboard))
