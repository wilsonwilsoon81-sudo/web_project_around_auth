import closeIcon from '../../images/close Icon.png';
import successIcon from '../../images/chulo.png';
import errorIcon from '../../images/equis.png';

function InfoTooltip({ isOpen, onClose, isRegisterSuccess }) {
  // ✅ CLAVE: Si isOpen es false, NO renderizamos NADA. Punto.
  if (!isOpen) {
    return null;
  }

  return (
    <div className="tooltip tooltip_opened">
      <div className="tooltip__container">
        <button 
          type="button" 
          className="tooltip__close"
          onClick={onClose}
        >
          <img src={closeIcon} alt="Cerrar" />
        </button>
        
        {isRegisterSuccess ? (
          <>
            <img 
              src={successIcon} 
              alt="Éxito" 
              className="tooltip__icon"
            />
            <h3 className="tooltip__title">
              ¡Éxito! Ya estás registrado
            </h3>
          </>
        ) : (
          <>
            <img 
              src={errorIcon} 
              alt="Error" 
              className="tooltip__icon"
            />
            <h3 className="tooltip__title">
              ¡Algo salió mal! Inténtalo de nuevo
            </h3>
          </>
        )}
      </div>
    </div>
  );
}

export default InfoTooltip;
