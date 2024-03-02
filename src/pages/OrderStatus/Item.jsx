/* eslint-disable react/prop-types */
export const Item = ({ label, value, onClick }) => {
    return (
        <div className="item">
            <p className="label">{label}</p>
            <p className="value" onClick={onClick}>{value}</p>
        </div>
    );
}