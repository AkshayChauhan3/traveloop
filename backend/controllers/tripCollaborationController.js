const prisma = require('../lib/prisma');

const getAccessibleTrip = async (tripId, userId) => {
  return prisma.trip.findFirst({
    where: {
      id: parseInt(tripId, 10),
      OR: [
        { userId },
        { members: { some: { userId } } }
      ]
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              profilePhoto: true
            }
          }
        }
      }
    }
  });
};

const getOwnerTrip = async (tripId, userId) => {
  return prisma.trip.findFirst({
    where: {
      id: parseInt(tripId, 10),
      userId
    }
  });
};

const mapMember = (member) => ({
  id: member.id,
  tripId: member.tripId,
  userId: member.userId,
  role: member.role,
  joinedAt: member.joinedAt,
  user: member.user
});

const mapNote = (note) => ({
  id: note.id,
  tripId: note.tripId,
  tripStopId: note.tripStopId,
  authorId: note.authorId,
  title: note.title,
  content: note.content,
  createdAt: note.createdAt,
  author: note.author,
  tripStop: note.tripStop
});

const mapPackingItem = (item) => ({
  id: item.id,
  tripId: item.tripId,
  addedByUserId: item.addedByUserId,
  itemName: item.itemName,
  category: item.category,
  isPacked: item.isPacked,
  createdAt: item.createdAt,
  addedBy: item.addedBy
});

const parseBoolean = (value) => {
  if (value === true || value === false) return value;
  if (value === 'true' || value === '1') return true;
  if (value === 'false' || value === '0') return false;
  return Boolean(value);
};

const joinTripByShareSlug = async (shareSlug, userId) => {
  try {
    const trip = await prisma.trip.findFirst({
      where: { shareSlug },
      include: {
        members: true
      }
    });

    if (!trip) {
      return {
        success: false,
        message: 'Trip not found'
      };
    }

    const existingMembership = trip.members.find((member) => member.userId === userId);
    if (existingMembership || trip.userId === userId) {
      return {
        success: true,
        message: 'Already joined this trip',
        data: {
          tripId: trip.id,
          shareSlug: trip.shareSlug
        }
      };
    }

    const membership = await prisma.tripMember.create({
      data: {
        tripId: trip.id,
        userId,
        role: 'MEMBER'
      }
    });

    return {
      success: true,
      message: 'Joined trip successfully',
      data: membership
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error joining trip',
      error: error.message
    };
  }
};

const addTripMember = async (tripId, payload, userId) => {
  try {
    const trip = await getOwnerTrip(tripId, userId);
    if (!trip) {
      return {
        success: false,
        message: 'Only the trip owner can add members'
      };
    }

    const memberEmail = payload.email;
    const memberUserId = payload.userId ? parseInt(payload.userId, 10) : null;

    if (!memberEmail && !memberUserId) {
      return {
        success: false,
        message: 'Provide email or userId'
      };
    }

    const user = memberUserId
      ? await prisma.user.findUnique({ where: { id: memberUserId } })
      : await prisma.user.findUnique({ where: { email: memberEmail } });

    if (!user) {
      return {
        success: false,
        message: 'User not found'
      };
    }

    const existingMembership = await prisma.tripMember.findUnique({
      where: {
        tripId_userId: {
          tripId: trip.id,
          userId: user.id
        }
      }
    });

    if (existingMembership) {
      return {
        success: true,
        message: 'User is already a member',
        data: existingMembership
      };
    }

    const membership = await prisma.tripMember.create({
      data: {
        tripId: trip.id,
        userId: user.id,
        role: 'MEMBER'
      }
    });

    return {
      success: true,
      message: 'Member added successfully',
      data: membership
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error adding trip member',
      error: error.message
    };
  }
};

const listTripMembers = async (tripId, userId) => {
  try {
    const trip = await getAccessibleTrip(tripId, userId);
    if (!trip) {
      return {
        success: false,
        message: 'Trip not found or unauthorized'
      };
    }

    return {
      success: true,
      data: trip.members.map(mapMember)
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error listing trip members',
      error: error.message
    };
  }
};

