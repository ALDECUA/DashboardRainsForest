import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-full-loader',
  templateUrl: './full-loader.component.html',
  styleUrls: ['./full-loader.component.scss']
})
export class FullLoaderComponent implements OnInit {

  @Input() message:string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
