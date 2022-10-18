import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/services/app.service';
import { ControlcalidadService } from 'src/app/services/controlcalidad.service';
/* import flatpickr from "flatpickr"; */
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import * as internal from 'stream';
import { ReportesRoutingModule } from '../../reportes/reportes-routing.module';
import { PagesRoutingModule } from '../../pages-routing.module';
import { Subscriber } from 'rxjs';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { ConstantPool, ElementSchemaRegistry } from '@angular/compiler';
import { InversionistasComponent } from '../inversionistas/inversionistas.component';
import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';
import { JsonPipe } from '@angular/common';

declare var bootstrap: any;
@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss'],
})
export class SurveyComponent implements OnInit {
  constructor(
    public app: AppService,
    public controlcalidad: ControlcalidadService,
    public toast: ToastrService,
    public auth: AuthService,
  ) {
    this.app.currentModule = 'Control de calidad';
    this.app.currentSection = ' - Encuesta de calidad';
  }
  @Input() clientes: any[] = [];
  public entrevistas = [];
  public seleccionado: any = {};
  public loading: boolean = false;
  public encuestas = [];
  public empty: boolean = false;
  public encuesta_seleccionada: any = { preguntas: [] };
  public respuestas: any = { respuestas: [] };
  public persona: any = { HRS: [] };
  public usuario;
  public historico = [];
  public hoy;
  public backup = { personas: [], historico: [] };
  public inversionistas: any = { todos: [], filtrados: [] };
  public respuestas_encuestas;
  public datos;
  public personasencuestas:any;
  public personasencuestasfechas = [];

