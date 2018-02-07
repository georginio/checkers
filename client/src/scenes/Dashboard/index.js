import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'
import { Grid, Row, Col } from 'react-flexbox-grid'

import Form from './components/Form'

const styles = {
    dashboard: {
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        height: '100vh'
    }
}

class Dashboard extends Component {

    render() {
        let { classes, username } = this.props;

        let bgStyle = {
           backgroundColor: username ? '#ffffff' : ''
        }    

        return (
            <div className={classes.dashboard} style={bgStyle}>
                <Grid>
                    <Row middle="xs" center="xs">
                        <Col xs={6}>
                            { !username ? <Form /> : null }
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

const mstp = ({ user }) => ({
    username: user.username
})

export default  connect(mstp)(withStyles(styles)(Dashboard))
