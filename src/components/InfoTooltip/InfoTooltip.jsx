import closeIcon from '../../images/close Icon.png';
import successIcon from '../../images/chulo.png';
import errorIcon from '../../images/equis.png';

function InfoTooltip({ isOpen, onClose, isRegisterSuccess }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="tooltip-overlay">
      <div className="tooltip-box">
        <button 
          type="button" 
          className="tooltip-close-btn"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <img src={closeIcon} alt="Cerrar" />
        </button>
        
        {isRegisterSuccess ? (
          <>
            <img src={successIcon} alt="Éxito" className="tooltip-icon" />
            <h3 className="tooltip-title">
              ¡Correcto! Ya estás registrado
            </h3>
          </>
        ) : (
          <>
            <img src={errorIcon} alt="Error" className="tooltip-icon" />
            <h3 className="tooltip-title">
              Uy, ¡Algo salió mal! Por favor, inténtalo de nuevo.
            </h3>
          </>
        )}
      </div>
    </div>
  );
}

export default InfoTooltip;
