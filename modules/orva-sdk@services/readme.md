### Sdk Services
Sdk Services are utilities that are connected orva's core web services.


### Profile Service
Profile service is used to retrieve information about the user within the profile. 

__Retrieving Profile__
```js
import ProfileService from 'orva-sdk@services';

const URLToService; // url to the core profile service
const service = new ProfileService(URLToService); 

const IDOfUser = 'thisIsMe';
const profile = await service.getUser(IDOfUser); // returns the profile from orva's core services.
```

