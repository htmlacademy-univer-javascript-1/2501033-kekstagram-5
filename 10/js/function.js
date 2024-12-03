function isMeetingInWorkingHours(startWork, endWork, startMeeting, duration) {
  const startWorkMinutes = toMinutes(startWork);
  const endWorkMinutes = toMinutes(endWork);
  const startMeetingMinutes = toMinutes(startMeeting);
  const endMeetingMinutes = startMeetingMinutes + duration;
  return startMeetingMinutes >= startWorkMinutes && endWorkMinutes >= endMeetingMinutes;
}

function toMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// console.log(isMeetingInWorkingHours('08:00', '17:30', '14:00', 90)); // true
// console.log(isMeetingInWorkingHours('8:0', '10:0', '8:0', 120));     // true
// console.log(isMeetingInWorkingHours('08:00', '14:30', '14:00', 90)); // false
// console.log(isMeetingInWorkingHours('14:00', '17:30', '08:0', 90));  // false
// console.log(isMeetingInWorkingHours('8:00', '17:30', '08:00', 900)); // false
