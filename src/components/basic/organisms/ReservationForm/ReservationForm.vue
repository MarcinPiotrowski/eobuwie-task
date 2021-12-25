<template>
  <div
    v-click-outside="closeCalendar"
    class="eo-reservation-form"
  >
    <div class="eo-rating-price-button">
      <div class="eo-price-with-rating">
        <div class="eo-text-large eo-price">
          {{ price }} zł
        </div>
        <Rating
          :rating="rating"
          :rating-count="ratingCount"
        />
      </div>
      <CustomButton
        class="eo-reserve-button"
        text="Reserve"
        :disabled="!formValid"
      />
    </div>
    <div class="eo-calendar-buttons">
      <ReservationFormRangeButtons
        :range="range"
        @openCalendar="openCalendar"
        @resetStartDate="resetStartDate"
        @resetEndDate="resetEndDate"
      />
    </div>
    <div
      class="eo-calendar"
      :class="{ 'eo-calendar-open': calendarOpen }"
    >
      <Calendar
        :disabled-dates="disabledDates"
        :initial-range="initialRange"
        @rangeChanged="onDatesChanged"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Rating from '@/components/basic/molecules/Rating.vue';
import CustomButton from '@/components/basic/atoms/CustomButton.vue';
import Calendar, { DateRange } from '@/components/basic/molecules/Calendar/Calendar.vue';
import vco from 'v-click-outside';
import ReservationFormRangeButtons from '@/components/basic/organisms/ReservationForm/ReservationFormRangeButtons.vue';

Vue.use(vco);

export default Vue.extend({
  name: 'ReservationForm',
  components: { ReservationFormRangeButtons, Calendar, CustomButton, Rating, },
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
    price: {
      type: Number,
      required: true,
    },
    disabledDates: {
      type: Array as PropType<Array<Date>>,
      default: () => [],
    },
    initialRange: {
      type: Object as PropType<DateRange>,
      required: false,
      default: (): DateRange => ({
        startDate: undefined,
        endDate: undefined,
      }),
    },
  },
  data() {
    return {
      calendarOpen: false,
      range: {
        ...this.initialRange,
      },
    };
  },
  computed: {
    formValid(): boolean {
      return this.range.startDate !== undefined && this.range.endDate !== undefined;
    },
  },
  methods: {
    openCalendar() {
      this.calendarOpen = true;
    },
    closeCalendar() {
      this.calendarOpen = false;
    },
    onDatesChanged(range: DateRange) {
      this.range = range;
    },
    resetStartDate() {
      this.range.startDate = undefined;
      this.range.endDate = undefined;
    },
    resetEndDate() {
      this.range.endDate = undefined;
    },
  },
}
);
</script>

<style lang="scss" scoped>
.eo-price {
  font-weight: bold;
}
.eo-reservation-form {
  padding: 20px;
  box-shadow: $shadow-medium;
  border-radius: 20px;
  display: inline-flex;
  flex-direction: column;
  width: 250px;
  position: relative;
}
.eo-rating-price-button {
  display: inline-flex;
}
.eo-reserve-button {
  margin-left: auto;
}

.eo-calendar {
  display: none;
  position: absolute;
  z-index: 10;
  top: calc(100% - 15px);
  background-color: white;
  padding: 20px;
  box-shadow: $shadow-medium;
  border-radius: 20px;
  left: 50%;
  transform: translate(-50%);

  &.eo-calendar-open {
    display: block;
  }
}

</style>
