export const scrambleToTwisty = (s) => {
  return s.replace(/.{1}/g, '$&x').slice(0, -1);
};
