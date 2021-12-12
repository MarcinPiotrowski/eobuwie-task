import CustomButton from './CustomButton.vue';
import IconBase from '@/components/basic/atoms/icons/IconBase.vue';
import CloseIcon from '@/components/basic/atoms/icons/CloseIcon.vue';

export default {
  title: 'Atoms/CustomButton',
  component: CustomButton,
  argTypes: {
  },
};

const Template = (args: any, { argTypes, }: {argTypes: any[]}) => ({
  props: Object.keys(argTypes),
  components: { CustomButton, },
  template: '<CustomButton v-bind="$props" @onClick="onClick" />',
});

const TemplateSlot = (args: any, { argTypes, }: {argTypes: any[]}) => ({
  props: Object.keys(argTypes),
  components: { CustomButton, IconBase, CloseIcon, },
  template: `
    <CustomButton v-bind="$props" @onClick="onClick">
    <template v-slot:icon>
      <IconBase icon-name="icon" width="14" height="14">
          <CloseIcon/>
      </IconBase>
    </template>
    </CustomButton>
    `,
});

export const Primary = Template.bind({});
// @ts-ignore
Primary.args = {
  text: 'Simple button',
};

export const WithCustomSlot = TemplateSlot.bind({});
// @ts-ignore
WithCustomSlot.args = {
  text: 'Button with custom icon',
};
