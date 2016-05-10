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


Sample data credits
===================
Thanks to Anneliese Spinks, Paul Glasziou, Chris Del Mar for the sample data set [antibiotics-for-sore-throat](test/data/antibiotics-for-sore-throat.rm5) which forms the supplied testing kit.
