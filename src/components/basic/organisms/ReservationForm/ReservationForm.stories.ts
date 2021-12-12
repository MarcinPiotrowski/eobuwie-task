import ReservationForm from './ReservationForm.vue';
import { addDays, subDays } from 'date-fns'

export default {
  title: 'Organisms/ReservationForm',
  component: ReservationForm,
  argTypes: {
  },
};

const Template = (args: any, { argTypes, }: {argTypes: any[]}) => ({
  props: Object.keys(argTypes),
  components: { ReservationForm, },
  template: '<ReservationForm style="margin-left: 100px;" v-bind="$props" />',
});

export const Standard = Template.bind({});
// @ts-ignore
Standard.args = {
  rating: 3.6,
  ratingCount: 123,
  price: 298,
};

const today = new Date();
export const SelectedDays = Template.bind({});
// @ts-ignore
SelectedDays.args = {
  rating: 3.6,
  ratingCount: 123,
  price: 298,
  initialRange: {
    startDateSelected: true,
    endDateSelected: true,
    startDate: addDays(today, 6),
    endDate: addDays(today, 10),
  },
  disabledDates: [
    subDays(today, 3),
    subDays(today, 4),
    subDays(today, 5),
    addDays(today, 15),
    addDays(today, 16),
  ],
};
