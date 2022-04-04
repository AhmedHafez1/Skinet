import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { NavBarComponent } from './nav-bar/nav-bar.component';



@NgModule({
  declarations: [
    NavBarComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    NavBarComponent
  ]
})
export class CoreModule { }
