import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from './user-service.service';
import { Setting, Template } from '../Model/template-model';
import { map, tap } from 'rxjs';
import { exampleTemplate, mockList } from '../Model/mock-template';



@Injectable({
  providedIn: 'root',
})
export class TemplateService {

  templates: Template[] = mockList;
  defaultTemplate:Template = exampleTemplate;

  constructor(private userService: UserService, private http: HttpClient) {}
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
            const template:Template = new Template();
            template.id = element.id;
            template.isDefault = element.isDefault;
            template.name = element.templateName;
            this.GetSettings(template.id).pipe(
              map((settings) => {
                settings.forEach((setting) => {
                  template.settings.push(setting);
                });
              })
            );
            console.log(template);
            this.templates.push(template);
          });
        })
      );
  }
  AddTemplate(template: { templateName: any; }) {
    throw new Error('Method not implemented.');
  }
  SetCurrentTemplate(template: Template) {}
  GetTemplate(templateID: number) {
    if (!this.userService.user) return;
    return this.http
      .get<Template>(
        `api/template/${templateID}`,
        {}
      )
      .pipe(
        map((data) => {
          const template:Template = new Template();
          template.id = data.id;
          template.isDefault = data.isDefault;
          template.name = data.name;
          this.GetSettings(template.id).subscribe((settings) => {
            template.settings = settings;
          });
          return template;
        })
      );
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
