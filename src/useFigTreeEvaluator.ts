/** @format */

import { JsonSchema, Layout, UISchemaElement } from '@jsonforms/core';
import { FigTreeEvaluator } from 'fig-tree-evaluator';
import { checkDate } from './customFunctions';
import { useState, useEffect, useMemo } from 'react';
import extractProperty from 'object-property-extractor';
import assign from 'object-property-assigner';

type UnevaluatedSchema = { [key: string]: any };

interface ExtendedLayout extends Layout {
  elements: (UISchemaElement & { text?: string })[];
}

const fig = new FigTreeEvaluator({ evaluateFullObject: true, functions: { checkDate } });

export const useFigTreeEvaluator = (data: any, schema: UnevaluatedSchema, uischema: UnevaluatedSchema) => {
  const [evaluatedSchema, setEvaluatedSchema] = useState<JsonSchema>();
  const [evaluatedUiSchema, setEvaluatedUiSchema] = useState<ExtendedLayout>({
    type: 'VerticalLayout',
    elements: [{ type: 'Text', text: 'Loading form data...' }],
  });
  // This value prevents the form rendering with an empty schema on first load, otherwise it's just full of "no applicable renderer" errors
  const [schemaEvaluated, setSchemaEvaluated] = useState(false);

  const simplifiedRulePaths = useMemo(() => {
    const paths: string[] = [];
    traverseSchema(uischema, paths, '');
    return paths;
  }, [schema, uischema]);

  useEffect(() => {
    if (schemaEvaluated)
      fig.evaluate(uischema, { data }).then((result) => {
        replaceRules(result as UISchemaElement, simplifiedRulePaths);
        setEvaluatedUiSchema(result as Layout);
      });

    fig.evaluate(schema, { data }).then((result) => {
      setEvaluatedSchema(result as JsonSchema);
      setSchemaEvaluated(true);
    });
  }, [data, simplifiedRulePaths, schemaEvaluated]);

  return { evaluatedSchema, evaluatedUiSchema };
};

const isObject = (value: unknown): value is object => value instanceof Object && value !== null;

const traverseSchema = (schema: UnevaluatedSchema | UnevaluatedSchema[], paths: string[], currentPath: string) => {
  if (Array.isArray(schema)) {
    schema.forEach((elem, idx) => traverseSchema(elem, paths, `${currentPath}[${idx}]`));
    return;
  }

  if (!isObject(schema)) return;

  Object.entries(schema).forEach(([key, value]) => {
    const newPath = currentPath === '' ? key : currentPath + '.' + key;

    if (key === 'visible' || key === 'enabled') {
      paths.push(newPath);
      return;
    }

    traverseSchema(value, paths, newPath);
  });
};

const replaceRules = (schema: UISchemaElement, paths: string[]) => {
  const rules: Map<string, { visible?: boolean; enabled?: boolean }> = new Map();
  paths.forEach((path) => {
    const value = extractProperty(schema, path);

    const matches = path.match(/(^.+)\.(enabled|visible)$/);
    const basePath = matches?.[1] ?? '';
    const type = matches?.[2] ?? '';

    rules.set(basePath, { ...rules.get(basePath), [type]: value });
  });

  rules.forEach((values, basePath) => {
    const { enabled = true, visible = true } = values;
    const ruleType =
      enabled && visible
        ? 'SHOW'
        : enabled && !visible
        ? 'HIDE'
        : !enabled && visible
        ? 'DISABLE'
        : !enabled && !visible
        ? 'HIDE'
        : null;
    // This is a hacky way to circumvent the limitations of JsonForms rules --
    // we're intentionally supplying an invalid condition so that it "falls
    // through" and always returns `true` and we rely on the `ruleType` being
    // changed dynamically instead
    if (ruleType) assign(schema, basePath + '.rule', { effect: ruleType, condition: true });
  });
};
