import { shallowMount } from '@vue/test-utils';
import CustomButton from '@/components/basic/atoms/CustomButton.vue';

describe('CustomButton.vue', () => {
  it('emits event on enabled', async () => {
    const wrapper = shallowMount(CustomButton, {
      propsData: { disabled: false, },
    });
    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted('onClick')).toBeTruthy();
  });

  it('does not emit event on disabled', async () => {
    const wrapperDisabled = shallowMount(CustomButton, {
      propsData: { disabled: true, },
    });
    await wrapperDisabled.find('button').trigger('click');
    expect(wrapperDisabled.emitted('onClick')).toBeFalsy();
  });

  it('shows custom slot', () => {
    const wrapperDisabled = shallowMount(CustomButton, {
      slots: {
        default: '<span class="eo-custom-slot">Custom text</span>',
      },
    });
    expect(wrapperDisabled.find('.eo-custom-slot').text()).toEqual('Custom text');
  });
});
