import React from "react";
import Modal from "./modal";

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  message,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4 items-center">
        <p className="text-lg">{message}</p>
        <div className="flex gap-4">
          <button
            className="bg-red-600 text-white rounded-xl py-2 px-4"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Delete
          </button>
          <button
            className="bg-secondary text-white rounded-xl py-2 px-4"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
