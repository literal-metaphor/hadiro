export default function getMondayAndFridayThisWork() {
    const today = new Date();
    const day = today.getDay(); // Get current day. 0 Sunday, 1 Monday, ..., 6 Saturday
  
    // Calculate days until Monday and Friday
    const untilMonday = day === 0 ? -6 : 1 - day;
    const untilFriday = day === 0 ? -2 : 5 - day;

    const monday = new Date(today);
    monday.setDate(today.getDate() + untilMonday);
    const friday = new Date(today);
    friday.setDate(today.getDate() + untilFriday);
  
    return {
      monday,
      friday,
    };
  }