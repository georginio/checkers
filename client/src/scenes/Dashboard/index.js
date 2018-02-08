import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'
import { Grid, Row, Col } from 'react-flexbox-grid'

import { fetchActiveUsers, addActiveUser } from '../../actions/userActions'
import { emitNewUser, subscribeToNewUser } from '../../socket'

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

        subscribeToNewUser((err, username) => {
            this.props.addActiveUser(username)
        })
    }

    componentDidMount() {
        let { activeUsers, username } = this.props

        if (!activeUsers)
            this.props.fetchActiveUsers()
        
        if (username)
            emitNewUser(username)
    }

    render() {
        let { classes, username } = this.props

        return (
            <div className={classes.dashboard}>
                <Grid>
                    <Row middle="xs" center="xs">
                        <Col stylee={styles.content} xs={12}>
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
    fetchActiveUsers: () => dispatch(fetchActiveUsers()),
    addActiveUser: (username) => dispatch(addActiveUser(username))
})

Dashboard = withStyles(styles)(Dashboard)

export default connect(mstp, mdtp)(FormHOC(Dashboard))
