<p align="center">
  <a href="" rel="noopener">
 <img src="https://avatars2.githubusercontent.com/u/53947571?s=200&v=4"  alt="Icebox Logo"></a>
</p>

<h1 align="center">Orva SDK</h1>

This package set provides modules for developing skills and service devices registed with orva.

## Running
### Tests
`npm test` tests are written with jest.

## Documentation

### Modules
#### Core
The core module provides support for creating/ registering a skill with orva.

##### Basic Usage:
__Visit the core readme for advanced usage__

To register a skill operation within the skill, first provide examples of sample text be compared with when choosing what operation to be ran. 

More examples = higher confidence.

```js
import Skill from '@orva-sdk/core';

const exampleMessages = ['who am i', 'what is my id'];
Skill.handleSkill(exampleMessages, (req, err) => {
    if(!req.UserID) {
        err('Cannot find UserID');
    }

    return req.UserID;
})

const port = 3000;
Skill.start(port);

```

#### Services
Services module is used to interact with orva core services.
__Visit services readme for advanced usage__

##### Supported Services
- Core Service
- Profile Service

##### Core Basic Usage

```js
import { CoreHandler } from '@orva-sdk/services';

// ...

const coreHandlerURI = 'http://...'; 

const coreRequest = {
    userID: 'id_of_user',
    deviceID: 'id_of_device',
    message: 'how are you doing?',
}

const coreService = new CoreHandler(coreHandlerURI);
const response = await coreService.processStatement(coreRequest);
/*
Output
[
    {
        Statement: 'fine, thanks for asking',
        GraphicURL: '',
        GraphicType: '',
        Error: '',
    }
]
*/
```
##### Profile Basic Usage
```js
import { ProfileService } from '@orva-sdk/services';

//...

const userID = 'some_user';

const profileServiceURI = 'http://...';

const profileService = new ProfileService(profileServiceURI);
const user = await profileService.getUser(userID);
/*
    Output
    {
        CreatedOn: '',
        AccountID: '',
        BlockAddress: '',
    }
*/

```

#### Utilities
Basic utilities for designing skills.

- Store

##### Store Basic Usage
The store provides a basic store for persisting user state throughout sessions.

```js
import { store } from '@orva-sdk/utilities';

//...
const user = 'userid';

// set storage
store.setItem(user, 'question1', 'answer1');

// get from storage
const lastAnswer = store.getItem(user, 'question1');
/*
    Output -> 'answer1'
*/

```







