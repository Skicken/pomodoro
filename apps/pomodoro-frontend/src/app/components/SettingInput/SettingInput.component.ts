import { TemplateService } from './../../../../../pomodoro-backend/src/app/Modules/pomodoro/Services/Template/template.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from './../../modules/auth/auth.service';
import { TemplateService } from '../../services/template.service';
import { Setting, Template } from './../../Model/template-model';

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectTemplateDialogComponent } from '../SelectTemplateDialog/select-template-dialog.component';

export interface Item
{
  id:number;
  displayName:string;
}
export interface Binding
{
  templateID:number,

}

@Component({
  selector: 'setting-input',
  templateUrl: './SettingInput.component.html',
  styleUrl: './SettingInput.component.css',
})
export class InputMinutesComponent {

  @Input({required:true}) settingName:string = '';
  @Input() listLabel:string = ''
  @Input({required:true}) type:'minutes'| 'list-id' | 'toggle' | 'slider' = 'minutes'
  @Input() listItems:Item[] = []
  @Output() valueChange = new EventEmitter<number>();
  @Output() boundChange = new EventEmitter<Template>();
  @Input() setting!:Setting
  @Input() value:number = 0;
  @Input() isDefault:boolean = false;
  @Input() BoundTo:Item | undefined = undefined;
  constructor(public authService:AuthService,private templateService:TemplateService,private dialog: MatDialog){}

  formatLabel(value: number): string {
      return value.toString()+ '%';
  }

  setValue()
  {
    if(this.type=='minutes' && this.value<=0 || this.value>1440 ) return;
    this.valueChange.emit(this.value);
  }
  setBinding()
  {
    const dialogRef = this.dialog.open(SelectTemplateDialogComponent)
    dialogRef.afterClosed().subscribe(selectedTemplate=>{
      if(selectedTemplate)
      {
        this.boundChange.emit(selectedTemplate)
      }
    })
  }

}
