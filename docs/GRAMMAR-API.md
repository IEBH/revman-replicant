Advanced API guide
==================
In addition to the regular [handlebars syntax](https://handlebarsjs.com) in its grammar files, Replicant exposes the following utility functions:


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


input type description options
------------------------------
Request input from the user.
This is useful if a given field does not exist in a RevMan file.

```html
We examined {{input 'number' 'Number of articles you examined'}} articles.
```

Valid types:

| Type     | Description                                          |
|----------|------------------------------------------------------|
| `choice` | Request that the user pick from one option - options are supplied as the final argument in CSV format |
| `figure` | Request that the user inserts a specific figure here |
| `number` | Allow only numeric inputs                            |
| `text`   | Ask for multi line text input                        |


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
Choose one of the following options at random. Choices are delimited either:

* If multiple lines by line-feeds
* If text is a single line by `a / b / c` notation (i.e. forward slash with spacing)

```html
My name is
{{#pick}}
	Tom
	Dick
	Harry
{{/pick}}

and I am {{#pick}}male / female{{/pick}}
```


---

**[Back to Table of Contents](../README.md)**
