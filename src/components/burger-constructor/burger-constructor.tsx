import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';

import { createOrder, resetOrder } from '@services/rootReducer';
import { useDispatch, useSelector } from '@services/store';

import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const constructorState = useSelector((state) => state.burgerConstructor);
  const constructorItems = constructorState ?? { bun: null, ingredients: [] };
  const orderRequest = useSelector((state) => state.burgerConstructor.orderRequest);
  const orderModalData = useSelector((state) => state.burgerConstructor.orderModalData);

  const dispatch = useDispatch();

  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) return;
    const ingredients = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((i) => i._id),
      constructorItems.bun._id,
    ];

    void dispatch(createOrder(ingredients));
  };

  const closeOrderModal = (): void => {
    dispatch(resetOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
