<template>
  <div class="eo-calendar-main">
    <CalendarNavigation
      :current-date="currentDate"
      @onPreviousMonth="onPreviousMonth"
      @onNextMonth="onNextMonth"
    />
    <div
      class="eo-calendar-days"
      @mouseleave="onMouseLeave()"
    >
      <div
        v-for="dayOfWeek of daysOfWeeks"
        :key="dayOfWeek"
        class="eo-day-of-week eo-text-small"
      >
        {{ dayOfWeek }}
      </div>
      <CustomButton
        v-for="{ key, isToday, disabled, isStart, isEnd, isBetween, date, day } of daysForCurrentMonth"
        :key="key"
        class="eo-text-small eo-day-button"
        :class="{ 'eo-today': isToday,
                  'eo-disabled': disabled,
                  'eo-start-day': isStart,
                  'eo-end-day': isEnd,
                  'eo-between': isBetween }"
        :custom-styles="false"
        :disabled="disabled"
        @onClick="selectDate(date)"
      >
        <div
          class="eo-day-inner"
          @mouseenter="onMouseHover(date, disabled)"
        >
          {{ day }}
        </div>
      </CustomButton>
    </div>
  </div>
</template>

<script lang="ts">
import {
  addDays,
  getDay,
  getMonth,
  getYear,
  isSameDay,
  lastDayOfMonth,
  subDays,
  getDate,
  addMonths,
  subMonths, isAfter, isBefore
} from 'date-fns';
import Vue, { PropType } from 'vue';
import CustomButton from '@/components/basic/atoms/CustomButton.vue';
import CalendarNavigation from '@/components/basic/molecules/Calendar/CalendarNavigation.vue';

const DAYS_SHORT = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', ];

export interface DateRange {
  startDateSelected: boolean;
  endDateSelected: boolean;
  startDate: Date;
  endDate: Date;
}

