const Toast = ({ message, isVisible, type = 'success' }) => {
    // 토스트가 보이지 않는 상태일 때도 DOM에 유지하되 스타일로 제어
    const getIcon = () => {
      switch(type) {
        case 'success':
          return '✓';
        case 'error':
          return '✗';
        case 'info':
        default:
          return 'ℹ';
      }
    };
  
    return (
      <div className={`toast-container ${type} ${isVisible ? 'visible' : ''}`}>
        <div className="toast-message">
          <span className="toast-icon">{getIcon()}</span>
          {message}
        </div>
      </div>
    );
  };
  
  export default Toast;