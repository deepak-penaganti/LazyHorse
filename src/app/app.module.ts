import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { InfyScrollDirective } from './directives/infy-scroll.directive';
import { HttpModule } from '@angular/http';


@NgModule({
  declarations: [
    AppComponent,
    InfyScrollDirective
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
