import { connectToDatabase } from "../../../../util/mongodb"
import Comments from '../../../../models/commentModel';

export default async (req, res) => {
  await connectToDatabase();

  const commentId = req.query.id;

  // GET req.
  const foundComment = await Comments.findById(commentId).exec();
  return res.status(200).json(foundComment);
}