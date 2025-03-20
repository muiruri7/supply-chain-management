import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service'; // if needed for showing/hiding links

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
