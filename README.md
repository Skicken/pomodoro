# Pomodoro


## Description
A pomodoro timer with higly customizable template (basically a project you want to work on) system. Template defines settings like pomodoro time, short break time, long break time etc. One template might use settings from a different template to make settings to be more flexible and not so tiresome to create. Each user gets basic user default template which can be modified but can not be deleted. Each new created template will use these default settings, but the settings can be overriden by other template setting or user specified setting.

Note: Session is finished pomodoro without break.

## Template Settings

|      Template setting      | Type   | category       |                                    Description                                   | Default |
|:--------------------------:|--------|----------------|:--------------------------------------------------------------------------------:|---------|
|        Template Name       | String | -              |                                                                                  | Default |
|        Pomodoro time       | int    | general        | time specified in minutes                                                        | 25      |
|      Short break time      | int    | general        | time specified in minutes                                                        | 5       |
|       Long break time      | int    | general        | time specified in minutes                                                        | 10      |
| Sessions before long break | int    | general        |                                                                                  | 3       |
|     Pomodoro autostart     | bool   | general        | should pomodoro start when break ends                                            | false   |
|       Break autostart      | bool   | general        | should break start when pomodoro ends                                            | false   |
|       Pomodoro alert       | int    | alert          | specifies alert(sound effect) id which will be used when<br>break ends           |         |
|    Pomodoro alert volume   | int    | alert          |                                                                                  | 100     |
|         Break alert        | int    | alert          | specifies alert(sound effect) id which will be used when<br>pomodoro ends.       |         |
|     Break alert volume     | int    | alert          |                                                                                  | 100     |
|    Enable chain template   | bool   | template chain | enables template chaining, automatic template session switching<br>on condition. |         |
|        Set Template        | int    | template chain | id of template to be switched                                                    |         |
|    AfterCurrentSessions    | int    | template chain | number of whole sessions(pomodoro + break) before switch occurs                  |         |
|      Background color      | int    | apperance      | specifies background id color which will be used                                 |         |
|      Spotify playlist      | int    | spotify        | playlist which will be played on session. <br>Needs spotify integration.         |         |
|  Play spotify on pomodoro  | bool   | spotify        |                                                                                  |         |
|    Play spotify on break   | bool   | spotify        |                                                                                  |         |








## Technology Stack

## Preview