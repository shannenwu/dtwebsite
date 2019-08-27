import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Header, Grid, Loader } from 'semantic-ui-react';
import axios from 'axios';
import './schedule.css';

class TimeSelection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      danceObj: null,
      scheduleObj: null,
      isProd: false,
      choreographerTimes: null,
      schedule: null,
      interval: null,
      selectedTime: '',
      loading: true
    }
  }

  static propTypes = {
    getSingleDance: PropTypes.func.isRequired
  }

  static defaultProps = {
  }

  async componentDidMount() {
    document.title = 'Availabilities';

    const { getSingleDance } = this.props;
    const [danceResponse, scheduleResponse] = await Promise.all([
      getSingleDance(this.props.match.params.danceId),
      axios.get(`/api/schedule/${this.props.match.params.danceId}`)
    ]);
    this.setState({
      danceObj: danceResponse.data,
      scheduleObj: scheduleResponse.data.timeToConflicts,
      isProd: scheduleResponse.data.isProd,
      choreographerTimes: scheduleResponse.data.choreographerTimes,
      schedule: scheduleResponse.data.times,
      interval: scheduleResponse.data.interval,
      loading: false
    })
  }

  selectTime = (time) => {
    this.setState({
      selectedTime: time
    })
  }

  formatDate = (date) => {
    var dayOfWeek = new Date(date).getDay();
    return isNaN(dayOfWeek) ? null : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek];
  }

  formatHour = (hour) => {
    const m = hour % 1 === 0.5 ? '30' : '00'
    const intHour = Math.floor(hour)
    const h = intHour === 0 || intHour === 12 || intHour === 24 ? 12 : intHour % 12
    const abb = intHour < 12 || intHour === 24 ? 'am' : 'pm'
    return `${h}:${m}${abb}`
  }

  renderTimeLabels = () => {
    const { interval } = this.state;
    const labels = [<div className='date-label' key={-1} />] // Ensures time labels start at correct location
    for (let t = interval.startTime; t <= interval.endTime; t += 0.5) {
      labels.push(
        <div className='time-label-cell' key={t}>
          <div className='time-text'>{this.formatHour(t)}</div>
        </div>
      )
    }
    return <div className='schedule-column'>{labels}</div>
  }

  renderDateColumn = (dayOfTimes) => (
    <div className='schedule-column' key={dayOfTimes[0]}>
      <div className='grid-cell'>
        <div className='date-label'>{this.formatDate(dayOfTimes[0])}</div>
      </div>
      {dayOfTimes.map(time => this.renderDateCellWrapper(time))}
    </div>
  )

  renderDateCellWrapper = (time) => {
    return (
      <div
        className='grid-cell'
        role='presentation'
        key={time}
      >
        {this.renderDateCell(time)}
      </div>
    )
  }

  renderDateCell = (time) => {
    const { scheduleObj, choreographerTimes, selectedTime } = this.state;
    const numConflicts = scheduleObj[time].length;
    // If any choreographers are not available at this time, immediately render cell black.
    const name = numConflicts < 9 && !choreographerTimes.includes(time) ? 'num-' + numConflicts : 'num-max';
    const isSelected = time === selectedTime ? 'selected-cell' : '';
    return (
      <div className={`date-cell ${name} ${isSelected}`} onClick={() => this.selectTime(time)}>{numConflicts}</div>
    )
  }

  render() {
    const {
      danceObj,
      scheduleObj,
      schedule,
      selectedTime,
      loading
    } = this.state;

    if (loading) {
      return (
        <Dimmer active inverted className='time-loader'>
          <Loader content='Loading availabilities...' />
        </Dimmer>
      );
    }

    return (
      <div id='time-selection-page'>
        <Header as='h1' style={{textTransform: 'capitalize'}}>
          {danceObj.name}
        </Header>
        <Header.Subheader style={{textTransform: 'capitalize'}}>
          {danceObj.level + ' ' + danceObj.style}
        </Header.Subheader>
        <Grid padded divided stackable columns={2}>
          <Grid.Column width={10}>
            <div id='schedule-wrapper'>
              <div id='schedule-grid'>
                {this.renderTimeLabels()}
                {schedule.map(this.renderDateColumn)}
              </div>
            </div>
          </Grid.Column>
          <Grid.Column width={6}>
            <Header as='h3'>
              Conflicts
              {selectedTime ? (
                <Header.Subheader>
                  {scheduleObj[selectedTime].length + ' dancers with conflicts at selected.'}
                </Header.Subheader>
              ) : (
                <Header.Subheader>
                  No time selected.
                </Header.Subheader>
              )}
            </Header>
            {selectedTime && (
              scheduleObj[selectedTime].map((conflict, index) => {
                return (
                  <Header as='h4' key={index}>
                    {conflict.firstName + ' ' + conflict.lastName}
                    <Header.Subheader>{conflict.description}</Header.Subheader>
                  </Header>
                )
              }))}
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

export default TimeSelection;
