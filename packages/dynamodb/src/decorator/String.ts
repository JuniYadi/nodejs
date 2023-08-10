export const String = (
  options: IDecorator = { type: "string", required: false }
) => {
  return (target: any, propertyKey: string) => {
    console.log("String", target, propertyKey);
  };
};
