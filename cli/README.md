# gcal-cli

CLI tool for Google Calendar services

## Installing

As dependency

```sh
npm install --save remote-gcal-cli
```

Global (recommended)
```sh
npm install -g remote-gcal-cli
```

## Docs

### Authentication

To authenticate to Google Account, run `gcal-cli auth` 

To log out, run `gcal-cli auth --logout` 

### Checkout calendar

To checkout a calendar from authorized Google account, run `gcal-cli checkout`

### Get calendar

To get list of calendars from authorized Google account, run `gcal-cli get-calendar [options]`

There are built-in options

`--table` - View as table

### Create calendar

To create a new calendar, run `gcal-cli create-calendar [options]`

There are built-in options

`--summary <summary>` - Headline of new calendar (required)

`--description [description]` - Description of new calendar

`--timezone [timezone]` - Timezone of new calendar (IANA tz format)

`--location [location]` - Location of new calendar

Example: 

`gcal-cli create-calendar --summary="Calendar #1" --description="test calendar" --timezone="America/New_York" --location="New York"`

### Update calendar

To update existing calendar, run `gcal-cli update-calendar [options]`

There are built-in options

`--summary [summary]` - Headline of updated calendar

`--description [description]` - Description of updated calendar

`--timezone [timezone]` - Timezone of updated calendar (IANA tz format)

`--location [location]` - Location of updated calendar

Example: 

`gcal-cli update-calendar --summary="Updated Calendar" --description="test update calendar" --timezone="America/New_York" --location="New York"`

### Delete calendar

To delete existing calendar, run `gcal-cli delete-calendar`

### Get events

To get list of events from authorized Google account, run `gcal-cli get-events [options]`

There are built-in options

`--from [datetime]` - Get events from (MM-DD-YYYY HH:MM)

`--to [datetime]` - Get events to (MM-DD-YYYY HH:MM)

`--max-results [num]` - Return specfied number of events

`-h, --help ` - output usage information

Make sure to checkout a valid calendar before getting events

Default values:

`--from:` datetime at the moment (24 Hours time)

`--to:` datetime at the end of today (24 Hours time)

`--max-result:` 20

Example: 

`gcal-cli get-events --from="08-01-2019 21:00" --to="08-01-2019 22:00" --max-results=10`

### Create event

To create a new event, run `gcal-cli create-event [options]`

There are built-in options

`--summary <summary>` - Headline of created event

`--from <datetime>` - Start of event (MM-DD-YYYY HH:MM)

`--to <datetime>` - End of event (MM-DD-YYYY HH:MM)

`--color [color]` - Select color in color list for event

`--description [description]` - Description of event

`--location [location]` - Location of event

`-h, --help` - output usage information

Make sure to checkout a valid calendar before getting events

Required parameters: `--summary`, `--from`, `--to`

Default values:

All time are 24 Hours time

`--color`: available colors include:
sky, mint, purple, pink, yellow, orange
turquoise, grey, blue, green, red

Example: 

`gcal-cli create-event --summary="test event #1" --from="08-01-2019 21:00" --to="08-01-2019 22:00" --color="blue"`

### Update event

To update an existing event, run `gcal-cli update-event [options]`

There are built-in options

Start and end options are used to specified the time range of events that is being updated

`--start <datetime>` - Start of event (MM-DD-YYYY HH:MM)

`--end <datetime>` - End of event (MM-DD-YYYY HH:MM)

`--summary [summary]` - Updated headline of event

`--from <datetime>` - Updated start of updated event (MM-DD-YYYY HH:MM)

`--to <datetime>` - Updated end of updated event (MM-DD-YYYY HH:MM)

`--color [color]` - Updated color in color list for event

`--description [description]` - Updated description of event

`--location [location]` - Updated location of event

`-h, --help` - output usage information

Make sure to checkout a valid calendar before getting events

Required parameters: `--start`, `--end`, `--from`, `--to`

Default values:

All time are 24 Hours time

`--color`: available colors include:
sky, mint, purple, pink, yellow, orange
turquoise, grey, blue, green, red

Example

`gcal-cli update-event --summary="test update event #1" --from="08-01-2019 21:00" --to="08-01-2019 22:00" --start="08-01-2019" --end="08-02-2019" --color="blue"`

### Delete event

To delete an existing event, run `gcal-cli delete-event [options]`

There are built-in options

Start and end options are used to specified the time range of events that is being deleted

`--start <datetime>` - Start of event (MM-DD-YYYY HH:MM)

`--end <datetime>` - End of event (MM-DD-YYYY HH:MM)

Make sure to checkout a valid calendar before getting events

Required parameters: `--start`, `--end`

Example: 

`gcal-cli delete-event --start="08-01-2019 21:00" --end="08-01-2019 22:00"`

### Help

To see more help, run `gcal-cli --help`

## Authors

* [Trung Truong](https://github.com/ttrung149)

## License

This project is licensed under the MIT License - see the [LICENSE.txt](LICENSE.txt) file for details
