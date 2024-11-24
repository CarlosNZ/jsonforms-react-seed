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

const mapObject = (
  sourceObject: Record<string, unknown>,
  propertyMap: Record<string, string>,
) => {
  const output: Record<string, unknown> = {};
  Object.entries(propertyMap).forEach(([key, path]) => {
    const mappedValue = extractProperty(sourceObject, path, null);
    output[key] = mappedValue;
  });
  return output;
};

const mapObjects = (
  sourceObjects: Record<string, unknown>[],
  propertyMap: Record<string, string>,
) => sourceObjects.map(obj => mapObject(obj, propertyMap));

export { checkDate, mapObject, mapObjects };
