import { mount } from '@vue/test-utils';
import MockDate from 'mockdate';
import ReservationForm from '@/components/basic/organisms/ReservationForm/ReservationForm.vue';

describe('ReservationForm.vue', () => {
  afterAll(() => {
    MockDate.reset();
  });

  it('reservation button is disabled if no dates are selected', async() => {
    MockDate.set(new Date(2021, 10, 20));
    const wrapper = mount(ReservationForm, {
      propsData: {
        rating: 3.5,
        ratingCount: 100,
        price: 200,
      },
    });
    expect(wrapper.find('.eo-reserve-button:disabled').exists()).toBeTruthy();
  });

  it('reservation button is enabled if dates are selected', async() => {
    MockDate.set(new Date(2021, 10, 20));
    const wrapper = mount(ReservationForm, {
      propsData: {
        rating: 3.5,
        ratingCount: 100,
        price: 200,
      },
    });

    await wrapper.find('.eo-start-button button').trigger('click');
    await wrapper.findAll('.eo-day-button').at(4).trigger('click');
    await wrapper.findAll('.eo-day-button').at(8).trigger('click');
    expect(wrapper.find('.eo-reserve-button:disabled').exists()).toBeFalsy();
  });
});
