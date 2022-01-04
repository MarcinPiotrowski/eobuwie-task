<template>
  <div class="eo-rating">
    <div class="eo-stars-container">
      <template
        v-for="(star, index) of stars"
      >
        <IconBase
          :key="index"
          height="14"
          width="14"
          icon-name="Star"
          class="eo-star-icon"
        >
          <StarIcon v-if="star === StarType.Full" />
          <StarHalfIcon v-if="star === StarType.Half" />
          <StarEmptyIcon v-if="star === StarType.Empty" />
        </IconBase>
      </template>
    </div>
    <span class="eo-rating-count">
      {{ ratingCount }}
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import IconBase from '@/components/basic/atoms/icons/IconBase.vue';
import StarIcon from '@/components/basic/atoms/icons/StarIcon.vue';
import StarEmptyIcon from '@/components/basic/atoms/icons/StarEmptyIcon.vue';
import StarHalfIcon from '@/components/basic/atoms/icons/StarHalfIcon.vue';

export enum StarType {
  Full,
  Half,
  Empty,
}

const maxStars = 5;

export default Vue.extend({
  name: 'Rating',
  components: { StarHalfIcon, StarEmptyIcon, StarIcon, IconBase, },
  props: {
    rating: {
      type: Number,
      required: true,
    },
    ratingCount: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  data() {
    return {
      StarType,
    };
  },
  computed: {
    ratingNormalized(): number {
      return Math.min(maxStars, Math.max(1, this.rating));
    },
    stars(): StarType[] {
      const { ratingNormalized, } = this;
      const integralPart = Math.floor(ratingNormalized);
      const fractionalPart = ratingNormalized % 1;
      const fullStars = integralPart + (fractionalPart >= 0.75 ? 1 : 0);
      const halfStar = fractionalPart > 0.25 && fractionalPart < 0.75 ? 1 : 0;
      const emptyStars = maxStars - fullStars - halfStar;

      return [
        ...new Array(fullStars).fill(StarType.Full),
        ...new Array(halfStar).fill(StarType.Half),
        ...new Array(emptyStars).fill(StarType.Empty),
      ];
    },
  },
}
);
</script>

<style lang="scss" scoped>
.eo-star-icon {
  color: $green-color;
}

.eo-stars-container {
  display: inline-flex;
  justify-content: flex-end;
  align-content: flex-end;
}

.eo-rating {
  display: inline-flex;
  justify-content: center;
  align-content: center;
}

.eo-rating-count {
  margin-left: 5px;
  font-size: $font-tiny;
  color: $gray-lighter-color;
}
</style>
