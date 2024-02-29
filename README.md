# Pomodoro


## Description
A pomodoro timer with highly customizable template (a project you want to work on) system. Template defines settings like pomodoro time, short break time, long break time etc. One template might use settings from a different template to make settings to be more flexible and not so tiresome to create. Each user gets basic user default template which can be modified but can not be deleted. Each new created template will use these default settings, the settings can be overridden by other template setting or user specified setting.


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
|      Background color      | int    | apperance      | specifies background id color which will be used                                 |         |





## Spotify integration (not yet implemented)

Spotify integration requires user to have spotify premium. It seems that api does not allow to change the player playlist. It allows to pause and play the playlist.

|      Template setting      | Type   | category       |                                    Description                                   | Default |
|:--------------------------:|--------|----------------|:--------------------------------------------------------------------------------:|---------|
|      Spotify playlist      | int    | spotify        | playlist which will be played on session. <br>Needs spotify integration.         |         |
|  Play spotify on pomodoro  | bool   | spotify        |                                                                                  |         |
|    Play spotify on break   | bool   | spotify        |                                                                                  |         |
