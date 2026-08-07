import successIcon from '../../images/chulo.png'; 
import errorIcon from '../../images/equis.png';

function InfoTooltip({ isOpen, onClose, title, message, isSuccess }) {
  return (
    <div className={`popup ${isOpen ? 'popup_is-opened' : ''}`}>
      <div className="popup__container">
        <button 
          type="button" 
          className="popup__close" 
          onClick={onClose}
          aria-label="Cerrar"
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 20 20" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M19.2929 2.70711C19.6834 2.31658 19.6834 1.68342 19.2929 1.29289C18.9024 0.902367 18.2692 0.902367 17.8787 1.29289L10.0001 9.17157L2.12143 1.29289C1.73091 0.902367 1.09774 0.902367 0.707216 1.29289C0.316691 1.68342 0.316691 2.31658 0.707216 2.70711L8.58589 10.5858L0.707216 18.4645C0.316691 18.855 0.316691 19.4882 0.707216 19.8787C1.09774 20.2692 1.73091 20.2692 2.12143 19.8787L10.0001 12L17.8787 19.8787C18.2692 20.2692 18.9024 20.2692 19.2929 19.8787C19.6834 19.4882 19.6834 18.855 19.2929 18.4645L11.4142 10.5858L19.2929 2.70711Z" 
              fill="#faf7f7"
            />
          </svg>
        </button>
        <div className="popup__content popup__content_tooltip">
          <img 
            src={isSuccess ? successIcon : errorIcon} 
            alt={isSuccess ? "Éxito" : "Error"} 
            className="popup__icon" 
          />
          <h3 className="popup__title">{title}</h3>
          <p className="popup__text">{message}</p>
        </div>
      </div>
    </div>
  );
}

export default InfoTooltip;
