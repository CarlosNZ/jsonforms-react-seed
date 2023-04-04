import { JsonSchema, UISchemaElement } from '@jsonforms/core';
import extractProperty from 'object-property-extractor';
import assign from 'object-property-assigner';
import { UnevaluatedSchema } from './useFigTreeEvaluator';

const isObject = (value: unknown): value is object => value instanceof Object && value !== null;

const isAliasString = (value: string) => /^\$.+/.test(value);

export const traverseSchema = (
  schema: UnevaluatedSchema | UnevaluatedSchema[],
  rulePaths: string[],
  schemaNodePaths: string[],
  currentPath: string = ''
) => {
  if (Array.isArray(schema)) {
    schema.forEach((elem, idx) => traverseSchema(elem, rulePaths, schemaNodePaths, `${currentPath}[${idx}]`));
    return;
  }

  if (!isObject(schema)) return;

  Object.entries(schema).forEach(([key, value]) => {
    const newPath = currentPath === '' ? key : currentPath + '.' + key;

    if (key === 'visible' || key === 'enabled') {
      rulePaths.push(newPath);
      return;
    }
    if (isAliasString(key) || key === 'operator' || key === 'fragment') {
      schemaNodePaths.push(newPath);
      return;
    }

    traverseSchema(value, rulePaths, schemaNodePaths, newPath);
  });
};

export const replaceRules = (schema: UISchemaElement, paths: string[]) => {
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
