import Rating from './Rating.vue';

export default {
  title: 'Molecules/Rating',
  component: Rating,
  argTypes: {
  },
};

const Template = (args: any, { argTypes, }: {argTypes: any[]}) => ({
  props: Object.keys(argTypes),
  components: { Rating, },
  template: '<Rating v-bind="$props" />',
});

export const Primary = Template.bind({});
// @ts-ignore
Primary.args = {
  rating: 3.6,
  ratingCount: 32,
};
