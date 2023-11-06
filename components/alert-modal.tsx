"use client";

import Modal from "./modal/modal";
import { Button } from "./ui/button";

interface AlertModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onConfirm,
  onClose,
  loading,
}) => {
  return (
    <div>
      <Modal
        title="Are you sure?"
        description="Once completed, this action cannot be undone."
        onClose={onClose}
        isOpen={isOpen}
      >
        <div className="flex justify-end space-x-2">
          <Button disabled={loading} variant="destructive" onClick={onConfirm}>
            Confirm
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AlertModal;
