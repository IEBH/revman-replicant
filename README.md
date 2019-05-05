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


Contributing
============
Revman-Replicant grammar files are HTML files with [handlebars](https://handlebarsjs.com) syntax.


**Translations:**:

To contribute a translation to the Revman-Replicant project the best way to start is to examine the base [English Revman grammar](./grammars/hal-en.html) and translate that into your own language, then submit a standard [pull request](https://help.github.com/en/articles/about-pull-requests) to this repository. Alternatively you can copy that file, translate it and just [email it to us](mailto:matt_carter@bond.edu.au) and we can perform the merge on your behalf.


**Other syntax packs:**

Please submit a [pull request](https://help.github.com/en/articles/about-pull-requests) so we can double-check before we adapt your code.

If you are unfamiliar with Git, you can just alter the [base Revman grammar file](./grammars/hal-en.html) as and [send it to us](mailto:matt_carter@bond.edu.au) directly and we can merge it in on your behalf.



**Advanced syntax:**

In addition to the regular [handlebars syntax](https://handlebarsjs.com) this project exposes the following utility functions:


formatLowerCase key
-------------------
Convert a given object key value to lower case.

```html
{{formatLowerCase effectMeasureText}} was the effect measure used.
```


formatP key
-----------
Output a P value based on the regular decimal-formatting rules for P-values.

```html
P value is {{formatP p}}).
```


formatNumber key decimalPrecision
---------------------------------
Format a given object key by an optional precision.

```html
This outcome had moderate levels of heterogeneity (I<sup>2</sup> = {{formatNumber i2 2}}%).
```


ifMultiple key
--------------
Parse the inner content of the tag only if there are multiple sub-items under the `key` specified.

```html
{{#ifMultiple analysesAndData.comparison}}
	For this review we generated {{formatNumber analysesAndData.comparison.length}} comparisons.
{{/ifMultiple}}
```


ifNone key
----------
Parse the inner content of the tag only if there are no sub-items under the `key` specified.

```html
{{#ifNone study}}
	No studies reported sufficient data for this outcome.
{{/ifNone}}
```


ifSingle key
------------
Parse the inner content of the tag only if there is exactly one sub-item under the `key` specified.

```html
{{#ifSingle analysesAndData.comparison}}
	For this review we generated a single comparison.
{{/ifSingle}}
```


ifValue var1 condition var2
---------------------------
Parse the inner content of the tag only if `var1` matches the specified `condition` against `var2`.

```html
{{#ifValue estimable '===' false}}
	The effect estimate could not be calculated.
{{/ifValue}}
```


Valid expressions are listed below:

| Expression                      | Description                                                           |
|---------------------------------|-----------------------------------------------------------------------|
| `ifValue a "=" b`               | Only parse the content if `a` is approximately equal to `b`           |
| `ifValue a "==" b`              | As above                                                              |
| `ifValue a "eq" b`              | As above                                                              |
| `ifValue a "===" b`             | Is the exact same as                                                  |
| `ifValue a "unDefOr" b`         | If `a` is undefined or is the same as `b`                             |
| `ifValue a "<" b`               | If `a` is numerically less than `b`                                   |
| `ifValue a "lt" b`              | As above                                                              |
| `ifValue a "<=" b`              | If `a` is numerically less or equal to `b`                            |
| `ifValue a "lte" b`             | As above                                                              |
| `ifValue a ">" b`               | If `a` is numerically higher than `b`                                 |
| `ifValue a "gt" b`              | As above                                                              |
| `ifValue a ">=" b`              | If `a` is numerically higher or equal to `b`                          |
| `ifValue a "gte" b`             | As above                                                              |
| `ifValue a "between" "b and c"` | The numerical `a` is higher or equal to `b` and lower or equal to `c` |


pick
----
Choose one of the following options at random. Choices are delimited by line-feeds.

```html
My name is
{{#pick}}
	Tom
	Dick
	Harry
{{/pick}}
```



API
===
This module exposes a single function which can be called with the following table of options. It will return a callback in the usual `(error, response)` style - where response will be the generated abstract.

| Parameter | Type            | Description                                                                                                                                |
|-----------|-----------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| `revman`  | String / Object | Either a (string) path to the RevMan file to use or the already computed object (via the [RevMan](https://github.com/CREBP/revman) module) |
| `grammar` | String          | The path to the grammar file to use to compute the output                                                                                  |


Sample data credits
===================
Thanks to Anneliese Spinks, Paul Glasziou, Chris Del Mar for the sample data set [antibiotics-for-sore-throat](test/data/antibiotics-for-sore-throat.rm5) which forms the supplied testing kit.
