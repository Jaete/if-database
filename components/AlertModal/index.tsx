import { useCssHandles } from '@/hooks/useCssHandles';
import Modal from '../Modal';
import AlertModalHandles from './handles';
import '@/styles/components/alertModal.scss';

interface IProps {
  isOpen: boolean;
  message: string;
  title?: string;
  onClose: () => void;
  label?: string;
}

const AlertModal = ({
  isOpen,
  message,
  title = 'Aviso',
  onClose,
  label = 'OK',
}: IProps) => {
  const handles = useCssHandles(AlertModalHandles);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className={handles.body}>
        <p className={handles.message}>{message}</p>
        <div className={handles.actions}>
          <button className={handles.okButton} onClick={onClose}>
            {label}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AlertModal;
