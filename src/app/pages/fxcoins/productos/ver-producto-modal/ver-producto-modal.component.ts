import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-ver-producto-modal',
  templateUrl: './ver-producto-modal.component.html',
  styleUrls: ['./ver-producto-modal.component.scss']
})
export class VerProductoModalComponent implements OnInit {

  constructor(public app: AppService) { }

  ngOnInit(): void {
  }

}
