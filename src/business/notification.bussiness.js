// Models
import NotificationModel from '@/models/notification.model';

const create = async (body) => {
  const script = await NotificationModel.create({
    ...body
  });
  return script;
};

const getAll = async () => {
  // Database query
  return await NotificationModel.find({ deleted_at: null });
};

const deletnotification = async (script_id) => {
  const trade = await NotificationModel.findByIdAndUpdate(
    script_id,
    { deleted_at: new Date() },
    { new: true }
  );
  return trade;
};

export default {
  create,
  getAll,
  deletnotification
};
