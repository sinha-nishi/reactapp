# react-myui
A customizable React UI implementation

> [!WARNING]
> This repostiory uses **pnpm** as package manager. Please pay close attention to this information as it is crucial for preventing potential issues or risks.
> - install pnpm `npm install -g pnpm@latest`
> - Ensure all dependencies are installed before running.

## Upgrade version

> pnpm -r exec pnpm version patch

## Publish version

> pnpm -r publish --access public

## Dependencies

```
pnpm --filter @pkvsinha/react-app add @pkvsinha/react-base@workspace:*
pnpm --filter @pkvsinha/react-app add @pkvsinha/react-integrate@workspace:*
pnpm --filter @pkvsinha/react-app add @pkvsinha/react-components@workspace:*
pnpm --filter @pkvsinha/react-app add @pkvsinha/react-hooks@workspace:*
pnpm --filter @pkvsinha/react-app add @pkvsinha/react-icons@workspace:*
pnpm --filter @pkvsinha/react-app add @pkvsinha/react-layout@workspace:*
pnpm --filter @pkvsinha/react-app add @pkvsinha/react-navigate@workspace:*
pnpm --filter @pkvsinha/react-app add @pkvsinha/react-widgets@workspace:*

pnpm --filter @pkvsinha/react-navigate add @pkvsinha/react-integrate@workspace:*

pnpm --filter @pkvsinha/react-widgets add @pkvsinha/react-navigate@workspace:*

pnpm --filter @pkvsinha/react-components add @pkvsinha/react-theme@workspace:*
pnpm --filter @pkvsinha/react-components add @pkvsinha/react-base@workspace:*
pnpm --filter @pkvsinha/react-components add @pkvsinha/react-layout@workspace:*
pnpm --filter @pkvsinha/react-components add @pkvsinha/react-hooks@workspace:*
pnpm --filter @pkvsinha/react-components add @pkvsinha/react-navigate@workspace:*

pnpm --filter @pkvsinha/react-layout add @pkvsinha/react-theme@workspace:*
pnpm --filter @pkvsinha/react-layout add @pkvsinha/react-base@workspace:*

pnpm --filter @pkvsinha/react-base add @pkvsinha/react-theme@workspace:*

```

## Design System

Our design system is built around key variables:

1. **Theme:** Includes colors, typography, and other visual styles.
2. **Design Types:** Supports styles such as Minimalist, Neumorphism, and Skeuomorphism.

Now each design component will have following properties the values of these dependes on the type of design used like minimalist designs don't have an elevated state.
1. States: Element states like: hovered, focussed, pressed, dragged, disabled.
2. Variants: Like filled, outlined, elevated.

Next comes the color schemes, choice of font, that also depends on the design type and theme - most typically light and dark.

1. Color: primary, secondary, tertiary, surface color, tint etc.... they need to be described for both light and dark design themes.
2. Contrast: 
3. Shape: like Border radius, border size.

## Design Elements

### Navigation

Websites feature various navigation patterns. The primary navigation, referred to as **TopNavigation**, can appear as a top bar, bottom bar, sidebar, drawer, or rail. Secondary navigation may include elements like a right-side aside or a footer, which typically contains general information, contact details, and more.

On secondary pages, navigation often includes a back button to return to the main page, along with additional navigation options relevant to the page type. For example, a blog page might feature a side navigation to help users browse different sections.

### Input Components

- **Text Inputs:** For email, phone, and other text fields.
- **Selectors:** Includes chips, checkboxes, radio lists, sliders, and switches.

### Sheets

- **Bottom Sheets**
- **Side Sheets**
