import { mount } from '@vue/test-utils';
import Rating from '@/components/basic/molecules/Rating.vue';

const STAR_FULL = 'StarFull';
const STAR_HALF = 'StarHalf';
const STAR_EMPTY = 'StarEmpty';

describe('Rating.vue', () => {
  it('shows correct integer rating', async() => {
    const wrapper = mount(Rating, {
      propsData: { rating: 1, ratingCount: 1, },
    });
    expectStarsInOrder(wrapper, 1, 0, 4);

    await wrapper.setProps({ rating: 2, ratingCount: 1, });
    expectStarsInOrder(wrapper, 2, 0, 3);

    await wrapper.setProps({ rating: 3, ratingCount: 1, });
    expectStarsInOrder(wrapper, 3, 0, 2);

    await wrapper.setProps({ rating: 4, ratingCount: 1, });
    expectStarsInOrder(wrapper, 4, 0, 1);

    await wrapper.setProps({ rating: 5, ratingCount: 1, });
    expectStarsInOrder(wrapper, 5, 0, 0);
  });

  it('shows correct rating rounded to full stars', async() => {
    const wrapper = mount(Rating, {
      propsData: { rating: 1.1, ratingCount: 1, },
    });
    expectStarsInOrder(wrapper, 1, 0, 4);

    await wrapper.setProps({ rating: 1.76, ratingCount: 1, });
    expectStarsInOrder(wrapper, 2, 0, 3);

    await wrapper.setProps({ rating: 2.2, ratingCount: 1, });
    expectStarsInOrder(wrapper, 2, 0, 3);

    await wrapper.setProps({ rating: 3.24, ratingCount: 1, });
    expectStarsInOrder(wrapper, 3, 0, 2);

    await wrapper.setProps({ rating: 4.99, ratingCount: 1, });
    expectStarsInOrder(wrapper, 5, 0, 0);
  });

  it('shows correct rating rounded to half stars', async() => {
    const wrapper = mount(Rating, {
      propsData: { rating: 1.3, ratingCount: 1, },
    });
    expectStarsInOrder(wrapper, 1, 1, 3);

    await wrapper.setProps({ rating: 1.74, ratingCount: 1, });
    expectStarsInOrder(wrapper, 1, 1, 3);

    await wrapper.setProps({ rating: 2.5, ratingCount: 1, });
    expectStarsInOrder(wrapper, 2, 1, 2);

    await wrapper.setProps({ rating: 3.6, ratingCount: 1, });
    expectStarsInOrder(wrapper, 3, 1, 1);

    await wrapper.setProps({ rating: 4.7, ratingCount: 1, });
    expectStarsInOrder(wrapper, 4, 1, 0);
  });

  const expectStarsInOrder = (wrapper: any, fullCount: number, halfCount: number, emptyCount: number) => {
    expect(findStars(wrapper, STAR_FULL).length).toEqual(fullCount);
    expect(findStars(wrapper, STAR_HALF).length).toEqual(halfCount);
    expect(findStars(wrapper, STAR_EMPTY).length).toEqual(emptyCount);
    let currentChildIndex = 1;
    for (let i = 0; i < fullCount; i++) {
      expect(findStars(wrapper, STAR_FULL, currentChildIndex++).length).toBeGreaterThan(0);
    }
    for (let i = 0; i < halfCount; i++) {
      expect(findStars(wrapper, STAR_HALF, currentChildIndex++).length).toBeGreaterThan(0);
    }
    for (let i = 0; i < emptyCount; i++) {
      expect(findStars(wrapper, STAR_EMPTY, currentChildIndex++).length).toBeGreaterThan(0);
    }
  };

  const findStars = (wrapper: any, id: string, index?: number) => {
    const indexMatcher = index == null ? '' : `svg:nth-child(${index})`;
    return wrapper.findAll(`.eo-stars-container ${indexMatcher} [id=${id}]`);
  };
});
