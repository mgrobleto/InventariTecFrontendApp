import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/authService/auth.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent{

  isSideNavCollapsed = false;
  screenWidth= 0;

  constructor(private router : Router, private authService : AuthService) {}

  onToggleSideNav (data: SideNavToggle): void {
    this.screenWidth=data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

 /*  isAuthenticated() {
    if(this.authService.auth()){
      this.router.navigate(['/dashboard/home']);
    }
  } */

}
