Revman-Replicant
================
Auto-generate randomized abstract style content from the "Data and Analysis" section of RevMan files.

This project takes in a RevMan file, combines it with a suitable [grammar](./grammar) and returns a HTML page of generated content.



```javascript
var revmanReplicant = require('revman');

revmanReplicant({
	revman: './test/data/antibiotics-for-sore-throat.rm5',
	grammar: './grammars/hal-en.html',
}, function(err, res) {
	// Res should now be a Abstract-suitable HTML string
});
```


See the [test](./test) directory for more complex usage examples.


API
===
This module exposes a single function which can be called with the following table of options. It will return a callback in the usual `(error, response)` style - where response will be the generated abstract.

| Parameter | Type            | Description                                                                                                                                |
|-----------|-----------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| `revman`  | String / Object | Either a (string) path to the revman file to use or the already computed object (via the [RevMan](https://github.com/CREBP/revman) module) |
| `grammar` | String          | The path to the grammar file to use to compute the output                                                                                  |


Sample data credits
===================
Thanks to Anneliese Spinks, Paul Glasziou, Chris Del Mar for the sample data set [antibiotics-for-sore-throat](test/data/antibiotics-for-sore-throat.rm5) which forms the supplied testing kit.
