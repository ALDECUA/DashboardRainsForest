import { OnChanges } from '@angular/core';
import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-datatableHR',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss']
})
export class DatatableHR implements OnChanges {

  @Input() public dataList: any = [];
  @Input() public config: any = {
    fields: []
  };

  @Input() public loading: boolean = false;

  public filteredList: any = [];
  public registros: any = [];
  public registro = {
    Nombre: null,
    Nombre_S: '',
    Apellido_Pat: null,
    Apellido_Mat: '',
    Email: null,
    Num_Cel: null,
    Whats: null,
    asesor: null,
    Nacimiento: new Date(),
    Fecha: new Date(),
    SocioCom: null,
    IdLider: null,
  };
  public search;
  public datoPersonal: any = [];
  datosPersonales:any = [];
  public limit = 10;
  public page = 1;
  public form = 1;
  public pages = [];
  public searched: string = "";
  public asesores: any = [];
  public Backup_asesores: any = [];
 

  constructor(
    private toast: ToastrService,
    public router: Router,
    public app: AppService
  ) { }

  ngOnChanges(): void {
    this.createPagination();
  }
  ngOnInit(): void {
    this.app.getAsesores().subscribe((res: any) => {
      this.Backup_asesores = res;
      this.asesores = res;
    });
  }


  public createPagination(list = this.dataList) {
    this.page = 1;
    this.pages = [];
    const totalPages = Math.ceil(list.length / this.limit);
    for (let p = 1; p <= totalPages; p++) {
      this.pages.push(p);
    }

    this.config.fields.map((elem) => {
      return elem.order = null;
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
    })

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

  public showElem(elem) {
    if (this.config.show) {
      this.router.navigateByUrl(this.config.urlShow + elem[this.config.idField] +'/'+elem[this.config.idField2]+'/'+elem[this.config.idField3]);
    }
  }
 

  cambioform() {
    if (this.form == 1) {
      this.form = 2;
    } else {
      this.form = 1;
    }
  }
 
}
