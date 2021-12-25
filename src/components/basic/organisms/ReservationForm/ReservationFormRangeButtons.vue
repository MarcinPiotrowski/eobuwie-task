<template>
  <div class="eo-calendar-buttons">
    <div class="eo-start-button">
      <CustomButton
        :custom-styles="false"
        @onClick="openCalendar"
      >
        {{ startText }}
      </CustomButton>
      <CustomButton
        class="eo-cancel-button"
        :custom-styles="false"
        @onClick="resetStartDate"
      >
        <IconBase
          v-if="range.startDate !== undefined"
          width="10"
          height="10"
          icon-name="Close"
        >
          <CloseIcon />
        </IconBase>
      </CustomButton>
    </div>

    <IconBase
      width="20"
      height="20"
      icon-name="arrow"
    >
      <ArrowFullRight />
    </IconBase>

    <div class="eo-end-button">
      <CustomButton
        :custom-styles="false"
        @onClick="openCalendar"
      >
        {{ endText }}
      </CustomButton>
      <CustomButton
        class="eo-cancel-button"
        :custom-styles="false"
        @onClick="resetEndDate"
      >
        <IconBase
          v-if="range.endDate !== undefined"
          width="10"
          height="10"
          icon-name="Close"
        >
          <CloseIcon />
        </IconBase>
      </CustomButton>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import CustomButton from '@/components/basic/atoms/CustomButton.vue';
import IconBase from '@/components/basic/atoms/icons/IconBase.vue';
import ArrowFullRight from '@/components/basic/atoms/icons/ArrowFullRight.vue';
import { format } from 'date-fns';
import { DateRange } from '@/components/basic/molecules/Calendar/Calendar.vue';
import CloseIcon from '@/components/basic/atoms/icons/CloseIcon.vue';

export default Vue.extend({
  name: 'ReservationFormRangeButtons',
  components: { CloseIcon, ArrowFullRight, IconBase, CustomButton, },
  props: {
    range: {
      type: Object as PropType<DateRange>,
      required: true,
    },
  },
  data() {
    return {
      calendarOpen: false,
    };
  },
  computed: {
    startText(): string {
      return this.range.startDate === undefined ? 'From' : format(this.range.startDate, 'dd LLL Y');
    },
    endText(): string {
      return this.range.endDate === undefined ? 'To' : format(this.range.endDate, 'dd LLL Y');
    },
  },
  methods: {
    openCalendar() {
      this.$emit('openCalendar');
    },
    resetStartDate() {
      this.$emit('resetStartDate');
    },
    resetEndDate() {
      this.$emit('resetEndDate');
    },
  },
}
);
</script>

<style lang="scss" scoped>

.eo-calendar-buttons {
  display: flex;
  border: 1px solid $green-light-color;
  height: 30px;
  border-radius: 15px;
  align-items: center;
}

.eo-start-button,
.eo-end-button {
  flex-grow: 1;
  flex-basis: 0;
  display: flex;
  justify-content: center;
}

.eo-cancel-button {
  margin-left: 5px;
}
</style>
