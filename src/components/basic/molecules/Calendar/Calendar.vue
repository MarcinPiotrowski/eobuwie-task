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
        v-for="{ key, isToday, disabled, isStart, isEnd, isBetween, date, day } of calendarDaysForCurrentMonth"
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

export type OptionalDate = Date | undefined;

export interface DateRange {
  startDate: OptionalDate;
  endDate: OptionalDate;
}

export function isDateSet(date: OptionalDate): date is Date {
  return date !== undefined;
}

export function isDateNotSet(date: OptionalDate): date is undefined {
  return date === undefined;
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
  data(): { range: DateRange, startOfCurrentMonthDate: Date, hoverDate: OptionalDate } {
    return {
      range: {
        ...this.initialRange,
      },
      startOfCurrentMonthDate: currentStartOfMonth(),
      hoverDate: undefined,
    };
  },
  computed: {
    startDayOfWeekNormalized(): number {
      return this.startDayOfWeek % 7;
    },
    endDayOfWeekNormalized(): number {
      return (this.startDayOfWeekNormalized + 6) % 7;
    },
    daysOfWeeks(): string[] {
      return [ ...DAYS_SHORT.slice(this.startDayOfWeekNormalized), ...DAYS_SHORT.slice(0, this.startDayOfWeekNormalized), ];
    },
    calendarDaysForCurrentMonth(): CalendarDay[] {
      const today = new Date();
      return this.daysForCurrentMonth.map(d => {
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
      });
    },
    daysForCurrentMonth(): Date[] {
      const result: Date[] = [];
      const { startDayOfCalendarMonthView, startDayOfNextMonth, } = this;
      let iterDate = startDayOfCalendarMonthView;
      while (!isSameDay(iterDate, startDayOfNextMonth)) {
        result.push(iterDate);
        iterDate = addDays(iterDate, 1);
      }

      return result;
    },
    startDayOfCalendarMonthView(): Date {
      let {
        startOfCurrentMonthDate: iterDate,
        startDayOfWeekNormalized,
      } = this;
      while (getDay(iterDate) !== startDayOfWeekNormalized) {
        iterDate = subDays(iterDate, 1);
      }
      return iterDate;
    },
    endDayOfCalendarMonthView(): Date {
      let {
        startOfCurrentMonthDate: iterDate,
        endDayOfWeekNormalized,
      } = this;
      iterDate = lastDayOfMonth(iterDate);
      while (getDay(iterDate) !== endDayOfWeekNormalized) {
        iterDate = addDays(iterDate, 1);
      }
      return iterDate;
    },
    startDayOfNextMonth(): Date {
      return addDays(this.endDayOfCalendarMonthView, 1);
    },
    disabledSet(): Set<string> {
      const {
        range: { startDate, endDate, },
        disabledDates,
        startDayOfNextMonth,
      } = this;
      const datesKeys = disabledDates.map(dateToKey);
      const datesSet = new Set<string>(datesKeys);
      if (isDateSet(startDate) && isDateNotSet(endDate)) {
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
      this.startOfCurrentMonthDate = subMonths(this.startOfCurrentMonthDate, 1);
    },
    onNextMonth(): void {
      this.startOfCurrentMonthDate = addMonths(this.startOfCurrentMonthDate, 1);
    },
    selectDate(date: Date): void {
      this.hoverDate = undefined;
      const {
        range,
        range: { startDate, endDate, },
      } = this;
      if (isSameValidDay(date, startDate) && isDateNotSet(endDate)) {
        range.startDate = undefined;
        return;
      }
      if (isDateSet(startDate) && isDateNotSet(endDate) && isBefore(date, startDate)) {
        range.startDate = date;
      } else if (isDateNotSet(startDate) || isDateSet(endDate)) {
        range.endDate = undefined;
        range.startDate = date;
      } else {
        range.endDate = date;
      }
      this.$emit('rangeChanged', { ...range, });
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
      const {
        range: { startDate, endDate, },
        hoverDate,
      }: { range: DateRange, hoverDate: OptionalDate } = this;
      if (isDateNotSet(startDate)) {
        return false;
      }
      const end = isDateSet(endDate) ? endDate
        : isDateSet(hoverDate) ? hoverDate : startDate;
      return (isSameDay(date, startDate) || isAfter(date, startDate)) &&
          (isSameDay(date, end) || isBefore(date, end));
    },
    isStartDay(currentDay: Date) {
      return isSameValidDay(this.range.startDate, currentDay);
    },
    isEndDay(currentDay: Date) {
      const { range: { endDate, }, hoverDate, }: { range: DateRange, hoverDate: OptionalDate } = this;
      if (isSameValidDay(endDate, currentDay)) {
        return true;
      }
      return isSameValidDay(hoverDate, currentDay) && isDateNotSet(endDate);
    },
  },
});

function isSameValidDay(firstDate: OptionalDate, secondDate: OptionalDate): boolean {
  if (isDateNotSet(firstDate) || isDateNotSet(secondDate)) {
    return false;
  }
  return isSameDay(firstDate, secondDate);
}

function currentStartOfMonth(): Date {
  const currentDate = new Date();
  return new Date(getYear(currentDate), getMonth(currentDate), 1);
}

function dateToKey(date: Date): string {
  return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
}

function getDisabledGroupDates(start: Date, startDayOfNextMonth: Date, disabled: Set<string>): string[] {
  const result: string[] = [];
  let iterDate = start;
  let foundFirstDisabled = false;
  while (!isSameDay(iterDate, startDayOfNextMonth)) {
    const key = dateToKey(iterDate);
    foundFirstDisabled ||= disabled.has(key);
    if (foundFirstDisabled) {
      result.push(key);
    }
    iterDate = addDays(iterDate, 1);
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
