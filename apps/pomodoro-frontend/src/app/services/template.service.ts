import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from './user-service.service';
import { Setting, Template } from '../Model/template-model';
import { Observable, Subject, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { exampleTemplate, mockList } from '../Model/mock-template';
@Injectable({
  providedIn: 'root',
})
export class TemplateService {

  templates: Template[] = [exampleTemplate];

  constructor(private http: HttpClient,private readonly userService: UserService ) {

  }
  UpdateSetting(selectedTemplate: Template, setting: Setting, value: number): Template {
      this.GetTemplates()?.subscribe();
      return selectedTemplate;
  }
  ResetTemplates()
  {
    this.templates = [exampleTemplate];
  }
  GetTemplates() : Observable<Template[]> {
    console.log(this.userService.user)
    if (!this.userService.user) return new Observable<Template[]>;
    this.templates = []
    return this.http
      .get<Template[]>(
        'api/template',
        {
          params: { userID: this.userService.user.id },
        }
      )
      .pipe(
        map((data:Template[]) => {
          data.forEach((element) => {
            const template:Template = new Template();
            template.id = element.id;
            template.isDefault = element.isDefault;
            template.templateName = element.templateName;
            this.templates.push(template)

          });
          return this.templates;
        }),switchMap((templates:Template[])=>{
          const observables = templates.map(template => {
            return this.GetSettings(template.id).pipe(
              switchMap((settings: Setting[]) => {
                template.settings = settings;
                return of(template);
              })
            );
          });

          return forkJoin(observables);
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
        switchMap((data) => {
          const template:Template = new Template();
          template.id = data.id;
          template.isDefault = data.isDefault;
          template.templateName = data.templateName;
          const observable = this.GetSettings(template.id).pipe(switchMap((settings:Setting[])=>
          {
            template.settings = settings;
            return of(template);
          }))
          return observable;
        })
      );
  }
  GetSettings(templateID: number) {
    return this.http.get<Setting[]>(`api/setting-value/`, {
      params: { templateID: templateID },
    });
  }
  GetDefaultTemplate()
  {
    if(this.userService.user)
      return this.http.get(`/template/default/${this.userService.user.id}`);
    return undefined;
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
