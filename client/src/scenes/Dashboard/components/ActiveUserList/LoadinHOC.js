import React, { Component } from 'react'
import { CircularProgress } from 'material-ui/Progress'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
    progress: {
      margin: `0 ${theme.spacing.unit * 2}px`,
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    },
    loader: {
        height: '90vh',
        backgroundColor: '#ffffff',
        'position': 'relative'
    }
})
  

const LoadingHOC = WrappedComponent => {
    
    class LoadingHOC extends Component {
        render() {
            let { users, classes } = this.props;
            
            if (!users) 
                return (<div className={classes.loader}>
                    <CircularProgress className={classes.progress} size={50} />
                </div>)
            
            return (
                <WrappedComponent {...this.props} />
            )
        }
    }

    return withStyles(styles)(LoadingHOC)
}

export default LoadingHOC