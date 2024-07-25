// Users
const users = [
    {
        "userId": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "location": "New York",
        "bio": "I am a passionate environmentalist and love to share my knowledge with others.",
        "profilePicture": "profile1.jpg",
        "passwordHash": "password123",
        "role": "member"
    },
    {
        "userId": 2,
        "username": "jane_smith",
        "email": "jane@example.com",
        "location": "Los Angeles",
        "bio": "I am a sustainability enthusiast and enjoy discussing eco-friendly living.",
        "profilePicture": "profile2.jpg",
        "passwordHash": "password456",
        "role": "member"
    }
]

// For community forum
const posts = [
    {
        "postId": 1,
        "userId": 1,
        "title": "How can I reduce my carbon footprint in my daily life?",
        "description": "I want to make a positive impact on the environment, but I dont know where to start. Any tips?",
        "topicId": 1,
        "likes": 3,
        "comments": 5,
        "dateCreated": "2024-07-09T00:00:00.000Z",
        "dateUpdated": null,
        "reports": 2
    },
    {
        "postId": 2,
        "userId": 2,
        "title": "What are the benefits of switching to renewable energy sources?",
        "description": "I heard that renewable energy is the way of the future, but Im not sure what the advantages are. Can someone enlighten me?",
        "topicId": 2,
        "likes": 5,
        "comments": 7,
        "dateCreated": "2024-07-10T12:30:00.000Z",
        "dateUpdated": "2024-07-10T12:31:00.000Z",
        "reports": 1
    }
]

const comments = [
    {
        "commentId": 3,
        "postId": 1,
        "userId": 4,
        "description": "You can start by reducing your use of single-use plastics.",
        "likes": 2,
        "reports": 1,
        "dateCreated": "2024-07-17T12:00:00.000Z",
        "dateUpdated": "2024-07-17T13:00:00.000Z",
        "parentCommentId": null
    },
    {
        "commentId": 2,
        "postId": 1,
        "userId": 3,
        "description": "Start with cutting down on wastage!",
        "likes": 5,
        "reports": 1,
        "dateCreated": "2024-07-16T10:00:00.000Z",
        "dateUpdated": "2024-07-16T11:00:00.000Z",
        "parentCommentId": null
    },
    {
        "commentId": 19,
        "postId": 5,
        "userId": 7,
        "description": "We should share our experiences with sustainable gardening.",
        "likes": 0,
        "reports": 0,
        "dateCreated": "2024-07-20T18:00:00.000Z",
        "dateUpdated": "2024-07-20T19:00:00.000Z",
        "parentCommentId": null
    }
]

const topics = [
    {
        "topicId": 1,
        "topic": "Climate Action"
    },
    {
        "topicId": 2,
        "topic": "Ecotourism"
    },
    {
        "topicId": 3,
        "topic": "Green Living"
    }
]

const postLikes = [
    {
        "postId": 1,
        "userId": 4
    },
    {
        "postId": 2,
        "userId": 3
    }
]

const commentLikes = [
    {
        "commentId": 3,
        "userId": 4
    },
    {
        "commentId": 2,
        "userId": 3
    }
]

const postReports = [
    {
        "reportId": 1,
        "postId": 1,
        "userId": 9,
        "dateReported": "2024-07-15T02:35:09.000Z",
        "reason": "Inappropriate"
    },
    {
        "reportId": 2,
        "postId": 1,
        "userId": 6,
        "dateReported": "2024-07-16T00:00:00.000Z",
        "reason": "I find this offensive"
    }
]

const commentReports = [
    {
        "reportId": 1,
        "commentId": 1,
        "postId": 1,
        "userId": 1,
        "dateReported": "2024-07-16T12:00:00.000Z",
        "reason": "Rude comment!"
    },
    {
        "reportId": 2,
        "commentId": 1,
        "postId": 1,
        "userId": 5,
        "dateReported": "2024-07-18T13:00:00.000Z",
        "reason": "Inappropriate"
    },
]

module.exports = {
    users,
    posts,
    comments,
    topics,
    postLikes,
    commentLikes,
    postReports,
    commentReports
}