interface CalendarDay {
  date: Date;
  key: string;
  day: number;
  disabled: boolean;
  isToday: boolean;
  isBetween: boolean;
  isStart: boolean;
  isEnd: boolean;
}
export default Vue.extend({
  name: 'Calendar',
  components: { CalendarNavigation, CustomButton, },
  props: {
    startDayOfWeek: {
      type: Number,
      required: false,
      default: 0,
    },
    disabledDates: {
      type: Array as PropType<Array<Date>>,
      default: () => [],
    },
    startSelected: {
      type: Boolean,
      required: false,
      default: false,
    },
    endSelected: {
      type: Boolean,
      required: false,
      default: false,
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
      range: {
        ...this.initialRange,
      },
      currentDate: new Date(),
      isMouseHover: false,
      hoverDate: new Date(),
    };
  },
  computed: {
    startDayOfWeekNormalized(): number {
      return this.startDayOfWeek % 7;
    },
    daysOfWeeks(): string[] {
      return [ ...DAYS_SHORT.slice(this.startDayOfWeekNormalized), ...DAYS_SHORT.slice(0, this.startDayOfWeekNormalized), ];
    },
    daysForCurrentMonth(): CalendarDay[] {
      const today = new Date();
      return this.simpleDaysForCurrentMonth.map(d => {
        const key = dateToKey(d);
        return {
          date: d,
          day: getDate(d),
          disabled: this.disabledSet.has(key),
          isBetween: this.isDateBetween(d),
          isStart: this.isStartDay(d),
          isEnd: this.isEndDay(d),
          isToday: isSameDay(d, today),
          key,
        };
      }
      );
    },
    simpleDaysForCurrentMonth(): Date[] {
      const result: Date[] = [];
      const { startDayOfCalendar, startDayOfNextMonth, } = this;
      let currentDay = startDayOfCalendar;
      while (!isSameDay(currentDay, startDayOfNextMonth)) {
        result.push(currentDay);
        currentDay = addDays(currentDay, 1);
      }

      return result;
    },
    currentMonth(): number {
      return getMonth(this.currentDate);
    },
    currentYear(): number {
      return getYear(this.currentDate);
    },
    startDayOfCalendar(): Date {
      let currentDate = new Date(this.currentYear, this.currentMonth, 1);
      while (getDay(currentDate) !== this.startDayOfWeekNormalized) {
        currentDate = subDays(currentDate, 1);
      }
      return currentDate;
    },
    endDayOfCalendar(): Date {
      let currentDate = lastDayOfMonth(new Date(this.currentYear, this.currentMonth, 1));
      while (getDay(currentDate) !== (this.startDayOfWeekNormalized + 6) % 7) {
        currentDate = addDays(currentDate, 1);
      }
      return currentDate;
    },
    startDayOfNextMonth(): Date {
      return addDays(this.endDayOfCalendar, 1);
    },
    disabledSet(): Set<string> {
      const datesKeys = this.disabledDates.map(d => dateToKey(d));
      const datesSet = new Set<string>(datesKeys);
      const { startDateSelected, endDateSelected, startDate, } = this.range;
      if (startDateSelected && !endDateSelected) {
        const { startDayOfNextMonth, } = this;
        return new Set<string>(
          [ ...datesKeys,
            ...getDisabledGroupDates(startDate, startDayOfNextMonth, datesSet), ]
        );
      }
      return datesSet;
    },
  },
  watch: {
    startSelected(newVal) {
      this.range.startDateSelected = newVal;
    },
    endSelected(newVal) {
      this.range.endDateSelected = newVal;
    },
  },
  methods: {
    onPreviousMonth(): void {
      this.currentDate = subMonths(this.currentDate, 1);
    },
    onNextMonth(): void {
      this.currentDate = addMonths(this.currentDate, 1);
    },
    selectDate(date: Date): void {
      this.isMouseHover = false;
      const { startDateSelected, endDateSelected, startDate, } = this.range;
      if (startDateSelected && !endDateSelected && isSameDay(date, startDate)) {
        this.range.startDateSelected = false;
        return;
      }
      if (startDateSelected && !endDateSelected && isBefore(date, startDate)) {
        this.range.startDate = date;
      } else if (!startDateSelected || endDateSelected) {
        this.range.startDateSelected = true;
        this.range.endDateSelected = false;
        this.range.startDate = date;
      } else {
        this.range.endDateSelected = true;
        this.range.endDate = date;
      }
      this.$emit('rangeChanged', this.range);
    },
    onMouseHover(date: Date, disabled: boolean): void {
      if (disabled) {
        return;
      }
      this.isMouseHover = true;
      this.hoverDate = date;
    },
    onMouseLeave(): void {
      this.isMouseHover = false;
    },
    isDateBetween(date: Date): boolean {
      const { startDateSelected, endDateSelected, startDate, endDate, } = this.range;
      if (!startDateSelected) {
        return false;
      }
      const end = endDateSelected ? endDate
        : (this.isMouseHover ? this.hoverDate : startDate);
      return (isSameDay(date, startDate) || isAfter(date, startDate)) &&
          (isSameDay(date, end) || isBefore(date, end));
    },
    isStartDay(currentDay: Date) {
      return this.range.startDateSelected && isSameDay(this.range.startDate, currentDay);
    },
    isEndDay(currentDay: Date) {
      const { endDateSelected, endDate, } = this.range;
      if (endDateSelected && isSameDay(endDate, currentDay)) {
        return true;
      }
      return this.isMouseHover && isSameDay(this.hoverDate, currentDay) && !endDateSelected;
    },
  },
});

function dateToKey(date: Date): string {
  return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
}

function getDisabledGroupDates(start: Date, startDayOfNextMonth: Date, disabled: Set<string>): string[] {
  const result: string[] = [];
  let current = start;
  let foundFirstDisabled = false;
  while (!isSameDay(current, startDayOfNextMonth)) {
    const key = dateToKey(current);
    foundFirstDisabled = foundFirstDisabled || disabled.has(key);
    if (foundFirstDisabled) {
      result.push(key);
    }
    current = addDays(current, 1);
  }
  return result;
}
</script>

<style scoped lang="scss">
.eo-calendar-main {
  display: inline-flex;
  flex-direction: column;
}

.eo-calendar-days {
  display: inline-grid;
  grid-template-columns: repeat(7, 1fr);
  justify-items: center;
  margin-top: 10px;
  grid-row-gap: 10px;
}

.eo-day-of-week {
  color: $gray-lighter-color;
}

.eo-day-button {
  width: 40px;
  height: 40px;
}

.eo-disabled {
  color: $gray-lightest-color;
}

.eo-day-inner {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  border-radius: 50%;

  .eo-start-day &,
  .eo-end-day & {
    background-color: $green-color;
    color: white;
  }

  .eo-today & {
    color: $green-color;
    border: 3px solid $green-light-color;
  }

  .eo-day-button:hover:not(.eo-start-day):not(.eo-end-day):not(.eo-today):not(.eo-disabled) & {
    border: 1px solid $green-color;
  }
}

.eo-between {
  background-color: $green-lightest-color;
  &.eo-start-day {
    border-bottom-left-radius: 50%;
    border-top-left-radius: 50%;
  }
}

.eo-end-day {
  border-bottom-right-radius: 50%;
  border-top-right-radius: 50%;
}
</style>
