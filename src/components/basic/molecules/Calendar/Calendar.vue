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
  startDate: Date | undefined;
  endDate: Date | undefined;
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
  components: {
    CalendarNavigation,
    CustomButton,
  },
  props: {
    startDayOfWeek: {
      type: Number,
      required: false,
      default: 0,
    },
    disabledDates: {
      type: Array as PropType<Array<Date>>,
      default: (): Date[] => [],
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
  data(): { range: DateRange, currentDate: Date, hoverDate: Date | undefined } {
    return {
      range: {
        ...this.initialRange,
      },
      currentDate: new Date(),
      hoverDate: undefined,
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
      const { startDate, endDate, } = this.range;
      if (startDate !== undefined && endDate === undefined) {
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
    initialRange(newVal) {
      this.range = newVal;
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
      this.hoverDate = undefined;
      const { startDate, endDate, } = this.range;
      if (startDate !== undefined && endDate === undefined && isSameDay(date, startDate)) {
        this.range.startDate = undefined;
        return;
      }
      if (startDate !== undefined && endDate === undefined && isBefore(date, startDate)) {
        this.range.startDate = date;
      } else if (startDate === undefined || endDate !== undefined) {
        this.range.endDate = undefined;
        this.range.startDate = date;
      } else {
        this.range.endDate = date;
      }
      this.$emit('rangeChanged', this.range);
    },
    onMouseHover(date: Date, disabled: boolean): void {
      if (disabled) {
        return;
      }
      this.hoverDate = date;
    },
    onMouseLeave(): void {
      this.hoverDate = undefined;
    },
    isDateBetween(date: Date): boolean {
      const { startDate, endDate, } = this.range;
      if (startDate === undefined) {
        return false;
      }
      const end = endDate !== undefined ? endDate
        : (this.hoverDate === undefined ? startDate : this.hoverDate);
      return (isSameDay(date, startDate) || isAfter(date, startDate)) &&
          (isSameDay(date, end) || isBefore(date, end));
    },
    isStartDay(currentDay: Date) {
      return this.range.startDate !== undefined && isSameDay(this.range.startDate, currentDay);
    },
    isEndDay(currentDay: Date) {
      const { endDate, } = this.range;
      if (endDate !== undefined && isSameDay(endDate, currentDay)) {
        return true;
      }
      return this.hoverDate !== undefined && isSameDay(this.hoverDate, currentDay) && endDate === undefined;
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

<style scoped
       lang="scss">
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
