import { numberToRupiah } from "../../utils/number-to-rupiah";

export const ProductItem = ({ name, price, totalItem, discount, initial_price, potongan_harga }) => {
    let formattedDiscount = '';
    if (discount && potongan_harga > 0) {
        formattedDiscount = `(${discount} ${potongan_harga}% off)`;
    }
    
    return (
        <div className="item-product-status">
            <div className="item-content">
                {totalItem && <p className="item">{totalItem}x</p>}
                <p className="name">{name} {formattedDiscount}</p>
            </div>
            <p className="price">
                {potongan_harga > 0 ? (
                    <>
                        <del className="initial-price">{numberToRupiah(initial_price)}</del>
                        &nbsp;
                        <span className="discounted-price">{numberToRupiah(price)}</span>
                    </>
                ) : (
                    numberToRupiah(price)
                )}
            </p>
        </div>
    );
}
