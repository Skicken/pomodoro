import { TemplateService } from './../../services/Template/template.service';
import { Component, Input, OnInit } from '@angular/core';
import { Session } from '../../Model/session-model';
import { Template } from '../../Model/template-model';
import { SessionService } from '../../services/Session/session.service';
@Component({
  selector: 'pomodoro-chart-report',
  templateUrl: './chart-report.component.html',
  styleUrl: './chart-report.component.css',
})
export class ChartReportComponent implements OnInit {
  @Input({ required: true })
  sessions: Session[] | null = [];
  selectedTemplate: Template | undefined = undefined;
  timeChart: { name: string; series: { name: string; value: number }[] }[] = [];

  constructor(
    public templateService: TemplateService,
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    this.templateService.templates$.subscribe((templates: Template[]) => {
      if (templates.length > 0) this.selectedTemplate = templates[0];
    });
    this.SetWeekChartData();
  }

  SetWeekChartData() {
    this.sessionService
      .GetSessions()
      .subscribe((sessions: Session[] | null) => {
        sessions?.forEach((session) => {
          const startDate: string = new Date(session.startTime).toDateString();
          let day = this.timeChart.find((element) => {
            return element.name == startDate;
          });
          if (!day) {
            this.timeChart.push({ name: startDate, series: [] });
            day = this.timeChart.find((element) => {
              return element.name == startDate;
            });
          }
          const templateName: string = session.template!.templateName;
          let templateData = day?.series.find((template) => {
            return template.name === templateName;
          });
          if (!templateData) {
            day?.series.push({ name: templateName, value: 0 });
            templateData = day?.series.find((template) => {
              return template.name === templateName;
            });
          }

          templateData!.value += Math.round(
            (new Date(session.endTime).getTime() -
              new Date(session.startTime).getTime()) /
              1000 /
              60
          );
        });
        this.timeChart = [...this.timeChart]
      });
  }
  UpdateSelected() {}
}
