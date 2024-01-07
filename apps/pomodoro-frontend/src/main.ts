
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { PomodoroModule } from "./app/pomodoro.module";



platformBrowserDynamic()
  .bootstrapModule(PomodoroModule)
  .catch((err) => console.error(err));
