export const logger = (value, valueName = null) => {
  console.log("*********************************************");
  let time = new Date;
  console.log(time.getTime(), time.toLocaleTimeString());
  console.log(`${valueName || '' }`, value);
  console.log("*********************************************");
};
