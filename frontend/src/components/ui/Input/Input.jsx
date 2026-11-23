const Input = ({type, placeholder, value, onChange, name}) => {
    return (
        <input type={type} placeholder={placeholder} value={value} onChange={onChange} name={name} />
    )
}

export default Input