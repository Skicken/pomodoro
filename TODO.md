# TODO

## Fixing the authorization interceptor 🤷‍♀️

Need to separate modules where in one requests are not authorized, in second are authorized.
Currently have AuthModule which uses /auth/ api point. Adding new user poses a problem because it needs authorization.

## Spotify Integration (only authorization for now)

In order to use playback api you need to have spotify premium. 

## Need to fix alarm removal, the template does not update it's setting value if alarm is deleted 🤷‍♀️

Need to move default alarm to Server Side, on alarm deletion setting value needs to be updated if it's affected by the change (setting the alert to default value)

Don't really need to move default alarm to Server Side.

## Adding limitation on how many alarms user can have

## Adding more alarm extensions

Currently supported wav, mp3

## Add Incremental Session Timer

## Appearance Settings

## Fixing naming

Alarm->Alert
