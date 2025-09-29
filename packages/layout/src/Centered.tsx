import * as React from 'react';
import { css, styles } from './utils';

export interface CenteredLayoutAttributes {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export function CenteredLayout(props: CenteredLayoutAttributes) {
  const { children, className } = props;
  return (
    <div className={css(`flex flex-col items-center justify-center`, className)}
      style={styles({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: "100vw",
        height: "100vh",
        margin: 0,
        backgroundColor: "#f4f7f6",
      }, props.style)}
    >
        {children}
    </div>
  );
}
