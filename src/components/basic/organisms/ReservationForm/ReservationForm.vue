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
        :start-selected="range.startDateSelected"
        :end-selected="range.endDateSelected"
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
import { format } from 'date-fns';
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
      default: () => ({
        startDateSelected: false,
        endDateSelected: false,
        startDate: new Date(),
        endDate: new Date(),
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
    startText(): string {
      return this.range.startDateSelected ? format(this.range.startDate, 'dd LLL Y') : 'From';
    },
    endText(): string {
      return this.range.endDateSelected ? format(this.range.endDate, 'dd LLL Y') : 'To';
    },
    formValid(): boolean {
      return this.range.startDateSelected && this.range.endDateSelected;
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
      this.range.startDateSelected = false;
      this.range.endDateSelected = false;
    },
    resetEndDate() {
      this.range.endDateSelected = false;
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
