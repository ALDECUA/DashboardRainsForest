import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-inversionistas',
  templateUrl: './inversionistas.component.html',
  styleUrls: ['./inversionistas.component.scss']
})
export class InversionistasComponent implements OnInit {

  constructor(public app: AppService) { }

  ngOnInit(): void {
  }

}
