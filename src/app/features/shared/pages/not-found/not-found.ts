import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [],
  templateUrl: './not-found.html',
})
export class NotFound {
  constructor(
    private readonly router: Router,
    private readonly location: Location,
  ) {}

  volverInicio(): void {
    this.router.navigateByUrl('/');
  }

  volverAtras(): void {
    if (window.history.length > 1) {
      this.location.back();
      return;
    }

    this.volverInicio();
  }
}
