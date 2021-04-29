// Lists API routes

const data = [
  {
    index: [
      ".../api",
      {
        comments: [
          {
            index: ".../comments",
            GET: "retrieve ALL Comments instances",
            POST: "create a new Comment instance",
          },
        ],
      },
      {
        posts: [
          {
            index: ".../posts",
            GET: "retrieve ALL Post instances",
            POST: "create a new Post instance",
          },
          {
            single_post: ".../posts/<Post._id>",
            GET: "retrieves a specified Post instance",
          },
          {
            "add/remove like from post or profile":
              ".../posts/<Post._id>/likes",
            GET: "retrieve a specified Post instance",
            POST:
              "adds or removes a UserProfile._id to a Post.likes array and reverse",
          },
        ],
      },
      {
        profiles: [
          {
            index: ".../profiles",
            GET: "retrieve ALL UserProfiles instances",
            POST: "create a new UserProfile instance with a given UID (auth)",
          },
          {
            single_profile: ".../profils/<Profile._id>",
            GET: "Retrieves a single UserProfile instanc",
          },
          {
            "single profile from User._id": ".../profiles/u/<UID>",
            GET:
              "retrieves a single, populated UserProfile instance give a UID (from auth collection)",
          },
        ],
      },
    ],
  },
];

export default async (req, res) => {
  return res.status(200).json(data);
};
