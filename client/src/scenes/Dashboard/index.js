import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'
import { Grid, Row, Col } from 'react-flexbox-grid'

import { fetchActiveUsers } from '../../actions/userActions'

import Form from './components/Form'
import ActiveUserList from './components/ActiveUserList/ActiveUserList'

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

    componentDidMount() {
        let { activeUsers } = this.props

        if (!activeUsers)
            this.props.fetchActiveUsers()
    }

    render() {
        let { classes, username } = this.props

        let bgStyle = {
           backgroundColor: username ? '#e6e6e6' : ''
        }    

        return (
            <div className={classes.dashboard} style={bgStyle}>
                <Grid>
                    <Row middle="xs" center="xs">
                    { !username ? 
                            <Col xs={6}>
                                <Form />
                            </Col>
                        :   
                            <Col className={classes.content} xs={12}>
                                <Col xs={4}>
                                    <ActiveUserList users={this.props.activeUsers} />
                                </Col>
                                <Col xs={8}>
                                    {/* there will be chat for everyoneee <ActiveUserList /> */}
                                </Col>
                            </Col> 
                    }
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
    fetchActiveUsers: () => dispatch(fetchActiveUsers())
})

export default  connect(mstp, mdtp)(
    withStyles(styles)(Dashboard)
)
