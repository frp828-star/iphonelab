"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

export type CartItem = {
  name: string;
  price: number;
  image: string;
  quantity: number;
  quality?: string | null;
};

type AddToCartItem = Omit<CartItem, "quantity"> & {
  quantity?: number;
};

type CartContextType = {
  cart: CartItem[];

  addToCart: (item: AddToCartItem) => void;

  increaseQuantity: (name: string) => void;

  decreaseQuantity: (name: string) => void;

  removeFromCart: (name: string) => void;

  clearCart: () => void;
};


const CartContext = createContext<
  CartContextType | undefined
>(undefined);



export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [cart, setCart] =
    useState<CartItem[]>([]);

  const [loaded, setLoaded] =
    useState(false);



  // Load Cart
  useEffect(() => {

    try {

      const savedCart =
        localStorage.getItem("cart");


      if (savedCart) {

        const parsedCart =
          JSON.parse(savedCart);


        if (Array.isArray(parsedCart)) {

          const validCart =
            parsedCart.filter(
              (item) =>
                item &&
                typeof item.name === "string" &&
                typeof item.price === "number" &&
                typeof item.image === "string" &&
                typeof item.quantity === "number"
            );


          setCart(validCart);

        }

      }


    } catch(error) {

      console.error(
        "Failed to load cart:",
        error
      );

      localStorage.removeItem("cart");

    } finally {

      setLoaded(true);

    }


  }, []);




  // Save Cart
  useEffect(() => {

    if(!loaded) return;


    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );


  }, [cart, loaded]);




  // Add Cart
  const addToCart = (
    item: AddToCartItem
  ) => {


    const quantityToAdd =
      Math.max(
        1,
        Number(item.quantity ?? 1)
      );



    setCart((prev)=>{


      const existing =
        prev.find(
          (product)=>
            product.name === item.name &&
            product.quality === item.quality
        );



      if(existing){


        return prev.map(
          (product)=>

            product.name === item.name &&
            product.quality === item.quality

            ?

            {
              ...product,
              quantity:
                product.quantity +
                quantityToAdd,
            }

            :

            product

        );

      }



      return [

        ...prev,

        {

          name:
            item.name,

          price:
            Number(item.price),

          image:
            item.image,

          quantity:
            quantityToAdd,

          quality:
            item.quality ?? null,

        },

      ];


    });


  };




  // Increase
  const increaseQuantity = (
    name:string
  )=>{


    setCart((prev)=>

      prev.map((item)=>

        item.name === name

        ?

        {
          ...item,
          quantity:
            item.quantity + 1,
        }

        :

        item

      )

    );


  };




  // Decrease
  const decreaseQuantity = (
    name:string
  )=>{


    setCart((prev)=>

      prev.map((item)=>{


        if(item.name !== name){

          return item;

        }


        return {

          ...item,

          quantity:
            Math.max(
              1,
              item.quantity - 1
            ),

        };


      })

    );


  };




  // Remove
  const removeFromCart = (
    name:string
  )=>{


    setCart((prev)=>

      prev.filter(
        (item)=>
          item.name !== name
      )

    );


  };




  // Clear
  const clearCart = ()=>{

    setCart([]);

  };





  return (

    <CartContext.Provider

      value={{

        cart,

        addToCart,

        increaseQuantity,

        decreaseQuantity,

        removeFromCart,

        clearCart,

      }}

    >

      {children}

    </CartContext.Provider>

  );


}




export function useCart(){

  const context =
    useContext(CartContext);



  if(!context){

    throw new Error(
      "useCart must be used inside CartProvider"
    );

  }



  return context;

}