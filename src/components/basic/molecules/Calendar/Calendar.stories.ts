import Calendar from './Calendar.vue';

export default {
  title: 'Molecules/Calendar',
  component: Calendar,
  argTypes: {
  },
};

const Template = (args: any, { argTypes, }: {argTypes: any[]}) => ({
  props: Object.keys(argTypes),
  components: { Calendar, },
  template: '<Calendar v-bind="$props" />',
});

export const Simple = Template.bind({});
// @ts-ignore
Simple.args = {
};
