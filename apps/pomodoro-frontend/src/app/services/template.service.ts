import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Setting, Template } from '../Model/template-model';
import { Observable, forkJoin, map, of, switchMap, tap, Subject, BehaviorSubject } from 'rxjs';
import { exampleTemplate } from '../Model/mock-template';
import { User } from '../Model/user-model';
import { GetStorageTemplate } from './helper';
@Injectable({
  providedIn: 'root',
})
export class TemplateService {

  templates$: BehaviorSubject<Template[]> = new BehaviorSubject<Template[]>([])
  constructor(private http: HttpClient) {
    this.GetUserTemplates().subscribe();
  }
  UpdateSetting(setting: Setting, value: number) {
      return this.http.put<Template>(`api/setting-value/${setting.id}`,{value:value})
  }
  GetUserTemplates() : Observable<Template[]> {

    const userStorage = localStorage.getItem('user');
    if (!userStorage){
      const template = GetStorageTemplate()
      if(template)
      {
        this.templates$.next([template]);
        return of([template]);
      }
      this.templates$.next([exampleTemplate]);
      return of([exampleTemplate]);
    }
    const user:User = JSON.parse(userStorage);

    return this.http
      .get<Template[]>(
        'api/template',
        {
          params: { userID: user.id },
        }
      )
      .pipe(
        map((data:Template[]) => {
          const templates:Template[] = [];
          data.forEach((element) => {
            const template:Template = new Template();
            template.id = element.id;
            template.isDefault = element.isDefault;
            template.templateName = element.templateName;
            templates.push(template)

          });
          return templates;
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
        }),tap((templates:Template[])=>{
          this.templates$.next(templates);
        })
      );
  }
  AddTemplate(template: { templateName: string; }) {
    console.log(template)
    return this.http.post<Template>("api/template",template);
  }

  GetTemplate(templateID: number) {
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

  Bind(template: Template, setting: Setting, to: Setting | undefined = undefined) {
    if (template.isDefault) return;
    return this.http
      .put(`api/template/${template.id}`, { from: setting.id, to: to?.id });
  }
  DeleteTemplate(template: Template) {
    if (template.isDefault) return;
    return this.http.delete(`api/template/${template.id}`);
  }
}
