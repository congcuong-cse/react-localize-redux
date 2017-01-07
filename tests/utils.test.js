import { shallow } from 'enzyme';
import * as utils from 'utils';

describe('locale utils', () => {

  describe('getLocalizedElement', () => {
    it('should return element with localized string', () => {
      const translations = { test: 'Here is my test' };
      const result = shallow(utils.getLocalizedElement('test', translations));
      expect(result.find('span').length > 0).toBe(true);
      expect(result.find('span').html()).toEqual(`<span>${translations.test}</span>`);
    });

    it('should return element with warning when no localized string found', () => {
      const translations = { test: 'Here is my test' };
      const key = 'test2';
      const result = shallow(utils.getLocalizedElement(key, translations));
      expect(result.find('span').length > 0).toBe(true);
      expect(result.find('span').html()).toEqual(`<span>Missing locaized: ${key}</span>`);
    });
  });

  describe('isDefinedNested', () => {
    it('should return false on empty first prop', () => {
      const test = { test: 'this' };
      const result = utils.isDefinedNested(test, 'empty');
      expect(result).toBe(false);
    });

    it('should return first prop', () => {
      const test = { test: 'this' };
      const result = utils.isDefinedNested(test, 'test');
      expect(result).toBe('this');
    });

    it('should return second prop', () => {
      const test = { test: { test2: 'this' } };
      const result = utils.isDefinedNested(test, 'test', 'test2');
      expect(result).toBe(true);
    });

    it('should return false nested prop', () => {
      const test = { test: { test2: 'this' } };
      const result = utils.isDefinedNested(test, 'test', 'test3');
      expect(result).toBe(false);
    });
  });
  
});