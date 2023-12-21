// CartContext.js
import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      return [...state, action.payload];
    case 'REMOVE_FROM_CART':
      return state.filter((itemId) => itemId !== action.payload);
    default:
      return state;
  }
};

const CartProvider = ({ children }) => {
  // Récupérer les données du localStorage pour initialiser le panier
  const localStorageCart = JSON.parse(localStorage.getItem('cart')) || [];
  const [cart, dispatch] = useReducer(cartReducer, localStorageCart);

  // Mettre à jour le localStorage lorsque le panier change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (cardId, amazonPrice, cardmarketPrice, coolstuffincPrice, ebayPrice, tcgplayerPrice) => {
    console.log(amazonPrice);
    console.log(cardmarketPrice);
    console.log(coolstuffincPrice);
    console.log(ebayPrice);
    console.log(tcgplayerPrice);
    console.log(cardId);
    if (amazonPrice === 0 && cardmarketPrice === 0 && coolstuffincPrice === 0 && ebayPrice === 0 && tcgplayerPrice === 0) {
      alert("Cette carte n'es pas disponible à la vente");
      return null;
    }
    dispatch({ type: 'ADD_TO_CART', payload: cardId });
  };

  const removeFromCart = (cardId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: cardId });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart doit être utilisé à l\'intérieur d\'un CartProvider');
  }
  return context;
};

export { CartProvider, useCart };
