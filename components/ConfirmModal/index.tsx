import { useCssHandles } from '@/hooks/useCssHandles';
import Modal from '../Modal';
import ConfirmModalHandles from './handles';
import '@/styles/components/confirmModal.scss';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Excluir',
  cancelLabel = 'Cancelar',
}: IProps) => {
  const handles = useCssHandles(ConfirmModalHandles);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title ?? 'Confirmar'}>
      <div className={handles.body}>
        <p className={handles.message}>
          {message ?? 'Tem certeza que deseja realizar esta ação?'}
        </p>
        <div className={handles.actions}>
          <button className={handles.cancelButton} onClick={onClose}>
            {cancelLabel}
          </button>
          <button className={handles.confirmButton} onClick={handleConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
