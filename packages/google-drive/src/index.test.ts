import { GoogleDrive } from './index';

describe('GoogleDrive', () => {
  it('should log "GoogleDrive" when instantiated', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const googleDrive = new GoogleDrive();
    expect(consoleSpy).toHaveBeenCalledWith('GoogleDrive');
    consoleSpy.mockRestore();
  });
});