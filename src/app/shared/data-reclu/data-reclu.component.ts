import { OnChanges } from '@angular/core';
import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/services/app.service';
import { FxcoinsService } from 'src/app/services/fxcoins.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { AvisosService } from 'src/app/services/avisos.service';

@Component({
  selector: 'app-data-reclu',
  templateUrl: './data-reclu.component.html',
  styleUrls: ['./data-reclu.component.scss'],
})
export class DataRecluComponent implements OnChanges {
  @Input() public dataList: any = [];
  @Input() public config: any = {
    fields: [],
  };

  public promo: any = {};
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  imagen = '';
  @Input() public loading: boolean = false;
  public loaders : any ={};
  public filteredList: any = [];
  public inicio;
  public fin;
  public limit = 10;
  public page = 1;
  public pages = [];
  public searched: string = '';
  constructor(
    public router: Router,
    public app: AppService,
    public fxcoins: FxcoinsService,
    public toast: ToastrService,
    public datepipe: DatePipe,
    public avisos: AvisosService
  ) {}

  ngOnChanges(): void {
    this.createPagination();
  }

  public createPagination(list = this.dataList) {
    this.page = 1;
    this.pages = [];
    const totalPages = Math.ceil(list.length / this.limit);
    for (let p = 1; p <= totalPages; p++) {
      this.pages.push(p);
    }

    this.config.fields.map((elem) => {
      return (elem.order = null);
    });
  }

  public prevPage() {
    if (this.page > 1) {
      this.page--;
    }
  }

  public nextPage() {
    if (this.page < this.pages.length) {
      this.page++;
    }
  }

  public selectPage(number) {
    this.page = number;
  }

  public async searchFilter() {
    const word = this.searched.toLocaleLowerCase();
    this.filteredList = [];
    let str = '';
    this.filteredList = this.dataList.filter((elem) => {
      str = '';
      this.config.fields.forEach((field) => {
        str += elem[field.value] + '';
      });

      if (str.toLocaleLowerCase().includes(word)) {
        return true;
      } else {
        return false;
      }
    });

    this.createPagination(this.filteredList);
    /*     this.filteredList = this.dataList.filter(o =>
          this.config.fields.some(k => {
            if(o[k.key] !== undefined && o[k.key] !== null) {
              return o[k.key].toLowerCase().includes(this.searched)
            } else {
              return false;
            }
          })); */
  }

  public filterAChange(val: any) {
    this.filteredList = this.dataList.filter((element) => {
      if (element[this.config.filtroA.fieldFilter] === val.target.value) {
        return true;
      } else {
        return false;
      }
    });

    if (val.target.value === '') {
      this.searched = '';
      this.createPagination();
    } else {
      this.searched = ' ';
      this.createPagination(this.filteredList);
    }
  }
  public async DateFilter() {
    const word = this.searched.toLocaleLowerCase();
    this.filteredList = [];
    let str = '';
    this.filteredList = this.dataList.filter((elem) => {
      str = '';
      this.config.fields.forEach((field) => {
        str += elem[field.value] + '';
      });

      if (str.toLocaleLowerCase().includes(word)) {
        return true;
      } else {
        return false;
      }
    });

    this.createPagination(this.filteredList);
    /*     this.filteredList = this.dataList.filter(o =>
          this.config.fields.some(k => {
            if(o[k.key] !== undefined && o[k.key] !== null) {
              return o[k.key].toLowerCase().includes(this.searched)
            } else {
              return false;
            }
          })); */
  }

  public async showElem(elem) {
    if (this.config.show) {
      this.router.navigateByUrl(
        this.config.urlShow + elem[this.config.idField]
      );
    }
    if (this.config.guardado) {
      console.log(elem);
      const { value: formValues } = await Swal.fire({
        title: 'Asignar coins a ' + elem.Nombre,
        html:
          '<label for="">FxCoins</label><input value="' +
          +elem.FxCoins +
          '" id="swal-input1" type="number" class="swal2-input"><br>' +
          '<label for="">ExCoins</label><input value="' +
          +elem.ECoins +
          '" id="swal-input2" type="number" class="swal2-input">',
        focusConfirm: false,
        preConfirm: () => {
          elem.FxCoins = +(<HTMLInputElement>(
            document.getElementById('swal-input1')
          )).value;
          elem.ECoins = +(<HTMLInputElement>(
            document.getElementById('swal-input2')
          )).value;
          return elem;
        },
      });

      if (formValues) {
        console.log(formValues);

        this.AsignarFxCoins(formValues);
      }
    }
    if (this.config.promo) {
      this.promo = elem;
      let inicio = new Date(this.promo.Inicio);
      inicio.setDate(inicio.getDate() + 1);
      let Fin = new Date(this.promo.Fin);
      Fin.setDate(Fin.getDate() + 1);
      this.dateRange = new FormGroup({
        start: new FormControl(inicio),
        end: new FormControl(Fin),
      });
      console.log(this.promo, this.dateRange.value);
      let boton = document.getElementById('modificarmodal');
      boton.click();
    }
  }

  public AsignarFxCoins(data) {
    console.log(data);
    this.fxcoins.AsignarFxCoins(data).subscribe((res: any) => {
      if (res.Updated == true) {
        this.toast.success('', 'Coins asignados', { timeOut: 3000 });
      } else {
        this.toast.error('', 'Error, Coins no asignados', { timeOut: 3000 });
      }
    });
  }

  public verImagen(dato) {
    let imagen = this.config.imagenurl + dato;
    console.log(imagen);
    Swal.fire({
      imageUrl: imagen,
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
  public subirFoto(files) {
    const file = files[0];
    let formdata = new FormData();
    formdata.append('file', file);
    this.avisos.subirArte(formdata).subscribe((res: any) => {
      console.log(res);
      if (res.result === true) {
        this.promo.Arte = res.nameimg;
        this.imagen = file.name;
      }
    });
  }
  actualizar(status) {
    this.promo.MNombre = +this.promo.MNombre;
    this.promo.MVigencia = +this.promo.MVigencia;
    if(status == 0)
    {
      this.loaders.eliminar = true;
    }
    else
    {
      this.loaders.editar = true;
    }
    this.promo.IdStatus = status;
    this.avisos.promo(this.promo).subscribe((res: any) => {
      if (!res.recordset.error) {
        this.loaders = {};
        let boton = document.getElementById('cerrar');
        boton.click();
        if(status == 1)
        {
          this.toast.success('Promocion actualizada','');
        }
        else
        {
          this.toast.success('Promocion eliminada','');
        }
        this.getPromos();
      }
    });
  }
  getPromos(){
    this.avisos.promos().subscribe((res:any)=>{
     if(res.promos)
     {
       this.dataList = res.promos;
     }
    })
  }
}
