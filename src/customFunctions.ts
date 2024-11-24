import extractProperty from 'object-property-extractor';

const checkDate = (date: string) => {
  const selected = new Date(date);
  const current = new Date();
  selected.setHours(0, 0, 0, 0);
  current.setHours(0, 0, 0, 0);

  const selectedTime = selected.getTime();
  const currentTime = current.getTime();

  if (selectedTime === currentTime) return 0;

  return selectedTime > currentTime ? 1 : -1;
};

/*
Replaces substrings identified as ${"property"} with values from "data".
"property" can be a nested object property e.g "user.name".
Note: If substring contains no property name (i.e. '${}') and "data" is not an
Object, the whole item will be inserted.
*/
export const substituteValues = (
  parameterisedString: string,
  data: { [key: string]: any | string },
  index?: number,
): string => {
  // Custom replacement function for regex replace
  const getObjectProperty = (_: string, __: string, property: string) => {
    if (property === '0' && index !== undefined) return String(index + 1);
    if (typeof data !== 'object') return data;
    let value = extractProperty(
      data,
      property,
      `Can't find property: ${property}`,
    );
    return value ?? '';
  };

  // Match ${...} using regex and replace ... with property from object
  return parameterisedString.replace(/(\${)(.*?)(})/gm, getObjectProperty);
};

const mapObject = (
  sourceObject: Record<string, unknown>,
  propertyMap: Record<string, string>,
) => {
  const output: Record<string, unknown> = {};
  Object.entries(propertyMap).forEach(([key, valueString]) => {
    const mappedValue = substituteValues(valueString, sourceObject);
    output[key] = mappedValue;
  });
  return output;
};

const mapObjects = (
  sourceObjects: Record<string, unknown>[],
  propertyMap: Record<string, string>,
) => sourceObjects.map(obj => mapObject(obj, propertyMap));

export { checkDate, mapObject, mapObjects };
