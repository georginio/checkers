import { Grid, Col, Row } from 'react-flexbox-grid'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import Form from '../Form'

const styles = {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    height: '100vh',
}

function FormHOC (WrappedComponent) {
    
    return class FormHOC extends Component {
        constructor(props) {
            super(props)
        }
        render () {
            let { classes, username } = this.props; 

            if (!username)
                return (
                    <div style={styles}>
                        <Grid>
                            <Row middle="xs" center="xs">
                                <Col xs={6}>
                                    <Form {...this.props} /> 
                                </Col>
                            </Row>
                        </Grid>
                    </div>
                )

            return (<WrappedComponent {...this.props} />)
        }
    }
}

export default FormHOC

