<template>
  <div class="eo-calendar-main">
    <CalendarNavigation
      :current-date="currentDate"
      @onPreviousMonth="onPreviousMonth"
      @onNextMonth="onNextMonth"
    />
    <div class="eo-calendar-days">
      <div
        v-for="dayOfWeek of daysOfWeeks"
        :key="dayOfWeek"
        class="eo-day-of-week eo-text-small"
      >
        {{ dayOfWeek }}
      </div>
      <CustomButton
        v-for="day of daysForCurrentMonth"
        :key="day.key"
        class="eo-text-small eo-day-button"
        :class="{ 'eo-today': day.isToday, 'eo-disabled': day.disabled }"
        :custom-styles="false"
      >
        {{ day.day }}
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
  subMonths
} from 'date-fns';
import Vue, { PropType } from 'vue';
import CustomButton from '@/components/basic/atoms/CustomButton.vue';
import CalendarNavigation from '@/components/basic/molecules/Calendar/CalendarNavigation.vue';

const DAYS_SHORT = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', ];

interface CalendarDay {
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
  },
  data() {
    return {
      currentDate: new Date(),
    };
  },
  computed: {
    daysOfWeeks(): string[] {
      return [ ...DAYS_SHORT.slice(this.startDayOfWeek), ...DAYS_SHORT.slice(0, this.startDayOfWeek), ];
    },
    daysForCurrentMonth(): CalendarDay[] {
      const result: CalendarDay[] = [];
      const { startDayOfCalendar, endDayOfCalendar, } = this;
      let currentDay = startDayOfCalendar;
      const today = new Date();
      const startDayOfNextMonth = addDays(endDayOfCalendar, 1);
      while (!isSameDay(currentDay, startDayOfNextMonth)) {
        result.push({
          day: getDate(currentDay),
          disabled: this.disabledSet.has(this.dateToKey(currentDay)),
          isBetween: false,
          isEnd: false,
          isStart: false,
          isToday: isSameDay(currentDay, today),
          key: this.dateToKey(currentDay),
        });
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
      while (getDay(currentDate) !== this.startDayOfWeek) {
        currentDate = subDays(currentDate, 1);
      }
      return currentDate;
    },
    endDayOfCalendar(): Date {
      let currentDate = lastDayOfMonth(new Date(this.currentYear, this.currentMonth, 1));
      while (getDay(currentDate) !== (this.startDayOfWeek + 6) % 7) {
        currentDate = addDays(currentDate, 1);
      }
      return currentDate;
    },
    disabledSet(): Set<string> {
      return new Set<string>(this.disabledDates.map(d => this.dateToKey(d)));
    },
  },
  methods: {
    onPreviousMonth(): void {
      this.currentDate = subMonths(this.currentDate, 1);
    },
    onNextMonth(): void {
      this.currentDate = addMonths(this.currentDate, 1);
    },
    dateToKey(date: Date): string {
      return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
    },
  },
});
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
}

.eo-day-of-week {
  color: $gray-lighter-color;
}

.eo-day-button {
  width: 40px;
  height: 40px;
}

.eo-today {
  color: $green-color;
  border: 3px solid $green-light-color;
  border-radius: 50%;
}

.eo-disabled {
  color: $gray-lightest-color;
}
</style>
