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
  
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));
  const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 7));

  // Database query with filter for the current week
  return await NotificationModel.find({ createdAt: { $gte: startOfWeek, $lte: endOfWeek }, deleted_at: null });
};



export default {
  create,
  getAll
};
