import { JsonSchema, UISchemaElement } from '@jsonforms/core';
import FigTreeEvaluator from 'fig-tree-evaluator';
import { checkDate } from './customFunctions';
import { useState, useEffect } from 'react';

interface EvaluatedSchemas {
  evaluatedSchema: JsonSchema | undefined;
  evaluatedUiSchema: UISchemaElement | undefined;
}

const fig = new FigTreeEvaluator({ evaluateFullObject: true, functions: { checkDate } });

export const useFigTreeEvaluator = (data: any, schema: { [key: string]: any }, uischema: { [key: string]: any }) => {
  const [evaluatedSchemas, setEvaluatedSchemas] = useState<EvaluatedSchemas>({
    evaluatedSchema: undefined,
    evaluatedUiSchema: undefined,
  });

  useEffect(() => {
    const evaluatedSchema = fig.evaluate(schema, { data }) as Promise<JsonSchema>;
    const evaluatedUiSchema = fig.evaluate(uischema, { data }) as Promise<UISchemaElement>;

    Promise.all([evaluatedSchema, evaluatedUiSchema]).then(([evaluatedSchema, evaluatedUiSchema]) =>
      setEvaluatedSchemas({ evaluatedSchema, evaluatedUiSchema })
    );
  }, [data]);

  return evaluatedSchemas;
};
