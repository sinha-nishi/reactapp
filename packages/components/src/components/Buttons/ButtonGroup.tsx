import * as React from 'react';

interface ButtonGroupAttributes {
    className?: string;
    onSelection: (key: string) => void;
    data: Record<string, { display: string }>;
    selected: string;
}

function switchClass(index: number, length: number) {
  if (index === 0) {
    return "border-l rounded-l-xl";
  }
  if (index === length - 1) {
    return "rounded-r-xl";
  }
  return "";
}

export function ButtonGroup(props: ButtonGroupAttributes) {
  const { data, onSelection, selected, className } = props;
  return (
    <ul className={`flex flex-row justify-center my-8 ${className}`}>
      {Object.keys(data).map((key, index, { length }) => (
        <li
          key={key}
          className={`w-40 border-y border-r border-slate-400 text-center text-xl ${switchClass(
            index,
            length
          )} ${key === selected ? "bg-blue-700 text-white" : ""}`}
        >
          <a href={`#skills-${key}`} onClick={() => onSelection(key)}>
            {data[key].display}
          </a>
        </li>
      ))}
    </ul>
  );
}
