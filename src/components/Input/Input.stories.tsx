import React from "react";

import { ComponentMeta } from "@storybook/react";
import { ComponentStory } from "@storybook/react";
import { PrimaryInput as Input } from "./index";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Input",
  component: Input,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    onClick: { action: "clicked" },
  },
} as ComponentMeta<typeof Input>;

const Template: ComponentStory<typeof Input> = (args) => <Input {...args} />;

export const PrimaryInput = Template.bind({});
PrimaryInput.args = {
  id: "Primary Input",
  className: "w-1/2",
  placeholder: "Primary Input",
  showLabel: true,
};