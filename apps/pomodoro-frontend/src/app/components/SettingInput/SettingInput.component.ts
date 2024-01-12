import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface ListItem
{
  id:number;
  displayName:string;
}


@Component({
  selector: 'setting-input',
  templateUrl: './SettingInput.component.html',
  styleUrl: './SettingInput.component.css',
})
export class InputMinutesComponent {

  @Input() settingName:string = '';
  @Input() label:string = ''
  @Input() type:'minutes'| 'list-id' | 'toggle' | 'slider' = 'minutes'
  @Input() listItems:ListItem[] = []
  @Output() valueChange = new EventEmitter<number>();
  @Input() timeValue:string = '00:25'
  @Input() value:number = 0;
  formatLabel(value: number): string {
      return value.toString()+ '%';
  }
  setValue()
  {
    if(this.type=='minutes')
    {
      const h = parseInt(this.timeValue.split(':')[0]);
      const m = parseInt(this.timeValue.split(':')[1]);
      this.value = h*60+m
    }
    this.valueChange.emit(this.value);
  }

}
