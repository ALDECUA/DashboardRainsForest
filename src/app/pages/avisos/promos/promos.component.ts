import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AppService } from 'src/app/services/app.service';
import { AvisosService } from 'src/app/services/avisos.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-promos',
  templateUrl: './promos.component.html',
  styleUrls: ['./promos.component.scss']
})
export class PromosComponent implements OnInit {

  constructor(public app: AppService, public avisos:AvisosService,    public datepipe: DatePipe, public toast: ToastrService) { }
  public promo: any = {};
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  public loading:any = {};
  public promos = [];
    public configDataTable = {
    fields: [
      {
        text: 'Nombre',
        value: 'Nombre',
        pipe: null,
      },
      {
        text: 'Vigencia',
        value: 'Vigencia',
        pipe: null,
      },
      {
        text: 'Estado',
        value: 'Estado',
        pipe: null,
      },
    ],
    imagen: true,
    imagenurl: 'https://fibraxinversiones.mx/assets/img/promos/',
    img: 'Arte',
    promo: true
  };
  ngOnInit(): void {
    this.getPromos();
  }
  public subirFoto(files) {
    const file = files[0];
    let formdata = new FormData();
    formdata.append("file", file);
    this.avisos.subirArte(formdata).subscribe((res: any) => {
      console.log(res);
      if (res.result === true) {
        this.promo.Arte = res.nameimg;
      }
    });
  }
  dateRangeChange() {
    if (this.dateRange.value.end && this.dateRange.value.start) {
      this.promo.Inicio = this.datepipe.transform(
        this.dateRange.value.start,
        'yyyy-MM-dd'
      );
      this.promo.Fin = this.datepipe.transform(
        this.dateRange.value.end,
        'yyyy-MM-dd'
      );

        
    }
  }
  nueva(){
    this.promo.MNombre = +this.promo.MNombre;
    this.promo.MVigencia = +this.promo.MVigencia;
    this.avisos.NuevaPromo(this.promo).subscribe((res: any)=>{
      if(!res.recordset.error)
      {
      
        let boton = document.getElementById('cerrar');
        console.log(boton);
        boton.click();
        this.toast.success('Promocion agregada','');
        this.promo = {};
        this.getPromos();

      }
    })
  }
  getPromos(){
    this.avisos.promos().subscribe((res:any)=>{
     if(res.promos)
     {
       this.promos = res.promos;
     }
    })
  }
}
