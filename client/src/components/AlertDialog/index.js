import React from 'react'
import { withStyles } from 'material-ui/styles'
import Dialog, { DialogTitle } from 'material-ui/Dialog'

const styles = {
    root: {
        minWidth: '300px',
        textAlign: 'center'
    }
}

const AlertDialog = ({ open, handleClose, content }) =>
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">{content}</DialogTitle>
    </Dialog>

export default withStyles(styles)(AlertDialog)
