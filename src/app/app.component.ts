import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div style="max-width: 1200px; margin: 0 auto;">
      <h1>Sistema de Gestión de Productos</h1>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    h1 {
      color: #4CAF50;
      text-align: center;
      padding: 20px 0;
      border-bottom: 3px solid #4CAF50;
      margin-bottom: 30px;
    }
  `]
})
export class AppComponent {
  title = 'appointmentapp-frontend';
}
