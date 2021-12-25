import { mount, shallowMount } from '@vue/test-utils';
import Calendar from '@/components/basic/molecules/Calendar/Calendar.vue';
import MockDate from 'mockdate';

describe('Calendar.vue', () => {
  afterAll(() => {
    MockDate.reset();
  });

  it('shows correct start weekday', async() => {
    MockDate.set(new Date(2021, 10, 20));
    const wrapper = shallowMount(Calendar, {
      propsData: { disabledDates: [], },
    });
    expect(wrapper.find('.eo-day-of-week:nth-child(1)').text()).toEqual('Sun');

    await wrapper.setProps({ startDayOfWeek: 1, });
    expect(wrapper.find('.eo-day-of-week:nth-child(1)').text()).toEqual('Mon');
  });

  it('shows correct days', async() => {
    MockDate.set(new Date(2021, 10, 20));
    const wrapper = shallowMount(Calendar, {
      propsData: { disabledDates: [], },
    });
    const days = wrapper.findAll('.eo-day-button');
    expect(days.at(0).text()).toEqual('31');
    expect(days.at(1).text()).toEqual('1');
    expect(days.at(2).text()).toEqual('2');
    expect(days.at(7).text()).toEqual('7');
    expect(days.at(34).text()).toEqual('4');
  });

  it('shows correct disabled days', async() => {
    MockDate.set(new Date(2021, 10, 20));
    const wrapper = shallowMount(Calendar, {
      propsData: {
        disabledDates: [
          new Date(2021, 9, 31),
          new Date(2021, 10, 22),
          new Date(2021, 10, 23),
        ],
      },
    });
    const days = wrapper.findAll('.eo-day-button');
    expect(days.at(0).classes()).toContain('eo-disabled');
    expect(days.at(22).classes()).toContain('eo-disabled');
    expect(days.at(23).classes()).toContain('eo-disabled');
  });

  it('navigates through months', async() => {
    MockDate.set(new Date(2021, 10, 20));
    const wrapper = mount(Calendar);
    expect(wrapper.find('.eo-day-button').text()).toEqual('31');

    await wrapper.find('.eo-month-navigation button:nth-of-type(1)').trigger('click');
    expect(wrapper.find('.eo-day-button').text()).toEqual('26');

    await wrapper.find('.eo-month-navigation button:nth-of-type(2)').trigger('click');
    await wrapper.find('.eo-month-navigation button:nth-of-type(2)').trigger('click');
    expect(wrapper.find('.eo-day-button').text()).toEqual('28');
  });

  it('selects range', async() => {
    MockDate.set(new Date(2021, 10, 20));
    const wrapper = mount(Calendar, {
      propsData: {
        disabledDates: [
          new Date(2021, 9, 31),
          new Date(2021, 10, 22),
          new Date(2021, 10, 23),
        ],
      },
    });

    await wrapper.findAll('.eo-day-button').at(20).trigger('click');
    expect(wrapper.emitted().rangeChanged?.[0][0].endDate).toBeUndefined();
    await wrapper.findAll('.eo-day-button').at(23).trigger('click');
    expect(wrapper.emitted().rangeChanged?.length).toEqual(1);
    await wrapper.findAll('.eo-day-button').at(21).trigger('click');
    expect(wrapper.emitted().rangeChanged?.[1][0].endDate).toBeDefined();
    expect(wrapper.emitted().rangeChanged?.[1][0].startDate).toEqual(new Date(2021, 10, 20));
    expect(wrapper.emitted().rangeChanged?.[1][0].endDate).toEqual(new Date(2021, 10, 21));
  });

  it('selects while navigating through months', async() => {
    MockDate.set(new Date(2021, 10, 20));
    const wrapper = mount(Calendar, {
      propsData: {
        disabledDates: [
          new Date(2021, 9, 31),
          new Date(2021, 11, 1),
          new Date(2021, 11, 2),
        ],
      },
    });

    await wrapper.findAll('.eo-day-button').at(20).trigger('click');
    await wrapper.find('.eo-month-navigation button:nth-of-type(2)').trigger('click');
    await wrapper.findAll('.eo-day-button').at(2).trigger('click');
    expect(wrapper.emitted().rangeChanged?.length).toEqual(2);
  });

  it('disables groups', async() => {
    MockDate.set(new Date(2021, 11, 20));
    const wrapper = mount(Calendar, {
      propsData: {
        disabledDates: [
          new Date(2021, 11, 1),
          new Date(2021, 11, 20),
          new Date(2021, 11, 21),
        ],
      },
    });

    await wrapper.findAll('.eo-day-button').at(18).trigger('click');
    expect(wrapper.emitted().rangeChanged?.length).toEqual(1);
    await wrapper.findAll('.eo-day-button').at(30).trigger('click');
    expect(wrapper.emitted().rangeChanged?.length).toEqual(1);
    await wrapper.findAll('.eo-day-button').at(31).trigger('click');
    expect(wrapper.emitted().rangeChanged?.length).toEqual(1);
  });
});
