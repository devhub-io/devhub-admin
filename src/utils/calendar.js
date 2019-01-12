export function getNumberOfDaysInMonth(date) {
  const d = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  return d.getDate()
}

export function chunk(array, size = 1) {
  const result = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}

export function generateCalendar(date, startDay = 0) {
  const DAYS_OF_THE_WEEK = 7

  const currentDate = date
  const numberOfDays = getNumberOfDaysInMonth(currentDate)

  currentDate.setDate(1)
  let firstDayOfWeek = currentDate.getDay()

  firstDayOfWeek = (DAYS_OF_THE_WEEK - (startDay - firstDayOfWeek)) %
    DAYS_OF_THE_WEEK

  const month = [
    ...new Array(firstDayOfWeek).fill(),
    ...new Array(numberOfDays).fill().map((el, i) => i + 1)
  ]

  return chunk(month, DAYS_OF_THE_WEEK)
}
