## how should this work? in terms of an actual sdk.

## TODO: middleware for min/max auth for device & users (read from a manifest)
## TODO: return confidence % as part of the response. 

### skill skd
1- core service detects that this is the service that should be used for the operation
2- core service passes information about the request via POST request
3- skill recieves the request and determines what operation should be ran within the skill
4- skill performs the operation and returns the result.

#### notes: 
why a post request? wouldn't GRPC be better?.. 
: maybe? lets design it in a way that we can replace the low level request input origin.

i want it to look something like
```js
import SkillHandler, { numberExtractor } from 'orva@core';

const examples = ['one plus one', 'two plus two'];

SkillHandler.HandleSkill(examples, (req, err: function(string)) => {
    const values = numberExtractor(req);

    if(values.length === 0) {
        err('no values to add');
    }
    
    return values.reduce((a, c) => a + c);
})

const port = 3000;
SkillHandler.Start(port)
```

when we are done