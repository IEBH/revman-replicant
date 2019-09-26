Contributing Translations
=========================
The best way to contribute a translation to the Revman-Replicant project is to examine the [base English Revman grammar](../grammars/hal-en.html) and translate that into your own language, then submit a standard [pull request](https://help.github.com/en/articles/about-pull-requests) to this repository. Alternatively you can copy that file, translate it [email it to us](mailto:matt_carter@bond.edu.au) and we can perform the merge on your behalf.


For example here is a section from the introduction of the standard base English grammar:

```html
{{#ifMultiple analysesAndData.comparison}}
	{{#pick}}
		For this review we generated {{formatNumber analysesAndData.comparison.length}} comparisons.
		{{formatNumber analysesAndData.comparison.length}} comparisons were used in this review.
		We specified {{formatNumber analysesAndData.comparison.length}} comparisons.
		We specified {{formatNumber analysesAndData.comparison.length}} comparisons in this review.
		{{formatNumber analysesAndData.comparison.length}} comparisons are included in this review.
		For this review we examined {{formatNumber analysesAndData.comparison.length}} comparisons.
		This review involved {{formatNumber analysesAndData.comparison.length}} comparisons.
	{{/pick}}
{{/ifMultiple}}
{{#ifSingle analysesAndData.comparison}}
	{{#pick}}
		For this review we generated a single comparison.
		A single comparison was used in this review.
		This review involved only one planned comparison.
		For this review we examined a single comparison.
		For this review we specified a single comparison.
		This review involved one planned comparison.
		A single comparison is included in this review.
	{{/pick}}
{{/ifSingle}}
```

In the above it is not necessary to understand the [advanced syntax](./GRAMMAR-API.md) but only that those individual lines need translating into their equivelent translations. Any items within two braces (e.g. `{{this}}`) is replaced with a value from the original data set, so it is not necessary to translate those, only the text around those sections.


---

**[Back to Table of Contents](../README.md)**
