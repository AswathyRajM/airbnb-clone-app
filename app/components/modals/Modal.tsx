'use client';

import { useCallback, useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import Button from '../Button';

interface ModalProps {
  isOpen?: boolean;
  title?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  actionLabel: string | React.ReactElement;
  disabled?: boolean;
  secondaryActionLabel?: string;
  onClose: () => void;
  onSubmit: () => void;
  secondaryAction?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  body,
  footer,
  actionLabel,
  disabled,
  secondaryActionLabel,
  onClose,
  onSubmit,
  secondaryAction,
}) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (disabled) return;

    setShowModal(false);
    // test
    setTimeout(() => {
      onClose();
    }, 300);
  }, [disabled, onClose]);

  const handleSubmit = useCallback(() => {
    if (disabled) return;

    onSubmit();
  }, [disabled, onSubmit]);

  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) return;

    secondaryAction();
  }, [secondaryAction, disabled]);

  if (!isOpen) return null;

  return (
    <>
      <div className='flex justify-center items-center overflow-hidden fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70'>
        <div className='relative w-full md:w-4/6 lg:w-[40%] xl:w-[35%] my-6 mx-auto h-full lg:h-auto md:h-auto'>
          {/* Content */}
          <div
            className={`translate duration-300 h-full ${
              showModal ? 'translate-y-0' : 'translate-y-full'
            }
             ${showModal ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className='translate h-full lg:h-auto md:h-auto border-0 rounded-lg shadow-lg relative flex flex-col q-full bg-white outline-none focus:outline-none'>
              {/* Header */}
              <div className='flex items-center p-5 rounded-t justify-center relative border-b-[1px]'>
                <button
                  onClick={handleClose}
                  className='p-1 border-0 hover:opacity-70 transition absolute left-5'
                >
                  <IoMdClose size={18} />
                </button>
                <div className='text-lg font-semibold'>{title}</div>
              </div>
              {/* Body */}
              <div className='relative p-3 px-6 flex-auto'>{body}</div>
              {/* Footer */}
              <div className='flex flex-col gap-5 p-6 pt-5 px-6'>
                <div className='flex flex-row items-center gap-4 w-full'>
                  {secondaryAction && secondaryActionLabel && (
                    <Button
                      label={secondaryActionLabel}
                      outline
                      disabled={disabled}
                      onClick={secondaryAction}
                    />
                  )}
                  <Button
                    label={actionLabel}
                    disabled={disabled}
                    onClick={onSubmit}
                  />
                </div>
                {footer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
