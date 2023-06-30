import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TobaccoCreateComponent } from './tobacco-create/tobacco-create.component';
import {TobaccoRoutingModule} from "./tobacco-routing.module";
import { TobaccoTableComponent } from './tobacco-table/tobacco-table.component';
import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";

@NgModule({
  declarations: [
    TobaccoCreateComponent,
    TobaccoTableComponent
  ],
  imports: [
    CommonModule,
    TobaccoRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule
  ],
})
export class TobaccoModule { }