const removeTripMember = async (tripId, memberUserId, userId) => {
  try {
    const trip = await getOwnerTrip(tripId, userId);
    if (!trip && parseInt(memberUserId, 10) !== userId) {
      return {
        success: false,
        message: 'Only the trip owner or the member themselves can remove a member'
      };
    }

    if (parseInt(memberUserId, 10) === trip?.userId) {
      return {
        success: false,
        message: 'Owner cannot be removed from the trip'
      };
    }

    const membership = await prisma.tripMember.findUnique({
      where: {
        tripId_userId: {
          tripId: parseInt(tripId, 10),
          userId: parseInt(memberUserId, 10)
        }
      }
    });

    if (!membership) {
      return {
        success: false,
        message: 'Member not found in this trip'
      };
    }

    if (userId !== trip?.userId && parseInt(memberUserId, 10) !== userId) {
      return {
        success: false,
        message: 'Only the trip owner can remove other members'
      };
    }

    const removed = await prisma.tripMember.delete({
      where: {
        tripId_userId: {
          tripId: parseInt(tripId, 10),
          userId: parseInt(memberUserId, 10)
        }
      }
    });

    return {
      success: true,
      message: 'Member removed successfully',
      data: removed
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error removing member',
      error: error.message
    };
  }
};

const createTripNote = async (tripId, data, userId) => {
  try {
    const trip = await getAccessibleTrip(tripId, userId);
    if (!trip) {
      return {
        success: false,
        message: 'Trip not found or unauthorized'
      };
    }

    if (!data.content) {
      return {
        success: false,
        message: 'Missing required field: content'
      };
    }

    if (data.trip_stop_id) {
      const tripStop = await prisma.tripStop.findFirst({
        where: {
          id: parseInt(data.trip_stop_id, 10),
          tripId: parseInt(tripId, 10)
        }
      });

      if (!tripStop) {
        return {
          success: false,
          message: 'Trip stop not found in this trip'
        };
      }
    }

    const note = await prisma.tripNote.create({
      data: {
        tripId: parseInt(tripId, 10),
        tripStopId: data.trip_stop_id ? parseInt(data.trip_stop_id, 10) : null,
        authorId: userId,
        title: data.title || null,
        content: data.content
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profilePhoto: true
          }
        }
      }
    });

    return {
      success: true,
      message: 'Trip note created successfully',
      data: note
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error creating trip note',
      error: error.message
    };
  }
};

const listTripNotes = async (tripId, userId) => {
  try {
    const trip = await getAccessibleTrip(tripId, userId);
    if (!trip) {
      return {
        success: false,
        message: 'Trip not found or unauthorized'
      };
    }

    const notes = await prisma.tripNote.findMany({
      where: { tripId: parseInt(tripId, 10) },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profilePhoto: true
          }
        },
        tripStop: true
      }
    });

    return {
      success: true,
      data: notes.map(mapNote)
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error listing trip notes',
      error: error.message
    };
  }
};

const updateTripNote = async (noteId, data, userId) => {
  try {
    const note = await prisma.tripNote.findFirst({
      where: {
        id: parseInt(noteId, 10),
        OR: [
          { authorId: userId },
          { trip: { userId } }
        ]
      }
    });

    if (!note) {
      return {
        success: false,
        message: 'Note not found or unauthorized'
      };
    }

    const updated = await prisma.tripNote.update({
      where: { id: parseInt(noteId, 10) },
      data: {
        title: data.title !== undefined ? data.title : undefined,
        content: data.content !== undefined ? data.content : undefined,
        tripStopId: data.trip_stop_id !== undefined ? (data.trip_stop_id ? parseInt(data.trip_stop_id, 10) : null) : undefined
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profilePhoto: true
          }
        }
      }
    });

    return {
      success: true,
      message: 'Trip note updated successfully',
      data: updated
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error updating trip note',
      error: error.message
    };
  }
};

