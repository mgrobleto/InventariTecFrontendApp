import { Component, EventEmitter, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'confirmation-dialog',
    templateUrl: './confirmation-dialog.html',
    styleUrls: ['./confirmation-dialog.scss'],
})

export class ConfirmationDialog implements OnInit {

    message: string = "Esta seguro?"
    confirmButtonText = 'Sí'
    cancelButtonText = 'Cancelar'
    details:any = {};
    onEmitStatusChange = new EventEmitter();

    constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any) {}

    ngOnInit(): void {
        if(this.dialogData && this.dialogData.confirmation){
            this.details = this.dialogData;
        }
    }

    handleChangeAction(): void {
        this.onEmitStatusChange.emit();
    }
}
