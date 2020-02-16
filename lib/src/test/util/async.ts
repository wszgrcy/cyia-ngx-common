export function delay(number: number) {
  return new Promise((res) => {
    setTimeout(() => {
      res(number);
    }, number);
  });
}
