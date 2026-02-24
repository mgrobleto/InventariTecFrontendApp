import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fromEvent, merge, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SessionTimeoutDialogComponent } from 'src/app/shared/components/session-timeout-dialog/session-timeout-dialog.component';
import { LoginService } from '../auth/services/login/login.service';

/** Time (ms) of inactivity before showing the warning dialog. Default: 15 minutes */
const IDLE_TIMEOUT_MS = 15 * 60 * 1000;

/** Time (ms) the warning dialog stays open before auto-logout. Default: 2 minutes */
const WARNING_TIMEOUT_MS = 2 * 60 * 1000;

@Injectable({
    providedIn: 'root'
})
export class SessionTimeoutService implements OnDestroy {

    private idleTimer: any = null;
    private warningTimer: any = null;
    private activitySubscription: Subscription | null = null;
    private dialogRef: MatDialogRef<SessionTimeoutDialogComponent> | null = null;
    private isWatching = false;

    constructor(
        private loginService: LoginService,
        private dialog: MatDialog,
        private ngZone: NgZone
    ) { }

    /**
     * Start tracking user activity. Call this after a successful login.
     */
    startWatching(): void {
        if (this.isWatching) return;
        this.isWatching = true;
        this.resetIdleTimer();
        this.listenToActivity();
    }

    /**
     * Stop tracking user activity. Call this after logout.
     */
    stopWatching(): void {
        this.isWatching = false;
        this.clearTimers();
        this.activitySubscription?.unsubscribe();
        this.activitySubscription = null;
        this.dialogRef?.close();
        this.dialogRef = null;
    }

    private listenToActivity(): void {
        const activityEvents$ = merge(
            fromEvent(document, 'mousemove'),
            fromEvent(document, 'keydown'),
            fromEvent(document, 'click'),
            fromEvent(document, 'touchstart'),
            fromEvent(document, 'scroll')
        ).pipe(debounceTime(300)); // Debounce to avoid firing too often

        this.activitySubscription = activityEvents$.subscribe(() => {
            // Only reset if no warning dialog is open
            if (!this.dialogRef) {
                this.resetIdleTimer();
            }
        });
    }

    private resetIdleTimer(): void {
        this.clearTimers();

        // Run outside Angular's zone to avoid unnecessary change detection cycles
        this.ngZone.runOutsideAngular(() => {
            this.idleTimer = setTimeout(() => {
                this.ngZone.run(() => this.showWarningDialog());
            }, IDLE_TIMEOUT_MS);
        });
    }

    private showWarningDialog(): void {
        if (this.dialogRef) return; // Already open

        this.dialogRef = this.dialog.open(SessionTimeoutDialogComponent, {
            width: '420px',
            disableClose: true,
            data: { warningDurationMs: WARNING_TIMEOUT_MS }
        });

        // Start the auto-logout countdown
        this.ngZone.runOutsideAngular(() => {
            this.warningTimer = setTimeout(() => {
                this.ngZone.run(() => this.performLogout());
            }, WARNING_TIMEOUT_MS);
        });

        this.dialogRef.afterClosed().subscribe((action: 'continue' | 'logout') => {
            this.dialogRef = null;
            clearTimeout(this.warningTimer);
            this.warningTimer = null;

            if (action === 'continue') {
                this.resetIdleTimer();
            } else if (action === 'logout') {
                this.performLogout();
            }
            // If closed with no action (e.g., auto-logout already triggered), do nothing
        });
    }

    private performLogout(): void {
        this.stopWatching();
        this.loginService.logOut();
    }

    private clearTimers(): void {
        if (this.idleTimer) {
            clearTimeout(this.idleTimer);
            this.idleTimer = null;
        }
        if (this.warningTimer) {
            clearTimeout(this.warningTimer);
            this.warningTimer = null;
        }
    }

    ngOnDestroy(): void {
        this.stopWatching();
    }
}
