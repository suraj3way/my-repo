// Models
import NotificationModel from '@/models/notification.model';

const create = async (body) => {
  const script = await NotificationModel.create({
    ...body
  });
  return script;
};

const getAll = async () => {

  const today = new Date();
  
  const startOfWeek = new Date(today.setDate(today.getDate() - (today.getDay() - 1) % 7 - 1));
  const endOfWeek = new Date(today.setDate(today.getDate() - (today.getDay() - 5) % 7));

  // Database query with filter for the current week (Monday to Friday)
  return await NotificationModel.find({ createdAt: { $gte: startOfWeek, $lte: endOfWeek }});

};


const deleteOldData = async () => {
  
  let date = new Date();
  date.setDate(date.getDate() - 7); // Get date 7 days ago

  // Set the date to the previous Monday
  date.setDate(date.getDate() - (date.getDay() - 1));

  // Get the date for the following Friday
  let friday = new Date(date);
  friday.setDate(date.getDate() + 4);

  return await NotificationModel.deleteMany({ createdAt: { $gte: date, $lte: friday }});
};




export default {
  create,
  getAll,
  deleteOldData
};
