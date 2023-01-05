import { JsonSchema, UISchemaElement, rankWith, uiTypeIs } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { Typography } from '@mui/material';

interface TextDisplayProps {
  data: any;
  // handleChange(path: string, value: any): void;
  path: string;
  schema: JsonSchema;
  uischema: UISchemaElement & { text: string };
}

const TextDisplay = ({ data, path, schema, uischema }: TextDisplayProps) => {
  return (
    <div>
      <Typography>{uischema.text}</Typography>
    </div>
  );

  // <Rating value={data} updateValue={(newValue: number) => handleChange(path, newValue)} />;
};

export default withJsonFormsControlProps(TextDisplay as any);

export const textTester = rankWith(
  4, //increase rank as needed
  uiTypeIs('Text')
);
