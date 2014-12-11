## Request methods
There are two ways to make requests to the API using this library:

1. **Using an endpoint-specific method:** This is the preferred way if you’d like to use the added services that `bustime` offers for each. For example, all endpoint-specific methods validate your request parameter object by default according to the needs of that endpoint, to avoid faulty requests made to the API (this can be turned off by on a per-method basis). Additionally, some of the methods offer special services that you can choose to turn on.
2. **Using the generic `.request()` method:** This method makes a request to the API and converts the XML response into a JavaScript object. It offers nothing more than that. This is the method that each of the dedicated methods described above use to make requests between validating and performing additional services on the resulting data.
