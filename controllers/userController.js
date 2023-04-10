const { User, Thought } = require("../models");

module.exports = {
    //get all users
    getUser(req, res) {
        User.find({})
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },
    //get one user
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .populate("thoughts")
            .populate("friends")
            .select("-__v")
            .then((user) => 
                !user
                    ? res.status(404).json({ message: "No user found with that ID "})
                    :res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
    //create new user
    createUser(req, res) {
        User.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => {
                console.error(err);
                return res.status(500).json(err);
            });
    },
    //update User
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true },
        )
            .then((user) => 
                !user
                    ? res.status(404).json({ message: "No User foudn with this ID "})
                    : res.json(user)
                    )
            .catch((err) => res.status(500).json(err));
    },
    //delete user
    //Extra: remove a user's associated thoughts when deleted
    deleteUser(req, res) {
        User.findOneaAndDelete({ _id: req.params.UserId })
            .then((user) => 
                !user
                    ? res.status(404).json({ message: "No user found with that ID" })
                    :Thought.deleteMany({ _id: { $in: user.thoughts } })
            )
            .then(() => res.json({ message: "User and Thought deleted!" }))
            .catch((err) => res.status(500).json(err));
    },
    //add a friend
    addFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.UserId },
            { $addToSet: { friends: req.params.friendId } },
            { runValidators: true, new: true },
        )
        .then((user) => 
            !user
                ? res.status(404).json({ message: "No user found with this ID "})
                : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
    //delete a friend
    deleteFriend(req, res) {
        User.findOneaAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { new: true },
        )
            .then(
                (user) => 
                !user
                    ? res.status(404).json({ message: "No user found with this ID" })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
};
