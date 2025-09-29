export function css(...classes: (string | undefined)[]) {
    if (!classes || classes.length === 0) return '';
    return classes.filter(Boolean).join(' ');
}

export function styles(...styles: (React.CSSProperties | undefined)[]) {
    if (!styles || styles.length === 0) return {};
    return Object.assign({}, ...(styles.filter(Boolean) as React.CSSProperties[]));
}