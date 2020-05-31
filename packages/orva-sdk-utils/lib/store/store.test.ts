import Store from './index';

describe('Store', () => {
  const ids = ['one', 'two', 'three'];
  const objs = [{ toast: 'one' }, { toast: 'f' }, { toast: 'fff' }];
  const user = 'guy';

  afterEach(() => {
    Store.reset();
  });

  it(`should correctly get & set 3 items`, () => {
    ids.forEach((id, i) => {
      Store.setItem(user, id, objs[i]);
    });

    ids.forEach((id, i) => {
      const item = Store.getItem(user, id);
      expect(item).toEqual(objs[i]);
    });
  });

  it('should be reset if the reset method is called', () => {
    ids.forEach((id, i) => {
      Store.setItem(user, id, objs[i]);
    });
    Store.reset();

    expect(Store.store).toStrictEqual({});
  });
});
