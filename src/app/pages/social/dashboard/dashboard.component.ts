import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ZapierService } from 'src/app/services/zapier.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { style } from '@angular/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  private subscriptions = new Subscription();
  public listarprospectos: any = [];
  public Prospectos: any = [];
  public Origen: any;
  public plataforma: string;
  public contador: number = 1;
  public formn: any;

  public SociosComerciales: any = [];
  public DataLead: any = {};
  public sociocid: any = {
    id: ''
  };
  public valido: boolean;
  public loadSpinner: boolean = false;
  public leadAsignado: boolean = false;

  // Checkbox
  public cb: any;
  public id_leads;
  public cb_asign: boolean = false;
  public c: number = 0;

  // Seguimientos
  public leadsObtenidos: any = [];
  public spinnerSeguimientos: boolean = false;
  public numeroLeads: number = 0;

  constructor(
    public app: AppService,
    public zap: ZapierService,
    private el: ElementRef
  ) {
    this.app.currentModule = 'SOCIAL';
    this.app.currentSection = '- Dashboard';
   }

  ngOnInit(): void {
    // Prospectos
    this.loadSpinner = true;

    this.subscriptions.add(
      this.zap.listarProspectos().subscribe((res: any) => {
        this.listarprospectos = res;

        this.Prospectos = JSON.parse(this.listarprospectos[0].ZAP);
        console.log('PROSPECTS');
        console.log(this.Prospectos);

        if (this.Prospectos == null) {
          console.log("es nulo");
        }

        this.loadSpinner = false;
      })
    );

    this.zap.disparadorFormModal.subscribe((data: any) => {
      this.DataLead = data.data;
      this.sociocid.id = '';
      this.el.nativeElement.querySelector('#inputState').classList.remove('is-valid');
    })

    this.zap.ListarSociosComerciales().subscribe((res: any) => {
      this.SociosComerciales = res;
    })

    // Seguimiento
    this.spinnerSeguimientos = true;
    const fechaInicio = this.obtenerFechaInicioDeMes();
    const fechaFin = this.obtenerFechaFinDeMes();
    const fechaInicioFormateada = this.formatearFecha(fechaInicio, 1);
    const fechaFinFormateada = this.formatearFecha(fechaFin, 1);
    console.log(`El inicio de mes es ${fechaInicioFormateada} y el fin es ${fechaFinFormateada}`);
    this.ObtenerProcesos(0);
  }

  recargarProspectos() {
    $('#allcb').prop("disabled", true);
    this.Prospectos = [];
    this.loadSpinner = true;
    this.c = 0;
    $('#allcb').prop("checked", false);

    this.subscriptions.add(
      this.zap.listarProspectos().subscribe((res: any) => {
        this.listarprospectos = res;

        this.Prospectos = JSON.parse(this.listarprospectos[0].ZAP);
        console.log(this.Prospectos);
        this.loadSpinner = false;
        $('#allcb').prop("disabled", false);
      })
    );
  }

  seguimiento(item) {
    this.zap.disparadorFormModal.emit({
      data: item
    })
    // Imprime el prospecto
    //console.log('item: ');
    // console.log(Array.isArray(item));
    /* console.log(item); */
    // console.log(this.Prospectos);

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
    } else {
      this.leadAsignado = true;
    }

    // Comprueba si se manda un array de objetos
    if (Array.isArray(this.DataLead) == false) {
      console.log(this.DataLead);
      // console.log(this.DataLead.length);
      this.LeadAsignado(this.DataLead);
    } else {
      for (const [index, iterator] of this.DataLead.entries()) {
        this.LeadAsignado(iterator, index + 1);
        console.log('indice: ', index);
        console.log('datalead: ', this.DataLead.length);
        console.log('iterador: ', iterator);
      }
    }
  }

  LeadAsignado(iterator: any, index?: number) {
    this.zap.AsignarLead({
      Idlead: parseInt(iterator.Idlead),
      IdAsignado: parseInt(this.sociocid.id),
      IdStatusCrm: 1
    }).subscribe((res: any) => {
      console.log(res);
      if (res.updated == 1) {
        document.getElementById(iterator.Idlead).remove();
        let canvas = document.getElementById('offcanvasExample');

        console.log('test');

        this.leadAsignado = false;

        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Se ha asignado correctamente',
          showConfirmButton: false,
          timer: 2000
        })
        // this.el.nativeElement.querySelector('#offcanvasButton').click();

        if (Array.isArray(this.DataLead) == false) {
          this.el.nativeElement.querySelector('[data-bs-dismiss="offcanvas"]').click();
        }
        else if (index == this.DataLead.length) {
          this.el.nativeElement.querySelector('#offcanvasButton2').click();
        }

        this.c = 0;
        this.numeroLeads += 1;
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

  checkAll(ev) {

    let t = document.querySelector('#allcb') as HTMLInputElement
    this.cb = Array.from(document.querySelectorAll('#cb'));
    console.log(t.checked);

    if (t.checked == true) {
      this.c = this.cb.length;
      console.log(this.c);
    } else {
      this.c = 0;
      console.log(this.c);
    }

    $('tbody tr td input[type="checkbox"]').prop('checked', $('#allcb').prop('checked'));
  }

  imprimirArray() {
    this.cb = Array.from(document.querySelectorAll('#cb'));
    this.id_leads = Array.from(document.querySelectorAll('#idLead'));

    let result = [];
    for (let i = 0; i < this.cb.length; i++) {
      let val1 = this.id_leads[i].innerHTML;
      let val2 = this.cb[i].checked;
      if (val2 == true) {
        let obj = {
          Idlead: val1,
          value: val2
        };
        result.push(obj);
      }
    }
    this.seguimiento(result);
    // console.log(result);
  }

  asignarCheck(ev) {
    if (ev.target.checked == true) {
      // this.cb_asign = true;
      this.c += 1;
      console.log(this.c);
    }
    else {
      // this.cb_asign = false;
      this.c -= 1;
      console.log(this.c);
    }
  }

  // TAB SEGUIMIENTO "valor del mes se refiere si es actual o anterior, para actual se pasa un cero, para anterior un, uno."
  public ObtenerProcesos(mesvalor) {
    this.zap.ObtenerAsigandos({
      ValorFecha: mesvalor,//valor fecha se le asigna un entero, ya sea 0 para mostrar fecha basado en año actual y mes actual, asignarle 1 haria que pasara a mostrar el mes anterior
      Origen: 'crm'
    }).subscribe((response: any) => {
      this.leadsObtenidos = response;
      console.log(response);
      this.spinnerSeguimientos = false;
        this.spinnerSeguimientos = false;        
        if (this.leadsObtenidos.length == 0) {
          console.log('Seguimiento Vacío')
        }
    });
  }

  public mesAnterior(){
    const fechaInicio = this.obtenerFechaInicioDeMes();
      const fechaFin = this.obtenerFechaFinDeMes();
      const fechaInicioFormateada = this.formatearFecha(fechaInicio,0);
      const fechaFinFormateada = this.formatearFecha(fechaFin,0);
      console.log(`El inicio de mes es ${fechaInicioFormateada} y el fin es ${fechaFinFormateada}`);
      this.ObtenerProcesos(1);
  }

  public mesActual(){
    const fechaInicio = this.obtenerFechaInicioDeMes();
    const fechaFin = this.obtenerFechaFinDeMes();
    const fechaInicioFormateada = this.formatearFecha(fechaInicio,1);
    const fechaFinFormateada = this.formatearFecha(fechaFin,1);
    console.log(`El inicio de mes es ${fechaInicioFormateada} y el fin es ${fechaFinFormateada}`);
    this.ObtenerProcesos(0);
  }

  obtenerFechaInicioDeMes() {
    const fechaInicio = new Date();
    // Iniciar en este año, este mes, en el día 1
    return new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), 1);
  }

  obtenerFechaFinDeMes() {
    const fechaFin = new Date();
    // Iniciar en este año, el siguiente mes, en el día 0 (así que así nos regresamos un día)
    return new Date(fechaFin.getFullYear(), fechaFin.getMonth() + 1, 0);
  }

  formatearFecha(fecha, opcion) {
    let mes = fecha.getMonth() + 1;
    let dia = fecha.getDate();

    if (opcion === 1) {
      mes = fecha.getMonth() +1;
      dia = fecha.getDate();
    }else{
      mes = fecha.getMonth();
      dia = fecha.getDate();
    }
    return `${fecha.getFullYear()}-${(mes < 10 ? '0' : '').concat(mes)}-${(dia < 10 ? '0' : '').concat(dia)}`;
  }

  recargarSeguimiento() {
    if (this.numeroLeads > 0) {
      Swal.fire('Se encontraron nuevos leads asignados.')
      .then((result) => {
        if (result.isConfirmed) {
          this.spinnerSeguimientos = true;
          this.leadsObtenidos = [];
          const fechaInicio = this.obtenerFechaInicioDeMes();
          const fechaFin = this.obtenerFechaFinDeMes();
          const fechaInicioFormateada = this.formatearFecha(fechaInicio, 1);
          const fechaFinFormateada = this.formatearFecha(fechaFin, 1);
          console.log(`El inicio de mes es ${fechaInicioFormateada} y el fin es ${fechaFinFormateada}`);
          console.log('antes: ', this.spinnerSeguimientos);
          this.ObtenerProcesos(0);
          this.numeroLeads = 0;
        }
      })
    }
  }
}