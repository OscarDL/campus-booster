import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { FC, useEffect, useState } from 'react';
import { Divider, IconButton, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker, LocalizationProvider, PickersDay } from '@mui/x-date-pickers';

import { ContentHeader } from '../../../../shared/content';
import { colors } from '../../../../../shared/utils/values';
import { useAppSelector } from '../../../../../store/store';
import { PlanningType, RenderDay } from '../../../../../shared/types/planning';

import Container from '../../../../shared/container';


type Props = {
  date: dayjs.Dayjs | null,
  setDate: React.Dispatch<React.SetStateAction<dayjs.Dayjs | null>>
};


const Calendar: FC<Props> = ({date, setDate}) => {
  const { t } = useTranslation();
  const [showDatePicker, setShowDatePicker] = useState(true);

  const { planningsList } = useAppSelector(state => state.plannings);


  const toggleDatePicker = () => setShowDatePicker(showDp => !showDp);

  const renderDay: RenderDay = (day, _, props) => {
    const dayInPlanning = planningsList?.find(planning => dayjs(planning.date).isSame(day, 'day'));
    const past = dayjs(dayInPlanning?.date).isBefore(dayjs(), 'day');

    const planningType = (): PlanningType => (
      dayInPlanning ? dayInPlanning.type : PlanningType.Empty
    );  
    const isToday = day.format(t('global.date.compare')) === dayjs().format(t('global.date.compare'));

    const dayStyle = {
      opacity: past ? 0.5 : 1,
      color: planningType() ? 'white' : '',
      backgroundColor: `var(--course-color-${planningType().toLowerCase()})`
    };

    return (
      <PickersDay
        day={day}
        selected={isToday}
        key={day.toString()}
        onDaySelect={() => null}
        style={isToday ? {} : dayStyle}
        outsideCurrentMonth={props.outsideCurrentMonth}
      />
    );
  };


  useEffect(() => {
    // Fetch planning & projects from API
    if (date) setDate(date);
  }, [date, setDate]);


  return (
    // StaticDatePicker doesn't have a style attribute, so we can
    // hide it conditionally using CSS and this container's class
    <Container className={'calendar-picker' + (showDatePicker ? '' : ' hide')}>
      <ContentHeader title={dayjs().format(t('global.date.mmm-d-yyyy'))}>
        <IconButton id="hide-calendar-btn" onClick={toggleDatePicker}>
          <span
            className="material-icons"
            style={{transform: `rotateZ(${showDatePicker ? 180 : 0}deg)`}}
          >
            arrow_drop_down
          </span>
        </IconButton>
      </ContentHeader>

      <Divider sx={{mb: '1rem'}}/>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <StaticDatePicker
          value={date}
          renderDay={renderDay}
          onChange={() => null}
          onMonthChange={setDate}
          views={['month', 'day']}
          displayStaticWrapperAs="desktop"
          maxDate={dayjs(new Date()).add(2, 'year')}
          minDate={dayjs(new Date()).subtract(5, 'year')}
          leftArrowButtonText={t('global.date.prev_month')}
          rightArrowButtonText={t('global.date.next_month')}
          renderInput={(params) => <TextField {...params}/>}
        />
      </LocalizationProvider>

      <Divider sx={{mb: '1rem'}}/>

      <div className="calendar-picker-legend">
        {colors.calendarPicker.map(color => (
          <div key={color} style={{backgroundColor: `var(--course-color-${color})`}}>
            {t('planning.colors.' + color)}
          </div>
        ))}
      </div>
    </Container>
  );
};


export default Calendar;