const deleteTripNote = async (noteId, userId) => {
  try {
    const note = await prisma.tripNote.findFirst({
      where: {
        id: parseInt(noteId, 10),
        OR: [
          { authorId: userId },
          { trip: { userId } }
        ]
      }
    });

    if (!note) {
      return {
        success: false,
        message: 'Note not found or unauthorized'
      };
    }

    const deleted = await prisma.tripNote.delete({
      where: { id: parseInt(noteId, 10) }
    });

    return {
      success: true,
      message: 'Trip note deleted successfully',
      data: deleted
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error deleting trip note',
      error: error.message
    };
  }
};

const createPackingItem = async (tripId, data, userId) => {
  try {
    const trip = await getAccessibleTrip(tripId, userId);
    if (!trip) {
      return {
        success: false,
        message: 'Trip not found or unauthorized'
      };
    }

    if (!data.item_name) {
      return {
        success: false,
        message: 'Missing required field: item_name'
      };
    }

    const item = await prisma.packingItem.create({
      data: {
        tripId: parseInt(tripId, 10),
        addedByUserId: userId,
        itemName: data.item_name,
        category: data.category || null,
        isPacked: parseBoolean(data.is_packed)
      },
      include: {
        addedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profilePhoto: true
          }
        }
      }
    });

    return {
      success: true,
      message: 'Packing item created successfully',
      data: item
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error creating packing item',
      error: error.message
    };
  }
};

const listPackingItems = async (tripId, userId) => {
  try {
    const trip = await getAccessibleTrip(tripId, userId);
    if (!trip) {
      return {
        success: false,
        message: 'Trip not found or unauthorized'
      };
    }

    const items = await prisma.packingItem.findMany({
      where: { tripId: parseInt(tripId, 10) },
      orderBy: { createdAt: 'desc' },
      include: {
        addedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profilePhoto: true
          }
        }
      }
    });

    return {
      success: true,
      data: items.map(mapPackingItem)
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error listing packing items',
      error: error.message
    };
  }
};

const updatePackingItem = async (itemId, data, userId) => {
  try {
    const item = await prisma.packingItem.findFirst({
      where: {
        id: parseInt(itemId, 10),
        trip: {
          OR: [
            { userId },
            { members: { some: { userId } } }
          ]
        }
      }
    });

    if (!item) {
      return {
        success: false,
        message: 'Packing item not found or unauthorized'
      };
    }

    const updated = await prisma.packingItem.update({
      where: { id: parseInt(itemId, 10) },
      data: {
        itemName: data.item_name !== undefined ? data.item_name : undefined,
        category: data.category !== undefined ? data.category : undefined,
        isPacked: data.is_packed !== undefined ? Boolean(data.is_packed) : undefined
      },
      include: {
        addedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profilePhoto: true
          }
        }
      }
    });

    return {
      success: true,
      message: 'Packing item updated successfully',
      data: updated
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error updating packing item',
      error: error.message
    };
  }
};

const deletePackingItem = async (itemId, userId) => {
  try {
    const item = await prisma.packingItem.findFirst({
      where: {
        id: parseInt(itemId, 10),
        trip: {
          OR: [
            { userId },
            { members: { some: { userId } } }
          ]
        }
      }
    });

    if (!item) {
      return {
        success: false,
        message: 'Packing item not found or unauthorized'
      };
    }

    const deleted = await prisma.packingItem.delete({
      where: { id: parseInt(itemId, 10) }
    });

    return {
      success: true,
      message: 'Packing item deleted successfully',
      data: deleted
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error deleting packing item',
      error: error.message
    };
  }
};

module.exports = {
  joinTripByShareSlug,
  addTripMember,
  listTripMembers,
  removeTripMember,
  createTripNote,
  listTripNotes,
  updateTripNote,
  deleteTripNote,
  createPackingItem,
  listPackingItems,
  updatePackingItem,
  deletePackingItem
};
