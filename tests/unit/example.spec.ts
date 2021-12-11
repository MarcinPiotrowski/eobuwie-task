import { shallowMount } from '@vue/test-utils';
import HelloWorld from '@/components/HelloWorld.vue';

describe('HelloWorld.vue', () => {
  it('renders hello world message', () => {
    const msg = 'Hello world!';
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg, },
    });
    expect(wrapper.text()).toMatch(msg);
  });
});
