/**
 * Parses comments as replies retrieved from database into easy-to-display information.
 *
 * @param {Array}comment  - Array of comments and replies.
 * @returns {Array} Array of parsed comments and replies.
 */

const parseComments = (comments) => {
    let commentWithReplies = [];

    for (let i = 0; i < comments.length; i++) {
        // if comment already in array then add reply
        if (commentWithReplies.some(comment => comment.id === comments[i].id)) {
            let reply = {
                'id': comments[i].id,
                'content': comments[i].content,
                'username': comments[i].username,
                'profilePic': comments[i].profile_picture,
            }
            
            let comment = commentWithReplies.find(comment => comment.id === comments[i].id)
            comment.replies.push(reply);
        } else {
            let comment = {
                'id': comments[i].id,
                'content': comments[i].content,
                'username': comments[i].username,
                'profilePic': comments[i].profile_picture,
                'replies': []
            }
            
            if (comments[i].reply_id) {
                let reply = {
                    'id': comments[i].reply_id,
                    'content': comments[i].reply_content,
                    'username': comments[i].reply_username,
                    'profilePic': comments[i].reply_profile_picture,
                    'replies': []
                }

                comment.replies.push(reply);
            }
            
            commentWithReplies.push(comment);
        }
    }
    
    return commentWithReplies;
}

module.exports = {
    parseComments,
}