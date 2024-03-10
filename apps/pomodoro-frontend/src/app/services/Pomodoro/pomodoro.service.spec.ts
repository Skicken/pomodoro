import { SessionService } from './../Session/session.service';
import { TestBed } from '@angular/core/testing';

import { PomodoroService } from './pomodoro.service';
import { AlarmService } from '../Alarm/alarm.service';
import { MockProvider } from 'ng-mocks';
import { PomodoroState, Session } from '../../Model/session-model';
import { of } from 'rxjs';
import { TestTemplate } from './test-template';
import { SpotifyService } from '../Spotify/spotify.service';
import { SettingKey } from '../../Model/template-model';
import { debug } from 'console';
/**
 * @group unit/frontend
 */
describe('PomodoroService', () => {
  let service: PomodoroService;
  beforeEach(() => {

    TestBed.configureTestingModule({
      providers:[
        MockProvider(SessionService,{
          AddSession:(session:Session)=>{
            return of(session);
          }
        }),
        MockProvider(AlarmService,{
          AddAlarm:(file:File)=>{
            return of()
          }
        }),
        MockProvider(SpotifyService,{
        }),
      ]
    });
    service = TestBed.inject(PomodoroService);
    jest.useFakeTimers();

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('pomodoro set template', () => {
    service.SetTemplate(TestTemplate)

    const pomodoro = TestTemplate.GetKey("pomodoro");

    expect(service.currentSession.state).toBe(PomodoroState.SESSION);
    expect(service.pomodoroTimer).toBe(pomodoro*60);
    expect(service.isPlaying).toBe(false)
    expect(service.countDown).toBe(null)

  });
  it('simulate pomodoro session', () => {

    service.SetTemplate(TestTemplate)
    service.StartPlaying();

    const pomodoro = TestTemplate.GetKey("pomodoro");
    const shortBreak = TestTemplate.GetKey("shortBreak");
    jest.advanceTimersByTime(pomodoro*60*1000+1000)

    expect(service.isPlaying).toBe(false)
    expect(service.countDown).toBe(null)
    expect(service.currentSession.state).not.toBe(PomodoroState.SESSION)
    expect(service.pomodoroTimer).toBe(shortBreak*60);

  });
  it('simulate autostart', () => {

    TestTemplate.SetKey(SettingKey.breakAutostartKey,1)
    TestTemplate.SetKey(SettingKey.pomodoroAutostartKey,1)

    service.SetTemplate(TestTemplate)
    service.StartPlaying();

    const pomodoro = TestTemplate.GetKey("pomodoro");
    const shortBreak = TestTemplate.GetKey("shortBreak");

    jest.advanceTimersByTime(pomodoro*60*1000)
    jest.advanceTimersByTime(shortBreak*60*1000-5000)


    expect(service.currentSession.state).not.toBe(PomodoroState.SESSION)

    expect(service.isPlaying).toBe(true)
    expect(service.countDown).not.toBe(null)
    expect(service.pomodoroTimer).toBeLessThanOrEqual(6)
    expect(service.pomodoroTimer).toBeGreaterThanOrEqual(5)
  });

  it('long break after sessions', () => {
    TestTemplate.SetKey(SettingKey.breakAutostartKey,1)
    TestTemplate.SetKey(SettingKey.pomodoroAutostartKey,1)

    service.SetTemplate(TestTemplate)
    service.StartPlaying();

    const pomodoro = TestTemplate.GetKey(SettingKey.pomodoroKey);
    const shortBreak = TestTemplate.GetKey(SettingKey.shortBreakKey);
    const sessionsBeforeLongBreak = TestTemplate.GetKey(SettingKey.sessionsBeforeLongBreakKey);
    jest.advanceTimersByTime((pomodoro+shortBreak)*sessionsBeforeLongBreak*60*1000+1000)

    expect(service.isPlaying).toBe(true)
    expect(service.countDown).not.toBe(null)
    expect(service.currentSession.state).not.toBe(PomodoroState.LONG_BREAK)
  });
  it('Time precision (1 second error allowed)', () => {
    TestTemplate.SetKey(SettingKey.breakAutostartKey,1)
    TestTemplate.SetKey(SettingKey.pomodoroAutostartKey,1)

    service.SetTemplate(TestTemplate)
    service.StartPlaying();

    const pomodoro = TestTemplate.GetKey(SettingKey.pomodoroKey);
    for(let i = 0;i<pomodoro*60;i++)
    {
      expect(service.pomodoroTimer).toBe(pomodoro*60-i)
      jest.advanceTimersByTime(1000)
    }

  });

});
