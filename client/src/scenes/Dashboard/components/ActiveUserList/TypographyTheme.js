import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'

const styles = theme => {
  return {
    root: { ...theme.typography.button,  color: '#7986CB' }
  }
}

function TypographyTheme({ classes, value }) {
  return <div className={classes.root}>{value}</div>
}

TypographyTheme.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(TypographyTheme)
