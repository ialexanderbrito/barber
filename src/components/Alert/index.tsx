import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';

import cx from 'classnames';

import styles from './Alert.module.scss';

interface IAlertProps {
  title: string;
  success?: boolean;
  error?: boolean;
  warning?: boolean;
  info?: boolean;
  onClick?: () => void;
  close?: boolean;
}

export function Alert(props: IAlertProps) {
  const [open, setOpen] = useState(true);
  return (
    <>
      {open && (
        <div
          className={cx(styles.alert, {
            [styles.success]: props.success,
            [styles.error]: props.error,
            [styles.warning]: props.warning,
            [styles.info]: props.info,
          })}
        >
          <strong
            style={{
              cursor: props.onClick ? 'pointer' : 'default',
            }}
            onClick={props.onClick}
          >
            {props.title}
          </strong>
          {props.close && (
            <button className={styles.close} onClick={() => setOpen(false)}>
              <IoMdClose size={20} />
            </button>
          )}
        </div>
      )}
    </>
  );
}
