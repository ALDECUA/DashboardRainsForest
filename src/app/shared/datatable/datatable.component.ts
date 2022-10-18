import { OnChanges } from '@angular/core';
import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss']
})
export class DatatableComponent implements OnChanges {

  @Input() public dataList: any = [];
  @Input() public config: any = {
    fields: []
  };

  @Input() public loading: boolean = false;

  public filteredList: any = [];

  public limit = 10;
  public page = 1;
  public pages = [];
  public searched: string = "";

  constructor(
    public router: Router,
    public app: AppService
    ) { }

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
      this.router.navigateByUrl(this.config.urlShow + elem[this.config.idField]);
    }
  }
}
