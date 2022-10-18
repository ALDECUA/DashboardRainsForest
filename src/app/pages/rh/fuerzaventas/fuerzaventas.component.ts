import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-fuerzaventas',
  templateUrl: './fuerzaventas.component.html',
  styleUrls: ['./fuerzaventas.component.scss']
})
export class FuerzaventasComponent implements OnInit {

  constructor(public app: AppService) { }

  ngOnInit(): void {
  }

}
