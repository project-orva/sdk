### Sdk Utilities
Utilities that are not connected to the core web services.

### Features
- KV Store

### KV Store
KV Store for carrying local data for users.

#### Usage 

__Setting a value for a User Within the Store__
```js
import Store from 'orva-sdk@utilities';

// ... 
const user;
const idOfTheObject; // some id you want to assign to that obj.
const obj; // the object you want to set in the store.

// Note: this can be set & retieved anywhere in the app.
Store.setItem(user, idOfTheObject, obj);
```

__Retrieving from the Store__
```js
import Store from 'orva-sdk@utilities';

// ... 
const user; 
const idOfTheObject; 

Store.getItem(user, idOfTheObject); // returns your previously set item.

```

__Resetting the Store__
```js
import Store from 'orva-sdk@utilities';

Store.reset(); // resets the store application wide.

```