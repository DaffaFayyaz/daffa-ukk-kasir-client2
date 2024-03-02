/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { numberToRupiah } from "../../utils/number-to-rupiah";

export const FloatingCheckout = ({cart}) => {
    const navigate = useNavigate();
    let totalPrice = 0;
    let totalItem = 0;

    cart.forEach((item) => {
      const discountedPrice = item.price - (item.price * item.potongan_harga / 100); 
      totalPrice += discountedPrice * item.count; 
      totalItem += item.count; // 
  });

    return (
      <div className='floating-checkout' onClick={() => navigate('/checkout')}>
        <p className='total-item'>{totalItem} Item</p>
        <p className='total-price'>{numberToRupiah(totalPrice)}</p>
      </div>
    )
}