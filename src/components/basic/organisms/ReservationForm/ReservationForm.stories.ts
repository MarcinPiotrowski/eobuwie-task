import ReservationForm from './ReservationForm.vue';

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