  ngOnInit(): void {
    let mes = (new Date().getMonth() + 1).toString().padStart(2, '0');
    $('#SelectMes').val(mes);
    this.usuario = this.auth.user;
    this.getEncuestas();
    this.getCuestionarios();
    var date = new Date();
    date.setDate(date.getDate() + 1);
    this.hoy = date.toISOString().split('T')[0];
    let boton = document.getElementById('Cerrar');
    boton.click();
  }
  public getCuestionarios() {
    this.controlcalidad.obtenerEncuestas().subscribe((res: any) => {
      if (res.error) {
        this.toast.error(
          'Ocurrio un error interno, intenta nuevamente, si el problema persiste contacta a desarrollo'
        );
      } else {
        if (res.empty) {
          this.empty = true;
        } else {
          this.encuestas = res.encuestas;
        }
      }
    });
  }
  public getEncuestas() {
    this.controlcalidad.getEncuestas().subscribe((res: any) => {
      if (!res.error) {
        this.backup = res;
        this.filtro();
      }
    });
  }
  public seleccionar(encuesta) {
    this.encuesta_seleccionada = { preguntas: [] };
    $('#selectEncuesta').val(0);
    this.persona = encuesta;
    this.persona.HRS = JSON.parse(this.persona.HR);
    if (this.persona.EncuestasA) {
      this.persona.Encuestas = JSON.parse(this.persona.EncuestasA);
    } else {
      this.persona.Encuestas = [];
    }
    console.log(this.persona)
    let boton = document.getElementById('boton');
    this.respuestas = {
      respuestas: [],
      IdPersona: encuesta.IdPersona,
      Usr: this.usuario.IdUsuario,
    };

    boton.click();
  }
  reagendar() {
    this.loading = true;
    this.controlcalidad
      .reagendar({ IdPersona: this.persona.IdPersona, ...this.seleccionado })
      .subscribe((res: any) => {
        if (res.Updated) {
          this.toast.success('Encuesta reagendada', '');
          this.entrevistas = res.encuestas;
          this.loading = false;
          let boton = document.getElementById('cerrarcanvas');
          boton.click();
        }
      });
  }
  seleccionarHR(hr) {
    this.respuestas.IdHR = hr;
  }
  encuesta(event) {
    this.respuestas.respuestas = [];
    let index = event.target.value;
    this.encuesta_seleccionada = this.encuestas[index];
    this.encuesta_seleccionada.preguntas = JSON.parse(
      this.encuesta_seleccionada.Estructura
    );
    for (let i = 0; i < this.encuesta_seleccionada.preguntas.length; i++) {
      let respuesta: any = {};
      this.respuestas.respuestas[i] = respuesta;
    }
    this.respuestas.TipoEntrevista = this.encuestas[index].IdEncuesta;
  }
  trackByIndex(index: number, obj: any): any {
    return index;
  }
  mo() {
    if (!this.respuestas.IdHR) {
      this.respuestas.IdHR = 0;
      return;
    }
    let nombre;

    let fecha;
    for (let i = 0; i < this.encuesta_seleccionada.preguntas.length; i++) {
      let respuesta = [];
      let pregunta = this.encuesta_seleccionada.preguntas[i];
      this.respuestas.respuestas[i].tipo = pregunta.tipo;
      if (pregunta.tipo == '3') {
        nombre = 'pregunta' + i + '[]';
        $("input[name='" + nombre + "']:checked").each(function (index) {
          if ($(this).val() == 'Otro') {
            let valorotro = $('#otro' + i).val();
            respuesta.push({ valor: 'Otro', Otro: valorotro });
          } else {
            respuesta.push({ valor: $(this).val() });
          }
        });
        this.respuestas.respuestas[i].valor = respuesta;
      }
    }

    Swal.fire({
      title: '¿Deseas agendar una próxima entrevista con este inversionista?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Ingresa la fecha a continuación',
          html:
            '<input style="margin:0!important" min="' +
            this.hoy +
            '" type="date" value="null" class="swal2-input" id="next-date">',
          allowOutsideClick: false,
          preConfirm: function () {
            fecha = $('#next-date').val();
          },
        }).then(() => {
          this.guardar(fecha);
        });
      } else if (result.isDenied) {
        this.guardar();
      }
    });
  }
  guardar(fecha: any = null) {
    this.respuestas.Fecha = fecha;
    Swal.fire({
      title: 'Guardando respuestas',
      icon: 'info',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.respuestas.Respuesta = JSON.stringify(this.respuestas.respuestas);
    this.controlcalidad
      .guardarEncuesta(this.respuestas)
      .subscribe((res: any) => {
        if (res.Inserted) {
          this.ngOnInit();
          setTimeout(() => {
            var myOffcanvas = document.getElementById('offcanvasRight');
            var bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas);
            bsOffcanvas.hide();
            this.toast.success('Respuestas guardadas exitosamente');
            Swal.close();
          }, 1500);
        }
      });
  }
  buscar() {
    this.controlcalidad
      .busquedaInv({ Nombre: this.inversionistas.buscador })
      .subscribe((res: any) => {
        if (!res.empty && !res.error) {
          this.inversionistas.todos = res;
          this.filtrar();
        }
      });
  }
  filtrar() {
    const word = this.inversionistas.buscador.toLocaleLowerCase();
    this.inversionistas.filtrados = this.inversionistas.todos;
    let str = '';
    this.inversionistas.filtrados = this.inversionistas.todos.filter((elem) => {
      str = '';
      ['Inversionista', 'Email'].forEach((field) => {
        str += elem[field] + '';
      });
      if (str.toLocaleLowerCase().includes(word)) {
        return true;
      } else {
        return false;
      }
    });
  }
  seleccionarInv(inversionista) {
    Swal.fire({
      title: 'Seleccionaste a ' + inversionista.Inversionista,
      text: '¿Que deseas hacer?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Agendar encuesta',
      denyButtonText: 'Responder encuesta ahora',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let fecha;
        Swal.fire({
          title: 'Ingresa la fecha a continuación',
          html:
            '<input style="margin:0!important" min="' +
            this.hoy +
            '" type="date" value="null" class="swal2-input" id="next-date">',
          allowOutsideClick: false,
          preConfirm: function () {
            fecha = $('#next-date').val();
          },
        }).then(() => {
          this.controlcalidad
            .reagendar({ IdPersona: inversionista.IdPersona, next: fecha })
            .subscribe((res: any) => {
              if (res.Updated) {
                Swal.fire('Se ha agendado la encuesta', '', 'success');
              }
            });
        });
      } else if (result.isDenied) {
        $('#cerrarmodal').click();
        this.seleccionar(inversionista);
      }
    });
  }
  filtro(event: any = '') {
    let busqueda = '';
    if (event != '') {
      busqueda = event.target.value;
    }
    const word = busqueda.toLocaleLowerCase();
    this.entrevistas = this.backup.personas;
    let str = '';
    this.entrevistas = this.backup.personas.filter((elem) => {
      let mes = elem.FechaHR.split('/')[1];
      str = '';
      ['Inversionista', 'Email'].forEach((field) => {
        str += elem[field] + '';
      });
      if (
        str.toLocaleLowerCase().includes(word) &&
        (mes == $('#SelectMes').val() || $('#SelectMes').val() == '0')
      ) {
        return true;
      } else {
        return false;
      }
    });
    this.historico = this.backup.historico;
    str = '';
    this.historico = this.backup.historico.filter((elem) => {
      str = '';
      let mes = elem.Actividad.split('/')[1];
      ['Inversionista'].forEach((field) => {
        str += elem[field] + '';
      });
      if (
        str.toLocaleLowerCase().includes(word) &&
        (mes == $('#SelectMes').val() || $('#SelectMes').val() == '0')
      ) {
        return true;
      } else {
        return false;
      }
    });
  }
  limpiar() {
    $('#buscador').val('');
    this.filtro();
  }
  public ImprimirReporteEncuestas() {
    this.controlcalidad.ReporteEncuestas().subscribe((res: any) => {

      // Traemos las respuestas guardadas en la base de datos.
      this.respuestas_encuestas = res

      // Traemos el historico de las personas que rellenaron alguna encuesta.
      this.personasencuestas = this.backup.historico

      // Creamos un nuevo documento de Excel y lo guardamos en una varibale.
      let workBook = new Workbook();

      // Recorremos las respuestas guardadas.
      this.respuestas_encuestas[0].forEach(item => {

        // Creamos un arreglo para el header del archivo Excel.
        let preguntas = [];

        // Agregamos una hoja nueva al Excel por cada encuesta existente y activa.
        let workSheet = workBook.addWorksheet(item.NombreEncuesta)

        // Convertimos los string de Preguntas y Respuestas a un modelo JSON.
        var Preguntas = JSON.parse(item.Estructura)
        var Respuestas = JSON.parse(item.Respuestas)

        // Agregamos los headers principales a un arreglo para cada hoja.
        preguntas.push('Encuestado')
        preguntas.push('Lote')
        preguntas.push('Encuestador')
        preguntas.push('Modificador')
        preguntas.push('Fecha de Respuesta')

        console.log(Preguntas.length,'Cantidad Preguntas')
        console.log(Preguntas)

        // Recorremos las preguntas de cada encuesta y las guardamos en un arreglo.
        Preguntas.forEach(P => {
          preguntas.push(P.pregunta)
        });

        // Agregamos las preguntas guardadas como header en sus rspectivas hojas de Excel.
        // Y guardamos las preguntas en un variable para darle formato despues.
        let headers = workSheet.addRow(preguntas);

        // Comprobamos si alguna encuesta aun no ha sido respondida
        if (Respuestas == null) {

          // De ser asi no hacemos nada
        } else {

          // Caso contrario recorremos las respuestas de cada pregunta
          // de cada encuesta.
          Respuestas.forEach(R => {

            // Convertimos el string de las respuestas en un modelo JSON y las guardamos en una variable.
            var RespuestasIndv = JSON.parse(R.Respuestas)
            console.log(RespuestasIndv.length,'Cantidad Respuestas')
            console.log(RespuestasIndv)
            // Creamos un arreglo en donde iran las respuestas, para posteriormiente agregarlas en Excel.
            let respuestas = [];

            // Recorremos el historico de las personas que hayan contestado alguna encuesta.
            this.personasencuestas.forEach(person => {

              // Guardamos en formato JSON las fechas en que cada persona realizo una encuesta.
              let fechaRes = JSON.parse(person.FechaRes)

              // Comprobamos si cada persona encuestada cuenta con un IdHR
              // que coincida con el IdHR de cada respuesta guardada en la base de datos.
              if (person.IdHR == R.IdHR) {

                // Si encuentra coincidencia procodemos a guardar el nombre del encuestado y
                // el lote que esta evaluando en el arreglo de respuestas.
                respuestas.push(person.Inversionista)
                respuestas.push(person.Lote)

                // Comprobamos si cada persona encuestada cuenta con un encuestador.
                if (person.Encuestador == null) {

                  // Si la persona no cuenta con un encuestador agregamos un N/A al arreglo.
                  respuestas.push('N/A')
                } else {

                  // Caso contratio guardamos el nombre de su encuestado.
                  respuestas.push(person.Encuestador)
                }

                // Comprobamos si cada persona encuestada cuenta con un modificador.
                if (person.Modificador == null) {

                  // Si la persona no cuenta con un modificador agregamos un N/A al arreglo.
                  respuestas.push('N/A')
                } else {

                  // Caso contratio guardamos el nombre de su modificador.
                  respuestas.push(person.Modificador)
                }

                // Guardamos la fecha en que la persona realizó la encuesta.
                respuestas.push(fechaRes[0].Fecha)
              }
            });

            // Recorremos cada respuesta de cada tipo de pregunta
            for (let i = 0; i < Preguntas.length; i++) {

              // Si la respuesta es de tipo 1 guardamos el texto que contenga.
              if (RespuestasIndv[i].tipo == 1) {
                respuestas.push(RespuestasIndv[i].valor)
              }
              if (RespuestasIndv[i].tipo == 2) {

                // Si la respuesta es de tipo 2 verificamos que el valor de la respuesta tenga un identificador
                // de 'Otro'.
                if (RespuestasIndv[i].valor == 'Otro') {

                  // De ser asi, guardamos el contenido del identificador 'Otro'.
                  respuestas.push(RespuestasIndv[i].Otro)
                }else{

                  // Caso contrario guardamos los que contenga el 'valor'.
                  respuestas.push(RespuestasIndv[i].valor)
                }
              }
              if (RespuestasIndv[i].tipo == 3) {

                // Si la respuesta es de tipo 3, convertimos el string en un modelo JSON.
                var RespuestaT3 = JSON.parse(JSON.stringify(RespuestasIndv[i].valor))

                // Obtenemos el tamaño del arreglo.
                var length = RespuestaT3.length

                // Creamos una variable donde guardaremos las respuestas multiples
                // que haya respondido los encuestados.
                let val = ''

                // Recorremos el arreglo de las respuesta multiples.
                for (let i = 0; i < length; i++) {

                  // Comprobamos si la primera respuesta multiple es la unica o ultima en el arreglo.
                  if (i == length - 1) {

                    // De ser asi, comprobamos si el 'valor' de la respuesta contiene un identificador 'Otro'.
                    if (RespuestaT3[i].valor == 'Otro') {

                      // De ser ai, guardamos la respuesta en el identificador 'Otro' en la variable 'val' y la concatenamos
                      // con lo que tengamos guardado ahi (si el 'valor' 'Otro' es el unico, solo se guardará eso).
                      val = val + RespuestaT3[i].Otro
                    }else{

                      // Caso contrario, guardamos lo que se contega en el identificador 'valor'
                      // con lo que se tenga guardado (si el 'valor' es el unico, solo se guardará eso).
                      val = val + RespuestaT3[i].valor
                    }
                  }else{

                    // Caso contrario, si la respuesta no es la unica o la ultima, comprobamos
                    // si esa respuesta tiene un identificador 'Otro'.
                    if (RespuestaT3[i].valor == 'Otro') {

                      // De ser asi, guardamos el 'valor' de 'Otro' y agremos una coma al final para
                      // seguir concatenando más respuestas.
                      val = val + RespuestaT3[i].Otro + ', '
                    } else {

                      // Caso contrario, guardamos el 'valor' de la respuesta y agremos una coma al final para
                      // seguir concatenando más respuestas.
                      val = val + RespuestaT3[i].valor + ', '
                    }
                  }
                }

                // Y procedemos a guardar las respuestas concatenadas o no en el arreglo de respuestas.
                respuestas.push(val)
              }
            }

            // Una vez teniendo las respuestas guardadas en el arreglo procedemos a insertarlas
            // en sus respectivas hojas de encuestas.
            this.datos = workSheet.addRow(respuestas)
          });
        }

        // Recorremos nuevamente cada pregunta de cada encuesta.
        Preguntas.forEach(P => {

          // Recorremos las celdas de Excel de cada pregunta con el tamaño del arreglo.
          for (let i = 1; i <= preguntas.length; i++) {

            // Obtenemos cada celda de cada pregunta de cada encuesta y la guardamos
            // en una variable 'columna' para darle el formate que queramos.
            let columna = headers.getCell(i);

            // Rellenamos cada celda con un color, un patron y tipo.
            columna.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FF00085E' },
            };

            // Modificamos cada borde de la celda de cada pregunta
            // al minimo.
            columna.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            };

            // Asignamos un color, grueso y tamaño al texto de cada celda 'Pregunta'
            columna.font = {
              color: { argb: 'FFFFFFFF' },
              bold: true,
              size: 13,
            };

            columna.alignment = {vertical: 'middle', horizontal: 'center'}
          }
        });

        // Recorremos cada celda que contenga texto dentro del archivo Excel.
        workSheet.columns.forEach(function (column, i) {

          // Asignamos una variable donde guadaremos el valor maximo de caracteres
          // dentro de la celda recorrida.
          var maxLength = 0;

          // Guardamos la cantidad de caracteres que contenga la celda recorrida en la variable 'columnLength'.
          column["eachCell"]({ includeEmpty: true }, function (cell) {
            var columnLength = cell.value ? cell.value.toString().length : 5;

            // Si la cantidad de 'columnLength' es mayor a 'maxLength', igualamos 'maxLength' a 'columnLength'.
            if (columnLength > maxLength) {
              maxLength = columnLength;
            }

            // Si 'columnLength' se pasa del valor 75, igualamos 'maxLength' a 75 (que es un valor aceptado
            // para el ancho de las columnas).
            if (columnLength > 75) {
              maxLength = 75
            }
          });

          // Seteamos las columnas con el valor de 'maxLength'.
          column.width = maxLength < 20 ? 20 : maxLength;

          // Ajustamos el texto de cada celda para que se acople al ancho seteado anteriormente.
          column.alignment = { wrapText: true }
        });
      });

      // Llamamos a la función 'writeBuffer' para escribir todos los datos en el archivo de Excel
      // y guardarlo en la carpeta de 'Descargas' de nuestro equipo.
      workBook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        // Asignamos el nombre que queramos del archivo de Excel.
        saveAs(blob, 'Reporte_Encuestas' + '.xlsx');
      });

    });
  }
}
