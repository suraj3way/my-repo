// Models
import ScriptModel from '@/models/script.model';

const create = async (body) => {
  const script = await ScriptModel.create({
    ...body
  });
  return script;
};




const getAll = async () => {
  // Database query
  return await ScriptModel.find({deleted_at:null});
};




const update = async (script_id, body) => {
  const trade =await ScriptModel.findByIdAndUpdate(script_id, body, { new: true });
  return trade;
};



const deletscript = async (script_id) => {
  const trade =await ScriptModel.findByIdAndUpdate(script_id, { deleted_at: new Date() }, { new: true });
  return trade;
};



export default {
    create,
    getAll,
    update,
    deletscript
};
