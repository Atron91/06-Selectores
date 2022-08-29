import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';

import { switchMap, tap } from "rxjs/operators";
import { Pais, PaisSmall } from '../../interface/paises.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region    : ['', Validators.required ],
    pais      : ['', Validators.required ],
    frontera  : ['', Validators.required ]
  })


  //llenar regiones
  regiones  : string[]    = [];
  paises    : PaisSmall[] = [];
  fronteras : PaisSmall[] = [];

  // UI
  cargando: boolean = false;

  constructor(  private fb: FormBuilder, 
                private paisesService: PaisesService) { }

  ngOnInit(): void {

    this.regiones = this.paisesService.regiones;


    // CUando cambie la region
    this.miFormulario.get('region')?.valueChanges
    .pipe(
      tap( ( _ ) => {
        this.miFormulario.get('pais')?.reset('')
        this.cargando = true;
        // this.miFormulario.get('frontera')?.disable();
      }),
      switchMap( region => this.paisesService.getPaisesPorRegion( region ))
    )
      .subscribe( paises => {
        this.paises = paises;
        this.cargando = false;
      });

    // Cuando cambia el pais
    this.miFormulario.get('pais')?.valueChanges
    .pipe(
      tap( () => {
        this.miFormulario.get('frontera')?.reset();
        this.cargando = true;
        // this.miFormulario.get('frontera')?.enable();
      }),
      switchMap( codigo => this.paisesService.getPaisPorCodigo( codigo )),
      switchMap( pais => this.paisesService.getPaisesPorCodigos( pais?.borders?  ))
      
    )
      .subscribe( paises => {
        // this.fronteras = pais?.borders || [];
        
        if (paises.length > 0) {
          this.fronteras = paises;
          this.cargando = false;
        }
        else{
          this.fronteras = [];
          this.cargando = false;
        }
      })

  }

  guardar() {
    this.miFormulario.value
  }

  

}
