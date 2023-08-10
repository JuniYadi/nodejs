export {};

declare global {
  interface IDecorator {
    type: string;
    required: boolean;
    default?: any;
  }
}
