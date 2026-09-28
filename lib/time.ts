class Time {
  static MINUTE = 60;
  static HOUR = this.MINUTE * 60;
  static DAY = this.HOUR * 24;

  static minutes(quantity: number) {
    return quantity * Time.MINUTE;
  }

  static hours(quantity: number) {
    return quantity * Time.HOUR;
  }

  static days(quantity: number) {
    return quantity * Time.DAY;
  }
}

export default Time;
