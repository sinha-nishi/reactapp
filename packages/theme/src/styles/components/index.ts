import { CssBuilder, BuilderPlugin } from "../../core/builder";
import type { BuilderOptions } from "../../@types";
import { buttonStyles } from "./button";
import { cardStyles } from "./card";
import { inputStyles } from "./input";
import { badgeStyles } from "./badge";
import { alertStyles } from "./alert";

export const componentsPlugin =
  (opts: BuilderOptions = {}): BuilderPlugin =>
  (b: CssBuilder) => {
    const { theme } = b.opts;
    const focusRing = opts?.a11y?.focusRing ?? true;

    opts.components?.alert !== false &&
      alertStyles(
        b,
        opts.components?.alert === true
          ? { focusRing }
          : opts.components?.alert || {},
      );
    opts.components?.badge !== false &&
      badgeStyles(
        b,
        opts.components?.badge === true
          ? { focusRing }
          : opts.components?.badge || {},
      );
    opts.components?.button !== false &&
      buttonStyles(
        b,
        opts.components?.button === true
          ? { focusRing }
          : opts.components?.button || {},
      );
    opts.components?.card !== false &&
      cardStyles(
        b,
        opts.components?.card === true
          ? { focusRing }
          : opts.components?.card || {},
      );
    opts.components?.input !== false &&
      inputStyles(
        b,
        opts.components?.input === true
          ? { focusRing }
          : opts.components?.input || {},
      );

    return b;
  };
