# JSON Forms with FigTree Evaluator

Based on [JSON Forms React Seed App](https://github.com/eclipsesource/jsonforms-react-seed), this repo demonstrates one way to integrate [JSON Forms](https://jsonforms.io) with [FigTree Evaluator](https://github.com/CarlosNZ/fig-tree-evaluator) in order to allow more complex form logic (such as dynamic drop-down menus and dynamic text labels).

A published demo of this repo is available at https://carlosnz.github.io/jsonforms-with-figtree-demo.

- Run `yarn install` (or `npm` equivalent) to install the dependencies
- Run `yarn start` (or `npm start`) to launch the demo locally

Please see [FigTree documentation](https://github.com/CarlosNZ/fig-tree-evaluator) for detailed information on how to create FigTree expressions.

The main additions here from the original JSON Forms Seed App are:
- "TextDisplay" renderer for simply displaying text-only information in the form
- "useFigTreeEvaluator" hook, which evaluates both the **json schema** (`schema.json`) and **ui schema** (`uischema.json`) using FigTree. It is re-evaluated whenever `data` (the form state data) changes.
- Evaluate `visible` and `enabled` parameters on each element (in UI Schema), which are compiled into JSON Forms [rules](https://jsonforms.io/docs/uischema/rules). This allows the visible/enabled rules to be specified using FigTree expressions.
- `schema.json` and `uischema.json` have a number of dynamic elements using FigTree expressions.