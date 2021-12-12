import Calendar from './Calendar.vue';

import {
  addDays,
  subDays
} from 'date-fns';

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
const today = new Date();
// @ts-ignore
Simple.args = {
  disabledDates: [
    subDays(today, 5),
    subDays(today, 4),
    subDays(today, 3),
    addDays(today, 2),
    addDays(today, 10),
    addDays(today, 11),
    addDays(today, 30),
    addDays(today, 33),
  ],
};
