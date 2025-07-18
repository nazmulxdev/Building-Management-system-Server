import { apartmentsCollection, usersCollection } from "../../config/db.js";

const adminOverview = async (req, res) => {
  try {
    // const usersPipeLine = [
    //   {
    //     $group: {
    //       _id: "$role",
    //       count: {
    //         $sum: 1,
    //       },
    //     },
    //   },
    //   {
    //     $project: {
    //       role: "$_id",
    //       count: 1,
    //       _id: 0,
    //     },
    //   },
    // ];

    const usersPipeLine = [
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          totalUsers: { $sum: "$count" },
          roles: {
            $push: {
              k: "$_id",
              v: "$count",
            },
          },
        },
      },
      {
        $addFields: {
          roles: { $arrayToObject: "$roles" },
        },
      },
      {
        $project: {
          _id: 0,
          totalUsers: 1,
          totalMember: { $ifNull: ["$roles.member", 0] },
          totalAdmin: { $ifNull: ["$roles.admin", 0] },
          percentageOfUsers: {
            $round: [
              {
                $multiply: [
                  { $divide: [{ $ifNull: ["$roles.user", 0] }, "$totalUsers"] },
                  100,
                ],
              },
              2,
            ],
          },
          percentageOfMember: {
            $round: [
              {
                $multiply: [
                  {
                    $divide: [{ $ifNull: ["$roles.member", 0] }, "$totalUsers"],
                  },
                  100,
                ],
              },
              2,
            ],
          },
          percentageOfAdmin: {
            $round: [
              {
                $multiply: [
                  {
                    $divide: [{ $ifNull: ["$roles.admin", 0] }, "$totalUsers"],
                  },
                  100,
                ],
              },
              2,
            ],
          },
        },
      },
    ];
    const apartmentPipeline = [
      {
        $group: {
          _id: null,
          totalApartments: { $sum: 1 },
          availableApartments: {
            $sum: { $cond: [{ $eq: ["$status", "available"] }, 1, 0] },
          },
          pendingApartments: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          bookedApartments: {
            $sum: { $cond: [{ $eq: ["$status", "booked"] }, 1, 0] },
          },
          totalBedrooms: { $sum: "$bedrooms" },
          availableBedrooms: {
            $sum: {
              $cond: [{ $eq: ["$status", "available"] }, "$bedrooms", 0],
            },
          },
          pendingBedrooms: {
            $sum: {
              $cond: [{ $eq: ["$status", "pending"] }, "$bedrooms", 0],
            },
          },
          bookedBedrooms: {
            $sum: {
              $cond: [{ $eq: ["$status", "booked"] }, "$bedrooms", 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalApartments: 1,
          availableApartments: 1,
          pendingApartments: 1,
          bookedApartments: 1,
          totalBedrooms: 1,
          availableBedrooms: 1,
          pendingBedrooms: 1,
          bookedBedrooms: 1,
          apartmentPercentage: {
            available: {
              $cond: [
                { $eq: ["$totalApartments", 0] },
                0,
                {
                  $round: [
                    {
                      $multiply: [
                        {
                          $divide: ["$availableApartments", "$totalApartments"],
                        },
                        100,
                      ],
                    },
                    2,
                  ],
                },
              ],
            },
            pending: {
              $cond: [
                { $eq: ["$totalApartments", 0] },
                0,
                {
                  $round: [
                    {
                      $multiply: [
                        { $divide: ["$pendingApartments", "$totalApartments"] },
                        100,
                      ],
                    },
                    2,
                  ],
                },
              ],
            },
            booked: {
              $cond: [
                { $eq: ["$totalApartments", 0] },
                0,
                {
                  $round: [
                    {
                      $multiply: [
                        { $divide: ["$bookedApartments", "$totalApartments"] },
                        100,
                      ],
                    },
                    2,
                  ],
                },
              ],
            },
          },
          bedroomPercentage: {
            available: {
              $cond: [
                { $eq: ["$totalBedrooms", 0] },
                0,
                {
                  $round: [
                    {
                      $multiply: [
                        { $divide: ["$availableBedrooms", "$totalBedrooms"] },
                        100,
                      ],
                    },
                    2,
                  ],
                },
              ],
            },
            pending: {
              $cond: [
                { $eq: ["$totalBedrooms", 0] },
                0,
                {
                  $round: [
                    {
                      $multiply: [
                        { $divide: ["$pendingBedrooms", "$totalBedrooms"] },
                        100,
                      ],
                    },
                    2,
                  ],
                },
              ],
            },
            booked: {
              $cond: [
                { $eq: ["$totalBedrooms", 0] },
                0,
                {
                  $round: [
                    {
                      $multiply: [
                        { $divide: ["$bookedBedrooms", "$totalBedrooms"] },
                        100,
                      ],
                    },
                    2,
                  ],
                },
              ],
            },
          },
        },
      },
    ];

    const usersResult = await usersCollection
      .aggregate(usersPipeLine)
      .toArray();
    const apartmentsResult = await apartmentsCollection
      .aggregate(apartmentPipeline)
      .toArray();
    res.status(200).json({
      success: true,
      message: "Data get successfully",
      userCount: usersResult,
      apartmentsCount: apartmentsResult,
    });
  } catch (error) {
    console.log(error);
  }
};

export { adminOverview };
