import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'smart-city-viz';
  private readonly router = inject(Router);

  /**
   * Defer navigation to the next tick so angular-three's NgtCanvas can tear down
   * without racing with the router. Prevents "Cannot read properties of null (reading '__ngt_renderer__')"
   * on first nav link click.
   */
  onNavClick(event: MouseEvent, route: string): void {
    event.preventDefault();
    event.stopPropagation();
    setTimeout(() => this.router.navigateByUrl(route), 0);
  }
}
