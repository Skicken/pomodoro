import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from './user-service.service';
import { Setting, Template } from '../Model/template-model';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  templates: Template[] = [];
  currentPomodoroTemplate:Template | null = null;


  constructor(private userService: UserService, private http: HttpClient) {

  }
  GetTemplates() {
    if (!this.userService.user) return;
    this.templates = [];
    return this.http
      .get<{ id: number; isDefault: boolean; templateName: string }[]>(
        'api/template',
        {
          params: { userID: this.userService.user.id },
        }
      )
      .pipe(
        map((data) => {
          data.forEach((element) => {
            const temp: Template = new Template();
            temp.id = element.id;
            temp.isDefault = element.isDefault;
            temp.templateName = element.templateName;
            this.GetSettings(temp.id).pipe(
              map((settings) => {
                settings.forEach((setting) => {
                  temp.settings.push(setting);
                });
              })
            );
            console.log(temp);
            this.templates.push(temp);
          });
        })
      );
  }
  SetCurrentTemplate(template:Template)
  {

  }
  GetTemplate(templateID: number) {
    if (!this.userService.user) return;
    return this.http
      .get<{ id: number; isDefault: boolean; templateName: string }>(
        `api/template/${templateID}`,
        {}
      )
      .pipe(map((data) => {
          const template = new Template();
          template.id = data.id;
          template.isDefault = data.isDefault;
          template.templateName = data.templateName;
          this.GetSettings(template.id).subscribe(settings=>{
            template.settings = settings;
          })
          return template;
      }));
  }
  GetSettings(templateID: number) {
    return this.http.get<Setting[]>(`api/setting-value/`, {
      params: { templateID: templateID },
    });
  }

  Bind(template: Template, setting: Setting, to: Setting) {
    if (template.isDefault) return;
    return this.http
      .put(`api/template/${template.id}`, { from: setting.id, to: to.id })
      .pipe(
        map(() => {
          this.GetTemplates();
        })
      );
  }
  DeleteTemplate(template: Template) {
    if (template.isDefault) return;
    return this.http.delete(`api/template/${template.id}`).pipe(
      tap(() => {
        this.GetTemplates();
      })
    );
  }
}
