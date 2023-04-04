import { JsonSchema, UISchemaElement } from '@jsonforms/core';
import FigTreeEvaluator from 'fig-tree-evaluator';
import { checkDate } from './customFunctions';
import { useState, useEffect, useMemo } from 'react';
import { replaceRules, traverseSchema } from './helpers';

interface EvaluatedSchemas {
  evaluatedSchema: JsonSchema | undefined;
  evaluatedUiSchema: UISchemaElement | undefined;
}

export type UnevaluatedSchema = { [key: string]: any };

const fig = new FigTreeEvaluator({ evaluateFullObject: true, functions: { checkDate } });

export const useFigTreeEvaluator = (data: any, schema: UnevaluatedSchema, uischema: UnevaluatedSchema) => {
  const [evaluatedSchemas, setEvaluatedSchemas] = useState<EvaluatedSchemas>({
    evaluatedSchema: undefined,
    evaluatedUiSchema: undefined,
  });

  const [simplifiedRulePaths, schemaNodePaths, uischemaNodePaths] = useMemo(() => {
    const rulePaths: string[] = [];
    const schemaNodePaths: string[] = [];
    const uischemaNodePaths: string[] = [];
    traverseSchema(schema, rulePaths, schemaNodePaths);
    traverseSchema(uischema, rulePaths, uischemaNodePaths);
    return [rulePaths, schemaNodePaths, uischemaNodePaths];
  }, [schema, uischema]);

  useEffect(() => {
    // Evaluate rule nodes, and update EvaluatedSchemas

    // Evalute schema notes and update Evaluatedsch

    const evaluatedSchema = fig.evaluate(schema, { data }) as Promise<JsonSchema>;
    const evaluatedUiSchema = fig.evaluate(uischema, { data }) as Promise<UISchemaElement>;

    Promise.all([evaluatedSchema, evaluatedUiSchema]).then(([evaluatedSchema, evaluatedUiSchema]) => {
      replaceRules(evaluatedUiSchema, simplifiedRulePaths);
      setEvaluatedSchemas({ evaluatedSchema, evaluatedUiSchema });
    });
  }, [data]);

  return evaluatedSchemas;
};
