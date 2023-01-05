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

export { checkDate };
