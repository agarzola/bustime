### .collectRoutesAndStops(callback)
This method builds a comprehensive object which includes all available routes, their directions, and every stop served by each direction in each route. This can be useful if our application needs to check whether a specific stop (or group thereof) is served by a route, or rule out a stop depending on which direction a bus is going. All information associated with routes and stops is left intact to make the object as useful as possible.

The object format is as follows:

```javascript
[
  { rt: '1',
    rtnm: '1 ALTON PARK',
    rtclr: '#cc3399',
    dir: [
      { id: '0',
        stops: [
          { stpid: '1581',
            stpnm: '33RD + CHATTEM',
            lat: '35.017467535463',
            lon: '-85.321669578552'
          },
          { ... }
        ]
      },
      { id: '1',
        stops: [
          { ... },
          { ... }
        ]
      }
    ]
  },
  {
    rt: '2',
    ...
  }
]
```

The direction `id` whatever is returned by your BusTracker API. It can be a number, but also something like `'Inbound'`. This depends on how your BusTracker API is set up to identify route directions.

**Please note:** This operation can take a while (up to a few seconds, depending on your API server’s load), so it’s recommended that you run this once while booting up your app or as part of a data collection script (from which you can commit it to a text file for later consumption). Otherwise, you risk performance issues in your application.
