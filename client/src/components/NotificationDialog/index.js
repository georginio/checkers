import React from 'react'
import Button from 'material-ui/Button'
import { withStyles } from 'material-ui/styles'
import Dialog, {
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle
} from 'material-ui/Dialog'
import { LinearProgress } from 'material-ui/Progress'

const styles = {
    root: {
        minWidth: '350px'
    }
}

const NotificationDialog = ({ 
        classes, 
        open, 
        handleClose, 
        accept, 
        decline, 
        context, 
        title = "Play Offer",
        progress 
    }) => 
        <Dialog
            open={open}
            onClose={handleClose}
            disableBackdropClick={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent className={classes.root}>
                <DialogContentText id="alert-dialog-description">
                    {context}
                </DialogContentText>
                <LinearProgress color="secondary" variant="determinate" value={progress} />
            </DialogContent>
            <DialogActions>
                <Button 
                    variant="raised" 
                    color="secondary"
                    onClick={decline}
                >
                    Cancel
                </Button>
                <Button 
                    variant="raised" 
                    color="primary" 
                    onClick={accept} 
                    autoFocus
                >
                    Accept
                </Button>
            </DialogActions>
        </Dialog>

export default withStyles(styles)(NotificationDialog)
