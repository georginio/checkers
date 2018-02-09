import { Grid, Col, Row } from 'react-flexbox-grid'
import React, { Component } from 'react'

import Form from '../Form'

const styles = {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    height: '100vh',
}

const FormHOC = WrappedComponent =>
    class FormHOC extends Component {
        render () {
            let { username } = this.props

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

export default FormHOC
