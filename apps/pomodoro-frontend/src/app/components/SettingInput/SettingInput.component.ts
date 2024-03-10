
import { Observable, BehaviorSubject } from 'rxjs';

import { AuthService } from './../../modules/auth/auth.service';
import { Setting } from './../../Model/template-model';

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TemplateService } from '../../services/Template/template.service';
import { MatDialog } from '@angular/material/dialog';

export interface Item {
  id: number;
  displayName: string;
}
export interface Binding {
  templateID: number;
}
@Component({
  selector: 'setting-input',
  templateUrl: './SettingInput.component.html',
  styleUrl: './SettingInput.component.css',
})
export class InputMinutesComponent{
  @Input({ required: true }) settingName: string = '';
  @Input() label: string = 'Minutes';
  @Input() type: 'number' | 'list-id' | 'toggle' | 'slider' =
    'number';
  @Input() listItems: BehaviorSubject<Item[] | null> = new BehaviorSubject<Item[] | null>([]);
  @Input() minValue:number = 1;
  @Input() maxValue:number = 1440;
  @Output() valueChange = new EventEmitter<Setting>();
  @Output() boundChange = new EventEmitter<Setting>();
  @Input({ required: true }) setting!: Setting;
  @Input() isDefault: boolean = false;
  @Input() binding: Observable<Item | null> = new Observable<Item | null>;
  @Input() disabled:boolean = false;
  boundTo: Item | null = null;
  constructor(
    public authService: AuthService,
    private templateService: TemplateService,
    public dialog: MatDialog,

  ) {}
  formatLabel(value: number): string {
    return value.toString() + '%';
  }
  setValue() {

    if ( Number.isInteger(this.setting.value) &&
      ( this.type == 'number' && <number>this.setting.value < this.minValue) ||
      <number>this.setting.value > this.maxValue
    ) {
      this.setting.value = 1;
      return;
    }
    if(this.type=='toggle')
    {
      this.setting.value = +!!this.setting.value;
    }
    this.valueChange.emit(this.setting);
  }

  EmitBinding() {
    this.boundChange.emit(this.setting);
  }
}
