import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppService } from './app.service';

@Component({
  imports: [RouterModule, FormsModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  name: string = '';
  protected title = 'Forma';
  constructor(private appService: AppService) {}
  click() {
    this.appService.mock(this.name);
  }
}
