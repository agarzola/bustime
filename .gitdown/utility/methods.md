### .collectRoutesAndStops(callback[, config])
This method builds a comprehensive object which includes all available routes, their directions, and every stop served by each direction in each route. This can be useful if our application needs to check whether a specific stop (or group thereof) is served by a route, or rule out a stop depending on which direction a bus is going. All information associated with routes and stops is included and left intact to make the object as useful as possible.

By default, this method provides an array of route objects. That array looks like this:

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

The direction `id` is set to whatever is returned by your BusTracker API. It can be a number, but also something like `'Inbound'`. This depends on how your BusTracker API is set up to identify route directions.

Alternatively, you could pass a config object as a second argument setting the format to 'object'. This config argument and the resulting object look like this:

``` javascript
var config = {
  format: 'object'
}

// Produces a slightly different object:
{
  '1': {
    rt: '1',
    rtnm: '1 ALTON PARK',
    rtclr: '#cc3399',
    dir: [ 
      { ... },
      { ... }
    ]
  }
}
```
Note the `key:value` pairs, making it easy to reference a specific route’s data by using the route number as the key. Other than this one feature, each route’s object is identical to the ones in the array format. This formatting option just gives you a different way of referencing the reulting object.

**Please note:** In either case, this operation can take a while to complete (up to a few seconds, depending on your API server’s load), so it’s recommended that you run this once while booting up your app (to store in memory) or as part of a data collection script (from which you can commit it to a text file or database for later consumption). Otherwise, you risk performance issues in your application.
