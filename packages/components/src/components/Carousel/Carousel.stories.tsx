import type { Meta, StoryObj } from '@storybook/react-vite';
import Carousel from "./";

const meta: Meta<typeof Carousel> = {
  title: "Example/Carousel",
  component: Carousel,
  parameters: { layout: "fullscreen" },
  argTypes: {
    layout: {
      control: "select",
      options: ["multi-browse", "uncontained", "hero", "full-screen"],
    },
    align: {
      control: "select",
      options: ["start", "center"],
    },
  },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Carousel>;

const sampleItems = [
  { src: "https://picsum.photos/400/250?1", label: "Item 1" },
  { src: "https://picsum.photos/400/250?2", label: "Item 2" },
  { src: "https://picsum.photos/400/250?3", label: "Item 3" },
  { src: "https://picsum.photos/400/250?4", label: "Item 4" },
];

export const MultiBrowse: Story = {
  args: { items: sampleItems, layout: "multi-browse", align: "center" },
};

export const Uncontained: Story = {
  args: { items: sampleItems, layout: "uncontained", align: "start" },
};

export const Hero: Story = {
  args: { items: sampleItems, layout: "hero", align: "center" },
};

export const FullScreen: Story = {
  args: { items: sampleItems, layout: "full-screen", align: "center" },
};
