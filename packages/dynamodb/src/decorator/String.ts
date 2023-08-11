export function String() {
  return (target: any, propertyKey: string) => {
    console.log("String", target, propertyKey);
  };
}
