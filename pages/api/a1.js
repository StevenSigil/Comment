// import { connectToDatabase } from '../../util/mongodb-example';

// export default async (req, res) => {
//   const { db } = await connectToDatabase();

//   const listOfPosts = await db.collection('posts').find().toArray();

//   return res.json(listOfPosts);
// }