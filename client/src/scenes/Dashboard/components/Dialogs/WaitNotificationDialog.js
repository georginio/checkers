import React from 'react'
import { withStyles } from 'material-ui/styles';
import Dialog, {
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog'
import { LinearProgress } from 'material-ui/Progress';

const styles = {
    root: {
        minWidth: '350px'
    }
}

const WaitNotificationDialog = ({ classes, open, progress }) =>
    <Dialog
        open={open}
        disableBackdropClick={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">Invitation Sent</DialogTitle>
        <DialogContent className={classes.root}>
            <LinearProgress color="secondary" variant="determinate" value={progress} />
        </DialogContent>
    </Dialog>

export default withStyles(styles)(WaitNotificationDialog)
