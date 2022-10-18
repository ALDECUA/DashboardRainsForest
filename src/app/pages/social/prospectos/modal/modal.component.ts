import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { ZapierService } from 'src/app/services/zapier.service';
import Swal from 'sweetalert2';
import { style } from '@angular/animations';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  public SociosComerciales: any = [];
  public DataLead: any = {};
  public sociocid: any = {
    id: ''
  };
  public valido: boolean;

  constructor(private zap: ZapierService, private el: ElementRef) { }

  ngOnInit(): void {
    
    this.zap.disparadorFormModal.subscribe((data: any) => {
      console.log(data);
      this.DataLead = data.data;
      this.sociocid.id = '';
      this.el.nativeElement.querySelector('#inputState').classList.remove('is-valid');
    })

    this.zap.ListarSociosComerciales().subscribe((res: any) => {
      console.log(res);
      this.SociosComerciales = res;
    })
    

  }

  asignarLead() {
    console.log(this.sociocid);
    console.log(parseInt(this.sociocid.id));

    if (this.sociocid.id === '') {
      console.log("vacio");
      this.el.nativeElement.querySelector('#inputState').classList.add('is-invalid');
      setTimeout(() => {
        this.el.nativeElement.querySelector('#inputState').classList.remove('is-invalid');
      }, 2500);
      return
    }


    this.zap.AsignarLead({
      Idlead: parseInt(this.DataLead.Idlead),
      IdAsignado: parseInt(this.sociocid.id),
      IdStatusCrm: 1
    }).subscribe((res: any) => {
      console.log(res);
      if(res.updated == 1) {
        let canvas = document.getElementById('offcanvasExample');
        let spiner = document.getElementById('response');
		    spiner.innerHTML = `
          <div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>`;

        setTimeout(() => {
          spiner.innerHTML = ''

          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Se ha asignado correctamente',
            showConfirmButton: false,
            timer: 2000
          })

          // this.el.nativeElement.querySelector('#offcanvasButton').click();
          this.el.nativeElement.querySelector('[data-bs-dismiss="offcanvas"]').click();
        }, 1500);

      }
    })



  }

  changed(event) {
    console.log(event.target.value);
    if (this.sociocid.id != '') {
      this.el.nativeElement.querySelector('#inputState').classList.remove('is-valid');
      this.el.nativeElement.querySelector('#inputState').classList.add('is-valid');
    } else {
      this.el.nativeElement.querySelector('#inputState').classList.remove('is-valid');
    }
  }


}
