export const getTime = () => {
    const dateArr = new Date()
    .toLocaleString("he-IL", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    .split(" ");

  const weekday = dateArr[1].replace(",", "");
  const day = dateArr[2];
  const month = dateArr[3].replace("ב", "");
  const year = dateArr[4];

  const hours = new Date(Date.now()).getHours();
  const minutes = new Date(Date.now()).getMinutes();

  return { year, month, day, weekday, hours, minutes };
};
