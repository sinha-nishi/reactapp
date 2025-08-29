import type { Meta, StoryObj } from '@storybook/react-vite';
import { Carousel } from "./";

const meta: Meta<typeof Carousel> = {
  title: "Example/Carousel",
  component: Carousel,
  parameters: { layout: "fullscreen" },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Carousel>;

const sampleData = [
  { 
    title: "AI is the Future",
    subtitle: "Discover how AI is shaping tomorrow.",
    image: "https://picsum.photos/800/400?1",
    href: "/articles/ai-future",
  },
  { 
    title: "Space Exploration",
    subtitle: "The next step for humanity.",
    image: "https://picsum.photos/800/400?2",
    href: "/articles/space",
  },
  { 
    title: "Climate Change",
    subtitle: "Our planet needs us now.",
    image: "https://picsum.photos/800/400?3",
    href: "/articles/climate",
  },
];

export const Default: Story = {
  args: {
    data: sampleData,
  },
};
