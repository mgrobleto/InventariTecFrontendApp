import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface SessionTimeoutDialogData {
    warningDurationMs: number;
}

@Component({
    selector: 'app-session-timeout-dialog',
    templateUrl: './session-timeout-dialog.component.html',
    styleUrls: ['./session-timeout-dialog.component.scss']
})
export class SessionTimeoutDialogComponent implements OnInit, OnDestroy {

    remainingSeconds: number;
    private countdownInterval: any = null;

    constructor(
        private dialogRef: MatDialogRef<SessionTimeoutDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: SessionTimeoutDialogData
    ) {
        this.remainingSeconds = Math.floor(data.warningDurationMs / 1000);
    }

    ngOnInit(): void {
        this.startCountdown();
    }

    ngOnDestroy(): void {
        this.clearCountdown();
    }

    get formattedTime(): string {
        const minutes = Math.floor(this.remainingSeconds / 60);
        const seconds = this.remainingSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    get progressValue(): number {
        const total = Math.floor(this.data.warningDurationMs / 1000);
        return (this.remainingSeconds / total) * 100;
    }

    onContinue(): void {
        this.clearCountdown();
        this.dialogRef.close('continue');
    }

    onLogout(): void {
        this.clearCountdown();
        this.dialogRef.close('logout');
    }

    private startCountdown(): void {
        this.countdownInterval = setInterval(() => {
            this.remainingSeconds--;
            if (this.remainingSeconds <= 0) {
                this.clearCountdown();
                // The SessionTimeoutService's warningTimer will handle the actual logout.
                // We close without an action so the service can act.
                this.dialogRef.close(null);
            }
        }, 1000);
    }

    private clearCountdown(): void {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
    }
}
