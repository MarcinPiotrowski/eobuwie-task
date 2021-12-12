<template>
  <div class="eo-month-navigation">
    <CustomButton
      :custom-styles="false"
      @onClick="onPreviousMonth"
    >
      <IconBase
        width="15"
        height="15"
        icon-name="Previous Month"
      >
        <ArrowLeft />
      </IconBase>
    </CustomButton>
    <span class="eo-text-medium eo-month">
      {{ currentMonthName }} {{ currentYear }}
    </span>

    <CustomButton
      :custom-styles="false"
      @onClick="onNextMonth"
    >
      <IconBase
        width="15"
        height="15"
        icon-name="Next Month"
      >
        <ArrowRight />
      </IconBase>
    </CustomButton>
  </div>
</template>

<script lang="ts">
import {
  getMonth,
  getYear
} from 'date-fns';
import Vue from 'vue';
import CustomButton from '@/components/basic/atoms/CustomButton.vue';
import IconBase from '@/components/basic/atoms/icons/IconBase.vue';
import ArrowLeft from '@/components/basic/atoms/icons/ArrowLeft.vue';
import ArrowRight from '@/components/basic/atoms/icons/ArrowRight.vue';

const MONTHS = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', ];

export default Vue.extend({
  name: 'CalendarNavigation',
  components: { ArrowRight, ArrowLeft, IconBase, CustomButton, },
  props: {
    currentDate: Date as new () => Date,
  },
  computed: {
    currentMonth(): number {
      return getMonth(this.currentDate);
    },
    currentYear(): number {
      return getYear(this.currentDate);
    },
    currentMonthName(): string {
      return MONTHS[this.currentMonth];
    },
  },
  methods: {
    onPreviousMonth(): void {
      this.$emit('onPreviousMonth');
    },
    onNextMonth(): void {
      this.$emit('onNextMonth');
    },
  },
});
</script>

<style scoped lang="scss">
.eo-month-navigation {
  display: flex;
  max-width: 100%;
  padding: 10px 20px;
  border: 1px solid $gray-lightest-color;
  border-radius: 30px;
}

.eo-month {
  flex-grow: 1;
  font-weight: bold;
  text-align: center;
}
</style>
