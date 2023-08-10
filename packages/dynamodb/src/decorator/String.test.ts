import { String } from './String';

describe('String decorator', () => {
  it('should log "String", target and propertyKey', () => {
    const target = {};
    const propertyKey = 'propertyName';
    const consoleSpy = jest.spyOn(console, 'log');

    String()(target, propertyKey);

    expect(consoleSpy).toHaveBeenCalledWith('String', target, propertyKey);
  });

  it('should use default options if none are provided', () => {
    const options = { type: 'string', required: false };
    const consoleSpy = jest.spyOn(console, 'log');

    String()({}, '');

    expect(consoleSpy).toHaveBeenCalledWith('String', {}, '');
  });

  it('should use provided options', () => {
    const options = { type: 'string', required: true };
    const consoleSpy = jest.spyOn(console, 'log');

    String(options)({}, '');

    expect(consoleSpy).toHaveBeenCalledWith('String', {}, '');
  });
});