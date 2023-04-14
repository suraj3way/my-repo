// Models
import NotificationModel from '@/models/notification.model';

const create = async (body) => {
  const script = await NotificationModel.create({
    ...body
  });
  return script;
};

const getAll = async () => {

  const previousweekdata = new Date();
  previousweekdata.setDate(previousweekdata.getDate() - 7);

  // Database query with filter
  return await NotificationModel.find({ createdAt: { $gte: previousweekdata },deleted_at: null});

};

const deletnotification = async () => {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

  const result = await NotificationModel.deleteMany({ deleted_at: { $lt: oneWeekAgo } });

  return result.deletedCount;
};


export default {
  create,
  getAll,
  deletnotification
};
