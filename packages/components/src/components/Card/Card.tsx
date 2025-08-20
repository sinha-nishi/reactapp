import React from "react";

export interface CardAttributes {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  icon?: string;
  iconBg?: string;
  onAction: (id: string) => void;
};

/**
 * A Card has a title, description, icon, and background color.
 * Actions: it can multiple actions, like navigate to a page or perform an action.
 * these actions can be presented as button on the bottom, additional menu popover.
 * in a simplest case, the whole card can be a link to a page.
 *
 * @param {*} props
 * @returns
 */
export function Card(props: CardAttributes) {
  const { id, title, subtitle, description, icon, iconBg, onAction } = props;
  return (
    <div
      className="flex flex-col items-center cursor-pointer"
      onClick={() => onAction(id)}
      onKeyDown={() => {}}
      onKeyUp={() => {}}
      onKeyPress={() => {}}
      role="button"
      tabIndex={0}
    >
      <div className="flex flex-col justify-center rounded-xl w-20 h-20 md:w-32 md:h-32 p-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div
          className={`w-12 h-12 md:w-20 md:h-20 flex items-center justify-center rounded-full mx-auto my-2 text-3xl ${iconBg} text-white shadow-md`}
        >
          {icon}
        </div>
      </div>
      <div className="flex flex-col mt-4">
        <h3 className="text md:text-lg font-medium text-center mb-2">
          {title}
        </h3>
        {subtitle ? (
          <h3 className="text-sm md:text font-medium text-center mb-2">
            {title}
          </h3>
        ) : null}
        <p className="hidden md:block text-sm text-gray-300 text-center">
          {description}
        </p>
      </div>
    </div>
  );
}
