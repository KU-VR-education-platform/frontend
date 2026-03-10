import { createContext, useContext, useState, useCallback } from 'react';
import './CustomAlertContext.css';

const CustomAlertContext = createContext();

export const useCustomAlert = () => {
    return useContext(CustomAlertContext);
};

export const CustomAlertProvider = ({ children }) => {
    const [alertState, setAlertState] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'alert', // 'alert' | 'confirm'
        onConfirm: null,
        onCancel: null,
        confirmText: '확인',
        cancelText: '취소',
    });

    const showAlert = useCallback((message, title = '알림') => {
        return new Promise((resolve) => {
            setAlertState({
                isOpen: true,
                title,
                message,
                type: 'alert',
                confirmText: '확인',
                onConfirm: () => {
                    setAlertState((prev) => ({ ...prev, isOpen: false }));
                    resolve(true);
                },
            });
        });
    }, []);

    const showConfirm = useCallback((message, title = '확인', confirmText = '확인', cancelText = '취소') => {
        return new Promise((resolve) => {
            setAlertState({
                isOpen: true,
                title,
                message,
                type: 'confirm',
                confirmText,
                cancelText,
                onConfirm: () => {
                    setAlertState((prev) => ({ ...prev, isOpen: false }));
                    resolve(true);
                },
                onCancel: () => {
                    setAlertState((prev) => ({ ...prev, isOpen: false }));
                    resolve(false);
                },
            });
        });
    }, []);

    return (
        <CustomAlertContext.Provider value={{ showAlert, showConfirm }}>
            {children}
            {alertState.isOpen && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal-content">
                        <div className="custom-modal-header">
                            <h3>{alertState.title}</h3>
                        </div>
                        <div className="custom-modal-body">
                            {/* \n 을 <br />로 변환하여 렌더링 */}
                            <div className="custom-modal-message">
                                {alertState.message.split('\n').map((line, i) => (
                                    <span key={i}>
                                        {line}
                                        <br />
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="custom-modal-actions">
                            {alertState.type === 'confirm' && (
                                <button
                                    className="btn btn-secondary"
                                    onClick={alertState.onCancel}
                                >
                                    {alertState.cancelText}
                                </button>
                            )}
                            <button
                                className={`btn ${alertState.type === 'confirm' ? 'btn-danger' : 'btn-primary'}`}
                                onClick={alertState.onConfirm}
                            >
                                {alertState.confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </CustomAlertContext.Provider>
    );
};
