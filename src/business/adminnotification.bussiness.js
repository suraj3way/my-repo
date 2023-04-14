// Models
import AdminNotificationModel from '@/models/adminnotification.model';

const create = async (body) => {
  const script = await AdminNotificationModel.create({
    ...body
  });
  return script;
};

const getAll = async () => {
  // Database query
  return await AdminNotificationModel.find({});
};




export default {
  create,
  getAll
};
