export default function ImagePopup(props) {
  const { link, name } = props;

  return (
    <>
      <img className="popup__image" src={link} alt={name} />
      <p className="popup__caption">{name}</p>
    </>
  );
}
