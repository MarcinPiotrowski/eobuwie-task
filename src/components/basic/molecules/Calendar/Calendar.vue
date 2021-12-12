<template>
  <div class="eo-calendar-main">
    <div>
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
    </div>
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
        :class="{ 'eo-today': day.isToday }"
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
import Vue from 'vue';
import CustomButton from '@/components/basic/atoms/CustomButton.vue';
import IconBase from '@/components/basic/atoms/icons/IconBase.vue';
import ArrowLeft from '@/components/basic/atoms/icons/ArrowLeft.vue';
import ArrowRight from '@/components/basic/atoms/icons/ArrowRight.vue';

const DAYS_SHORT = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', ];
const MONTHS = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', ];

interface CalendarDay {
  key: string;
  day: number;
  available: boolean;
  isToday: boolean;
  isBetween: boolean;
  isStart: boolean;
  isEnd: boolean;
}
export default Vue.extend({
  name: 'Calendar',
  components: { ArrowRight, ArrowLeft, IconBase, CustomButton, },
  props: {
    startDayOfWeek: {
      type: Number,
      required: false,
      default: 0,
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
          available: true,
          isBetween: false,
          isEnd: false,
          isStart: false,
          isToday: isSameDay(currentDay, today),
          key: `${currentDay.getDate()}-${currentDay.getMonth()}-${currentDay.getFullYear()}`,
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
    currentMonthName(): string {
      return MONTHS[this.currentMonth];
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
  },
  methods: {
    onPreviousMonth(): void {
      this.currentDate = subMonths(this.currentDate, 1);
    },
    onNextMonth(): void {
      this.currentDate = addMonths(this.currentDate, 1);
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

.eo-month-navigation {
  display: flex;
  width: 100%;
}

.eo-month {
  flex-grow: 1;
  font-weight: bold;
  text-align: center;
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
</style>
